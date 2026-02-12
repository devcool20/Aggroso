import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await req.json()
        const { task, owner, dueDate, isCompleted } = body

        const updatedItem = await prisma.actionItem.update({
            where: { id },
            data: {
                ...(task !== undefined && { task }),
                ...(owner !== undefined && { owner }),
                ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
                ...(isCompleted !== undefined && { isCompleted }),
            },
        })

        return NextResponse.json(updatedItem)
    } catch (error: any) {
        console.error('Error updating action item:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.actionItem.delete({
            where: { id },
        })
        return new NextResponse(null, { status: 204 })
    } catch (error: any) {
        console.error('Error deleting action item:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        )
    }
}
