// // Use the direct import to ensure the generated client is found
// import { PrismaClient } from '@prisma/client' 
// import { PrismaNeon } from '@prisma/adapter-neon'
// import { Pool, neonConfig } from '@neondatabase/serverless'
// import ws from 'ws'

// // Required for Neon to work in serverless/Node.js environments.
// // This must be set before any Pool is instantiated.
// if (typeof window === 'undefined') {
//   neonConfig.webSocketConstructor = ws
// }

// const prismaClientSingleton = () => {
//   // Use the bracket notation to bypass Turbopack environment optimizations
//   const rawUrl = process.env['DATABASE_URL']?.trim()
//   console.log(process.env.DATABASE_URL);

//   if (!rawUrl || rawUrl === 'undefined') {
//     console.error('DATABASE_URL is missing from process.env');
//     throw new Error('❌ DATABASE_URL is missing. Check your .env.local file.');
//   }

//   // Clean common Neon dashboard copy-paste artifacts (psql prefix and quotes)
//   const connectionString = rawUrl.replace(/^psql\s+/, '').replace(/^["']|["']$/g, '')
  
//   if (!connectionString.startsWith('postgres')) {
//     throw new Error('❌ Cleaned connection string does not start with postgres.');
//   }

//   // Setup Neon adapter for runtime queries. 
//   // Explicitly mapping connectionString ensures the Pool doesn't receive an empty object.
//   const pool = new Pool({ connectionString: connectionString })
  
//   // Fix: Type-safe bridge for the Pool mismatch. 
//   // ConstructorParameters ensures we match the expected type of the adapter version installed.
//   const adapter = new PrismaNeon(
//     pool as unknown as ConstructorParameters<typeof PrismaNeon>[0]
//   )

//   // Do NOT pass datasourceUrl here; the adapter handles it.
//   return new PrismaClient({ adapter })
// }

// declare global {
//   var prisma: undefined | ReturnType<typeof prismaClientSingleton>
// }

// const prisma = globalThis.prisma ?? prismaClientSingleton()

// // Cache the instance in globalThis for development (prevents too many connections)
// if (process.env.NODE_ENV !== 'production') {
//   globalThis.prisma = prisma
// }

// export default prisma

import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws
}

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is missing')
  }

  const adapter = new PrismaNeon({ connectionString })

  return new PrismaClient({ adapter })
}

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma