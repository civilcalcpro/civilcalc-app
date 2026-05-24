import { MongoClient } from 'mongodb'

// Lazy, request-time MongoDB connection.
// Important: no top-level throws or connections, so `next build` and pod boot succeed
// even before runtime env vars are fully injected. Connection happens on first getDb().

let clientPromise = null

function buildClient() {
  const uri = process.env.MONGO_URL
  if (!uri) {
    throw new Error('MONGO_URL environment variable is required')
  }
  const client = new MongoClient(uri, {
    // Production-friendly connection options for Atlas / managed Mongo
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  })
  return client.connect()
}

function getClientPromise() {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = buildClient()
    }
    return global._mongoClientPromise
  }
  if (!clientPromise) {
    clientPromise = buildClient()
  }
  return clientPromise
}

export async function getDb() {
  const client = await getClientPromise()
  const dbName = process.env.DB_NAME || 'civilcalc_pro'
  return client.db(dbName)
}

export default { getDb }
