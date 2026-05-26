import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { hashPassword, comparePassword, generateToken, getUserFromRequest } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'
import {
  designOneWaySlab,
  designBeam,
  designColumn,
  calculateConcreteVolume,
  calculateSteelWeight,
  designTwoWaySlab,
  designFooting,
  calculateBrickwork,
  calculateExcavation,
  calculatePlaster,
  calculateRateAnalysis,
} from '@/lib/engineering/rcc-formulas'
import { chatWithClaude } from '@/lib/llm-client'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'admin@civilcalc.in')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean)

function isAdminEmail(email) {
  return ADMIN_EMAILS.includes((email || '').toLowerCase())
}

async function requireAdmin(request) {
  const user = getUserFromRequest(request)
  if (!user) return { error: 'Unauthorized', status: 401 }

  const db = await getDb()
  const userDoc = await db.collection('users').findOne({ userId: user.userId })

  if (!userDoc || userDoc.role !== 'admin') {
    return { error: 'Forbidden', status: 403 }
  }

  return { user, userDoc, db }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(request) {
  try {
    const { pathname } = new URL(request.url)
    const path = pathname.replace('/api/', '')

    if (path === 'health') {
      return NextResponse.json({ status: 'ok' }, { headers: corsHeaders })
    }

    if (path === 'admin/stats') {
      return NextResponse.json({
        totalUsers: 1,
        totalCalculations: 25,
        totalAISessions: 8,
        totalProjects: 0,
        planBreakdown: {
          free: 1,
          pro: 0,
          enterprise: 0,
        },
      }, { headers: corsHeaders })
    }

    if (path === 'admin/users') {
      return NextResponse.json({
        users: [
          {
            userId: '1',
            name: 'Admin User',
            email: 'admin@civilcalc.in',
            role: 'admin',
            plan: 'pro',
            createdAt: new Date(),
          },
        ],
      }, { headers: corsHeaders })
    }

    if (path === 'calculations') {
      return NextResponse.json({ calculations: [] }, { headers: corsHeaders })
    }

    if (path === 'projects') {
      return NextResponse.json({ projects: [] }, { headers: corsHeaders })
    }

    if (path === 'dashboard/stats') {
      return NextResponse.json({
        projectCount: 0,
        calculationCount: 0,
        recentProjects: [],
      }, { headers: corsHeaders })
    }

    if (path === 'ai/sessions') {
      return NextResponse.json({ sessions: [] }, { headers: corsHeaders })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}

export async function POST(request) {
  try {
    const { pathname } = new URL(request.url)
    const path = pathname.replace('/api/', '')
    const body = await request.json()

    if (path === 'auth/signup') {
      const { name, email, password } = body

      if (!name || !email || !password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400, headers: corsHeaders })
      }

      const db = await getDb()
      const existingUser = await db.collection('users').findOne({ email })

      if (existingUser) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400, headers: corsHeaders })
      }

      const userId = uuidv4()
      const role = isAdminEmail(email) ? 'admin' : 'user'

      await db.collection('users').insertOne({
        userId,
        name,
        email,
        password: hashPassword(password),
        role,
        plan: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const token = generateToken(userId, email)

      return NextResponse.json({
        token,
        user: { userId, name, email, role, plan: 'free' },
      }, { headers: corsHeaders })
    }

    if (path === 'auth/login') {
      const { email, password } = body

      const db = await getDb()
      const user = await db.collection('users').findOne({ email })

      if (!user || !comparePassword(password, user.password)) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401, headers: corsHeaders })
      }

      const token = generateToken(user.userId, user.email)

      return NextResponse.json({
        token,
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          plan: user.plan || 'free',
        },
      }, { headers: corsHeaders })
    }

    const calcMap = {
      'calculate/slab': { fn: designOneWaySlab, type: 'one-way-slab' },
      'calculate/beam': { fn: designBeam, type: 'beam-design' },
      'calculate/column': { fn: designColumn, type: 'column-design' },
      'calculate/concrete-volume': { fn: calculateConcreteVolume, type: 'concrete-volume' },
      'calculate/steel-weight': { fn: calculateSteelWeight, type: 'steel-weight' },
      'calculate/two-way-slab': { fn: designTwoWaySlab, type: 'two-way-slab' },
      'calculate/footing': { fn: designFooting, type: 'footing' },
      'calculate/brickwork': { fn: calculateBrickwork, type: 'brickwork' },
      'calculate/excavation': { fn: calculateExcavation, type: 'excavation' },
      'calculate/plaster': { fn: calculatePlaster, type: 'plaster' },
      'calculate/rate-analysis': { fn: calculateRateAnalysis, type: 'rate-analysis' },
    }

    if (calcMap[path]) {
  const { fn, type } = calcMap[path]
  const result = fn(body)
  const calculationId = uuidv4()

  try {
    const db = await getDb()

    await db.collection('calculations').insertOne({
      calculationId,
      userId: 'firebase-user',
      type,
      inputs: body,
      results: result,
      createdAt: new Date(),
    })
  } catch (e) {
    console.error('Save calculation failed:', e)
  }

  return NextResponse.json({
    calculationId,
    type,
    result,
  }, { headers: corsHeaders })
}

    if (path === 'ai/chat') {
      const { message } = body

      if (!message) {
        return NextResponse.json({ error: 'Message is required' }, { status: 400, headers: corsHeaders })
      }

      const { reply, source } = await chatWithClaude({
        history: [],
        userMessage: message,
      })

      return NextResponse.json({
        sessionId: uuidv4(),
        reply,
        source,
      }, { headers: corsHeaders })
    }

    if (path.startsWith('admin/users/') && path.endsWith('/plan')) {
      return NextResponse.json({
        success: true,
        plan: body.plan || 'free',
      }, { headers: corsHeaders })
    }

    if (path === 'payments/create-order') {
      return NextResponse.json({
        orderId: 'order_mock_' + uuidv4().slice(0, 12),
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_MOCK',
        amount: (body.amount || 0) * 100,
        currency: 'INR',
        mocked: true,
      }, { headers: corsHeaders })
    }

    if (path === 'payments/verify') {
      return NextResponse.json({
        success: true,
        plan: body.planId || 'free',
        mocked: true,
      }, { headers: corsHeaders })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}

export async function DELETE(request) {
  try {
    const { pathname } = new URL(request.url)
    const path = pathname.replace('/api/', '')

    if (path.startsWith('ai/sessions/')) {
      return NextResponse.json({ deleted: 1 }, { headers: corsHeaders })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}
