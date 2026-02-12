import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
    try {
        const { content } = await req.json()

        if (!content || typeof content !== 'string') {
            return NextResponse.json(
                { error: 'Transcript content is required' },
                { status: 400 }
            )
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key is not configured' },
                { status: 500 }
            )
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

        const prompt = `You are an expert project manager. Extract action items from the following meeting transcript.
    For each action item, identify:
    - The task itself (clear and concise)
    - The owner (who is responsible, if mentioned)
    - The due date (if mentioned, format as ISO date if possible like YYYY-MM-DD, or a clear string like "2026-02-20")
    - Tags (an array of short, relevant categories like "Research", "Backend", "UI", etc.)
    
    Return the result ONLY as a JSON object with a key "action_items" containing an array of objects with the following keys: "task", "owner", "dueDate", "tags".
    If no owner or due date is found, use null.
    
    Transcript:
    ${content}`

        const result = await model.generateContent(prompt)
        const response = await result.response
        let text = response.text()

        // Clean up the response text in case Gemini wraps it in markdown code blocks
        text = text.replace(/```json\n?/, '').replace(/\n?```/, '').trim()

        let actionItems = []
        try {
            const parsedResult = JSON.parse(text)
            actionItems = parsedResult.action_items || []
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', text)
            throw new Error('AI returned invalid JSON')
        }

        // Save to database
        const transcript = await prisma.transcript.create({
            data: {
                content,
                actionItems: {
                    create: actionItems.map((item: any) => {
                        let parsedDate = null
                        if (item.dueDate) {
                            const d = new Date(item.dueDate)
                            if (!isNaN(d.getTime())) {
                                parsedDate = d
                            }
                        }
                        return {
                            task: item.task || 'Untitled Task',
                            owner: item.owner || null,
                            dueDate: parsedDate,
                            tags: Array.isArray(item.tags) ? item.tags.join(',') : null,
                            isCompleted: false,
                        }
                    })
                }
            },
            include: {
                actionItems: true
            }
        })

        return NextResponse.json(transcript)
    } catch (error: any) {
        console.error('Error processing transcript:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const transcripts = await prisma.transcript.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                actionItems: true
            }
        })
        return NextResponse.json(transcripts)
    } catch (error) {
        console.error('Error fetching transcripts:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
