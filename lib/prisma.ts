import { PrismaClient } from '@prisma/client'
import path from 'path'

// This ensures the DB file is found correctly on Vercel
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
