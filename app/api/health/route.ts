import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface HealthStatus {
  backend: 'healthy' | 'unhealthy' | 'checking'
  database: 'healthy' | 'unhealthy' | 'checking'
  llm: 'healthy' | 'unhealthy' | 'checking'
}

export async function GET() {
  const status: HealthStatus = {
    backend: 'healthy',
    database: 'unhealthy',
    llm: 'unhealthy',
  }

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`
    status.database = 'healthy'
  } catch (error) {
    console.error('Database health check failed:', error)
  }

  // Check LLM connection (Gemini)
  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-api-key-here') {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      // Simple check
      await model.generateContent("ping")
      status.llm = 'healthy'
    }
  } catch (error) {
    console.error('LLM health check failed:', error)
  }

  return NextResponse.json(status)
}
