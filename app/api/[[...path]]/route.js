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
} from '@/lib/engineering/rcc-formulas'
import { chatWithClaude } from '@/lib/llm-client'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// OPTIONS handler
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// GET handler
export async function GET(request) {
  try {
    const { pathname } = new URL(request.url)
    const path = pathname.replace('/api/', '')

    // Health check
    if (path === 'health') {
      return NextResponse.json({ status: 'ok' }, { headers: corsHeaders })
    }

    // Get current user
    if (path === 'auth/me') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }
      
      const db = await getDb()
      const userDoc = await db.collection('users').findOne({ userId: user.userId })
      
      if (!userDoc) {
        return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders })
      }
      
      return NextResponse.json({
        userId: userDoc.userId,
        name: userDoc.name,
        email: userDoc.email,
        plan: userDoc.plan || 'free',
        createdAt: userDoc.createdAt,
      }, { headers: corsHeaders })
    }

    // Get user projects
    if (path === 'projects') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }

      const db = await getDb()
      const projects = await db.collection('projects')
        .find({ userId: user.userId })
        .sort({ updatedAt: -1 })
        .limit(50)
        .toArray()

      return NextResponse.json({ projects }, { headers: corsHeaders })
    }

    // Get calculations
    if (path === 'calculations') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }

      const db = await getDb()
      const calculations = await db.collection('calculations')
        .find({ userId: user.userId })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray()

      return NextResponse.json({ calculations }, { headers: corsHeaders })
    }

    // Get dashboard stats
    if (path === 'dashboard/stats') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }

      const db = await getDb()
      const projectCount = await db.collection('projects').countDocuments({ userId: user.userId })
      const calculationCount = await db.collection('calculations').countDocuments({ userId: user.userId })
      const recentProjects = await db.collection('projects')
        .find({ userId: user.userId })
        .sort({ updatedAt: -1 })
        .limit(5)
        .toArray()

      return NextResponse.json({
        projectCount,
        calculationCount,
        recentProjects,
      }, { headers: corsHeaders })
    }

    // List AI chat sessions
    if (path === 'ai/sessions') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }
      const db = await getDb()
      const sessions = await db.collection('ai_sessions')
        .find({ userId: user.userId }, { projection: { messages: 0 } })
        .sort({ updatedAt: -1 })
        .limit(50)
        .toArray()
      return NextResponse.json({ sessions }, { headers: corsHeaders })
    }

    // Get single AI session
    if (path.startsWith('ai/sessions/')) {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }
      const sessionId = path.replace('ai/sessions/', '')
      const db = await getDb()
      const session = await db.collection('ai_sessions').findOne({ sessionId, userId: user.userId })
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404, headers: corsHeaders })
      }
      return NextResponse.json({ session }, { headers: corsHeaders })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders })
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}

