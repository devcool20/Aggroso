import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { task, owner, dueDate, tags } = await req.json()

        if (!task) {
            return NextResponse.json(
                { error: 'Task is required' },
                { status: 400 }
            )
        }

        const actionItem = await prisma.actionItem.create({
            data: {
                task,
                owner: owner || null,
                dueDate: dueDate ? new Date(dueDate) : null,
                tags: tags || null,
                transcriptId: id,
                isCompleted: false,
            },
        })

        return NextResponse.json(actionItem)
    } catch (error: any) {
        console.error('Error creating action item:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        )
    }
}
