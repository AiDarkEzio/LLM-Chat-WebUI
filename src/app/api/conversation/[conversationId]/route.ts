import { db } from "@/lib/db";
import { Conversation } from "@/types/types";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: { conversationId: string } }) {
    try {
        if (!context.params.conversationId) {
            return NextResponse.json({ message: "Conversation ID is required" }, { status: 400 });
        }
        const conversation: Conversation | null = await db.conversation.findUnique({
            where: {
                id: context.params.conversationId,
            },
            select: {
                messages: {
                    select: {
                        id: true,
                        conversationId: true,
                        userId: true,
                        senderId: true,
                        text: true,
                        createdAt: true,
                        updatedAt: true,
                        image: true,
                        role: true,
                        User: {
                            select: {
                                name: true,
                            }
                        },
                        Assistant: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                id: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                name: true
            }
        });
        if (!conversation) {
            return NextResponse.json({ message: "Conversation not found" }, { status: 404 });
        }
        return NextResponse.json(conversation, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong", conversation: null }, { status: 500 })
    }
}