// POST handler
export async function POST(request) {
  try {
    const { pathname } = new URL(request.url)
    const path = pathname.replace('/api/', '')
    const body = await request.json()

    // User signup
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
      const hashedPassword = hashPassword(password)

      await db.collection('users').insertOne({
        userId,
        name,
        email,
        password: hashedPassword,
        plan: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const token = generateToken(userId, email)

      return NextResponse.json({
        message: 'User created successfully',
        token,
        user: { userId, name, email, plan: 'free' },
      }, { headers: corsHeaders })
    }

    // User login
    if (path === 'auth/login') {
      const { email, password } = body

      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400, headers: corsHeaders }
        )
      }

      const db = await getDb()
      const user = await db.collection('users').findOne({ email })

      if (!user || !comparePassword(password, user.password)) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401, headers: corsHeaders }
        )
      }

      const token = generateToken(user.userId, user.email)

      return NextResponse.json({
        message: 'Login successful',
        token,
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          plan: user.plan || 'free',
        },
      }, { headers: corsHeaders })
    }

    // Create project
    if (path === 'projects') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }

      const { name, description, type } = body
      const projectId = uuidv4()

      const db = await getDb()
      await db.collection('projects').insertOne({
        projectId,
        userId: user.userId,
        name,
        description: description || '',
        type: type || 'general',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return NextResponse.json({
        message: 'Project created',
        projectId,
      }, { headers: corsHeaders })
    }

    // RCC One-Way Slab Design
    if (path === 'calculate/slab') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }

      const result = designOneWaySlab(body)
      
      // Save calculation
      const calculationId = uuidv4()
      const db = await getDb()
      await db.collection('calculations').insertOne({
        calculationId,
        userId: user.userId,
        type: 'one-way-slab',
        inputs: body,
        results: result,
        createdAt: new Date(),
      })

      return NextResponse.json({
        calculationId,
        result,
      }, { headers: corsHeaders })
    }

    // RCC Beam Design
    if (path === 'calculate/beam') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }

      const result = designBeam(body)
      
      const calculationId = uuidv4()
      const db = await getDb()
      await db.collection('calculations').insertOne({
        calculationId,
        userId: user.userId,
        type: 'beam-design',
        inputs: body,
        results: result,
        createdAt: new Date(),
      })

      return NextResponse.json({
        calculationId,
        result,
      }, { headers: corsHeaders })
    }

    // RCC Column Design
    if (path === 'calculate/column') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }

      const result = designColumn(body)
      
      const calculationId = uuidv4()
      const db = await getDb()
      await db.collection('calculations').insertOne({
        calculationId,
        userId: user.userId,
        type: 'column-design',
        inputs: body,
        results: result,
        createdAt: new Date(),
      })

      return NextResponse.json({
        calculationId,
        result,
      }, { headers: corsHeaders })
    }

    // Concrete Volume
    if (path === 'calculate/concrete-volume') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }

      const result = calculateConcreteVolume(body)
      
      const calculationId = uuidv4()
      const db = await getDb()
      await db.collection('calculations').insertOne({
        calculationId,
        userId: user.userId,
        type: 'concrete-volume',
        inputs: body,
        results: result,
        createdAt: new Date(),
      })

      return NextResponse.json({
        calculationId,
        result,
      }, { headers: corsHeaders })
    }

    // Steel Weight
    if (path === 'calculate/steel-weight') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }

      const result = calculateSteelWeight(body)
      
      const calculationId = uuidv4()
      const db = await getDb()
      await db.collection('calculations').insertOne({
        calculationId,
        userId: user.userId,
        type: 'steel-weight',
        inputs: body,
        results: result,
        createdAt: new Date(),
      })

      return NextResponse.json({
        calculationId,
        result,
      }, { headers: corsHeaders })
    }

    // AI Chat
    if (path === 'ai/chat') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }
      const { sessionId: maybeSessionId, message } = body
      if (!message || typeof message !== 'string') {
        return NextResponse.json({ error: 'message is required' }, { status: 400, headers: corsHeaders })
      }

      const db = await getDb()
      const sessions = db.collection('ai_sessions')

      let session = null
      if (maybeSessionId) {
        session = await sessions.findOne({ sessionId: maybeSessionId, userId: user.userId })
      }

      const now = new Date()
      if (!session) {
        const sessionId = uuidv4()
        session = {
          sessionId,
          userId: user.userId,
          title: message.slice(0, 60),
          messages: [],
          createdAt: now,
          updatedAt: now,
        }
        await sessions.insertOne(session)
      }

      const userMsg = { role: 'user', content: message, createdAt: now }

      // Build history (existing + new user message will be added inside chatWithClaude)
      const { reply, source, model } = await chatWithClaude({
        history: session.messages,
        userMessage: message,
      })

      const assistantMsg = {
        role: 'assistant',
        content: reply,
        source,
        model: model || null,
        createdAt: new Date(),
      }

      const updateFields = {
        $push: { messages: { $each: [userMsg, assistantMsg] } },
        $set: { updatedAt: new Date() },
      }
      // Set title on first message
      if (!session.title || session.messages.length === 0) {
        updateFields.$set.title = message.slice(0, 60)
      }
      await sessions.updateOne({ sessionId: session.sessionId, userId: user.userId }, updateFields)

      return NextResponse.json(
        { sessionId: session.sessionId, reply, source },
        { headers: corsHeaders }
      )
    }

    // Razorpay (MOCKED) — create order
    if (path === 'payments/create-order') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }
      const { planId, billing, amount } = body
      const orderId = 'order_mock_' + uuidv4().slice(0, 12)
      const db = await getDb()
      await db.collection('orders').insertOne({
        orderId,
        userId: user.userId,
        planId,
        billing,
        amount,
        currency: 'INR',
        status: 'created',
        createdAt: new Date(),
      })
      // In real Razorpay, you'd return the Razorpay order id + key
      return NextResponse.json({
        orderId,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_MOCK',
        amount: amount * 100, // paise
        currency: 'INR',
        mocked: true,
      }, { headers: corsHeaders })
    }

    // Razorpay (MOCKED) — verify payment
    if (path === 'payments/verify') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }
      const { orderId, paymentId, planId } = body
      const db = await getDb()
      await db.collection('orders').updateOne(
        { orderId, userId: user.userId },
        { $set: { status: 'paid', paymentId, paidAt: new Date() } }
      )
      await db.collection('users').updateOne(
        { userId: user.userId },
        { $set: { plan: planId, planUpdatedAt: new Date() } }
      )
      return NextResponse.json({ success: true, plan: planId, mocked: true }, { headers: corsHeaders })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders })
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}


// DELETE handler
export async function DELETE(request) {
  try {
    const { pathname } = new URL(request.url)
    const path = pathname.replace('/api/', '')

    if (path.startsWith('ai/sessions/')) {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
      }
      const sessionId = path.replace('ai/sessions/', '')
      const db = await getDb()
      const r = await db.collection('ai_sessions').deleteOne({ sessionId, userId: user.userId })
      return NextResponse.json({ deleted: r.deletedCount }, { headers: corsHeaders })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}
