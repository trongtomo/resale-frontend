import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI haven\'t been set in .env')

const options = {
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  maxPoolSize: 20, 
  minPoolSize: 5,  
  maxIdleTimeMS: 30000, 
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000, 
  heartbeatFrequencyMS: 10000, 
  retryWrites: true,
  retryReads: true,
  readPreference: 'primary',
  writeConcern: { w: 'majority', j: true }
}

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

export default clientPromise