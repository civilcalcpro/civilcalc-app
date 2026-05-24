import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Lazy JWT_SECRET resolution — checked at call-time, not module load.
// This lets `next build` succeed on Vercel even if env vars aren't injected
// during the static analysis phase, and surfaces a clear runtime error otherwise.
function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return secret
}

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10)
}

export function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash)
}

export function generateToken(userId, email) {
  return jwt.sign({ userId, email }, getSecret(), { expiresIn: '30d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, getSecret())
  } catch (error) {
    return null
  }
}

export function getUserFromRequest(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.substring(7)
  return verifyToken(token)
}
