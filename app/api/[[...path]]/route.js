import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { hashPassword, comparePassword, generateToken } from '@/lib/auth'
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-User-Id, X-User-Email',
}

function getStableUserId(request) {
  const headerUid = request.headers.get('x-user-id')

  if (headerUid) {
    return headerUid
  }

  const authHeader = request.headers.get('authorization')

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '').trim()
  }

  return 'guest-user'
}

function cleanCalculation(doc) {
  return {
    ...doc,
    _id: doc?._id?.toString?.() || undefined,
    createdAt:
      doc?.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : doc?.createdAt || new Date().toISOString(),
  }
}

async function saveCalculation(request, { type, inputs, results }) {
  const db = await getDb()
  const calculationId = uuidv4()
  const userId = getStableUserId(request)

  const calculation = {
    calculationId,
    userId,
    type,
    inputs: inputs || {},
    results: results || {},
    createdAt: new Date(),
  }

  await db.collection('calculations').insertOne(calculation)

  return calculation
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(request) {
  try {
    const { pathname } = new URL(request.url)
    const path = pathname.replace('/api/', '')
    const userId = getStableUserId(request)

    if (path === 'health') {
      return NextResponse.json({ status: 'ok' }, { headers: corsHeaders })
    }

    if (path === 'dashboard/stats') {
      const db = await getDb()

      const calculationCount = await db
        .collection('calculations')
        .countDocuments({ userId })

      const recentCalculations = await db
        .collection('calculations')
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray()

      const projectCount = await db
        .collection('projects')
        .countDocuments({ userId })
        .catch(() => 0)

      return NextResponse.json(
        {
          projectCount,
          calculationCount,
          recentProjects: recentCalculations.map(cleanCalculation),
        },
        { headers: corsHeaders }
      )
    }

    if (path === 'calculations') {
      const db = await getDb()

      const calculations = await db
        .collection('calculations')
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray()

      return NextResponse.json(
        { calculations: calculations.map(cleanCalculation) },
        { headers: corsHeaders }
      )
    }

    if (path === 'projects') {
      const db = await getDb()

      const projects = await db
        .collection('projects')
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray()
        .catch(() => [])

      return NextResponse.json(
        {
          projects: projects.map((p) => ({
            ...p,
            _id: p?._id?.toString?.() || undefined,
            createdAt:
              p?.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p?.createdAt || null,
          })),
        },
        { headers: corsHeaders }
      )
    }

    if (path === 'ai/sessions') {
      return NextResponse.json({ sessions: [] }, { headers: corsHeaders })
    }

    if (path === 'admin/stats') {
      const db = await getDb()

      const totalCalculations = await db
        .collection('calculations')
        .countDocuments({})

      const totalAISessions = await db
        .collection('ai_sessions')
        .countDocuments({})
        .catch(() => 0)

      const totalUsers = await db.collection('users').countDocuments({})

      const totalProjects = await db
        .collection('projects')
        .countDocuments({})
        .catch(() => 0)

      return NextResponse.json(
        {
          totalUsers,
          totalCalculations,
          totalAISessions,
          totalProjects,
          planBreakdown: {
            free: 1,
            pro: 0,
            enterprise: 0,
          },
        },
        { headers: corsHeaders }
      )
    }

    if (path === 'admin/users') {
      const db = await getDb()

      const users = await db
        .collection('users')
        .find(
          {},
          {
            projection: {
              password: 0,
              _id: 0,
            },
          }
        )
        .sort({ createdAt: -1 })
        .limit(500)
        .toArray()

      return NextResponse.json({ users }, { headers: corsHeaders })
    }

    return NextResponse.json(
      { error: 'Not found' },
      { status: 404, headers: corsHeaders }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    )
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
        return NextResponse.json(
          { error: 'All fields are required' },
          { status: 400, headers: corsHeaders }
        )
      }

      const db = await getDb()
      const existingUser = await db.collection('users').findOne({ email })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400, headers: corsHeaders }
        )
      }

      const userId = uuidv4()
      const role = email === 'admin@civilcalc.in' ? 'admin' : 'user'

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

      return NextResponse.json(
        {
          token,
          user: { userId, name, email, role, plan: 'free' },
        },
        { headers: corsHeaders }
      )
    }

    if (path === 'auth/login') {
      const { email, password } = body

      const db = await getDb()
      const user = await db.collection('users').findOne({ email })

      if (!user || !comparePassword(password, user.password)) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401, headers: corsHeaders }
        )
      }

      const token = generateToken(user.userId, user.email)

      return NextResponse.json(
        {
          token,
          user: {
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role || 'user',
            plan: user.plan || 'free',
          },
        },
        { headers: corsHeaders }
      )
    }

    const calcMap = {
      'calculate/slab': {
        fn: designOneWaySlab,
        type: 'one-way-slab',
      },
      'calculate/beam': {
        fn: designBeam,
        type: 'beam-design',
      },
      'calculate/column': {
        fn: designColumn,
        type: 'column-design',
      },
      'calculate/concrete-volume': {
        fn: calculateConcreteVolume,
        type: 'concrete-volume',
      },
      'calculate/steel-weight': {
        fn: calculateSteelWeight,
        type: 'steel-weight',
      },
      'calculate/two-way-slab': {
        fn: designTwoWaySlab,
        type: 'two-way-slab',
      },
      'calculate/footing': {
        fn: designFooting,
        type: 'footing',
      },
      'calculate/brickwork': {
        fn: calculateBrickwork,
        type: 'brickwork',
      },
      'calculate/excavation': {
        fn: calculateExcavation,
        type: 'excavation',
      },
      'calculate/plaster': {
        fn: calculatePlaster,
        type: 'plaster',
      },
      'calculate/rate-analysis': {
        fn: calculateRateAnalysis,
        type: 'rate-analysis',
      },
    }

    if (calcMap[path]) {
      const { fn, type } = calcMap[path]
      const result = fn(body)

      const calculation = await saveCalculation(request, {
        type,
        inputs: body,
        results: result,
      })

      return NextResponse.json(
        {
          calculationId: calculation.calculationId,
          type,
          result,
        },
        { headers: corsHeaders }
      )
    }

    if (path === 'calculations/save' || path === 'calculations') {
      const type = body.type || body.calculatorType || 'calculation'
      const inputs = body.inputs || {}
      const results = body.results || body.result || {}

      const calculation = await saveCalculation(request, {
        type,
        inputs,
        results,
      })

      return NextResponse.json(
        {
          success: true,
          calculationId: calculation.calculationId,
          calculation: cleanCalculation(calculation),
        },
        { headers: corsHeaders }
      )
    }

    if (path === 'ai/chat') {
      const { message } = body

      if (!message) {
        return NextResponse.json(
          { error: 'Message is required' },
          { status: 400, headers: corsHeaders }
        )
      }

      const { reply, source } = await chatWithClaude({
        history: [],
        userMessage: message,
      })

      return NextResponse.json(
        {
          sessionId: uuidv4(),
          reply,
          source,
        },
        { headers: corsHeaders }
      )
    }

    if (path.startsWith('admin/users/') && path.endsWith('/plan')) {
      return NextResponse.json(
        {
          success: true,
          plan: body.plan || 'free',
        },
        { headers: corsHeaders }
      )
    }

    if (path === 'auth/update-profile') {
      const { name, email } = body

      return NextResponse.json(
        {
          success: true,
          user: {
            name,
            email,
          },
        },
        { headers: corsHeaders }
      )
    }

    if (path === 'payments/create-order') {
      return NextResponse.json(
        {
          orderId: 'order_mock_' + uuidv4().slice(0, 12),
          key: process.env.RAZORPAY_KEY_ID || 'rzp_test_MOCK',
          amount: (body.amount || 0) * 100,
          currency: 'INR',
          mocked: true,
        },
        { headers: corsHeaders }
      )
    }

    if (path === 'payments/verify') {
      return NextResponse.json(
        {
          success: true,
          plan: body.planId || 'free',
          mocked: true,
        },
        { headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { error: 'Not found' },
      { status: 404, headers: corsHeaders }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function DELETE() {
  return NextResponse.json({ deleted: 1 }, { headers: corsHeaders })
}
