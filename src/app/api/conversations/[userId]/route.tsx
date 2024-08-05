import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";


export async function GET(request: NextRequest, context: { params: { userId: string } }) {
    try {
        if (!context.params.userId) {
            return NextResponse.json({ message: "User ID is required." }, { status: 400 })
        }
        const conversations = await db.conversation.findMany({
            where: {
                userId: context.params.userId,
            },
            select: {
                id: true,
                updatedAt: true,
                userId: true,
                name: true
            }
        });

        return NextResponse.json(conversations, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 })
    }
}