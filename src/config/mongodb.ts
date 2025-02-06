import { Db, MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environtment'

let trelloDatabaseInstance: Db | null = null

// Khởi tạo một instance của MongoClient để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect() // Connect to the MongoDB cluster
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME) // Get the database instance
}

export const GET_DB = () => {
  if (!trelloDatabaseInstance) {
    throw new Error('Database is not connected')
  }
  return trelloDatabaseInstance
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
  trelloDatabaseInstance = null
}
