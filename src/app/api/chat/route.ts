import { PromptSchema, Prompt } from "@/lib/schemas";
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from "next/server";
import { messageHandler } from '@/lib/messageHandler';
import { z } from "zod";

export async function POST(request: NextRequest) {
    try {
        const data: Prompt = PromptSchema.parse(await request.json())
        const user = await db.user.findUnique({where: { id: data.userId}})
        if (!user) {
            return NextResponse.json({ message: "User not found."}, { status: 500 })
        }
        let conversation = await db.conversation.findUnique({where: { id: data.conversationId },include: { messages: true },})
        if (!conversation) {
            conversation = {
                ...await db.conversation.create({
                    data: {
                        name: data.conversationName || "New Conversation "+ data.prompt.slice(0, 10)||data.userId.split("-")[0],
                        userId: data.userId,
                    },
                }), 
                messages: []
            }
        }
        const models = await db.assistant.findMany({select: { name: true, id: true }})
        if (data.model !in models.map(i => i.name)) {
            return NextResponse.json({ message: "Model isn't avalable."}, { status: 500 })
        }

        const response = await messageHandler({
            user: {
                id: user.id,
                prompt: data.prompt,
                image: data.image,
            }, 
            conversation: conversation, 
            assistant: models.find(i => i.name == data.model) || models[0],
        })
        if (response == null) {
            return NextResponse.json({ message: "Internal server error. Please try again later.", }, { status: 500 })
        }

        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error}, { status: 400 })
        } else {
            return NextResponse.json({ message: "Internal server error. Please try again later."}, { status: 500 })
        }
    }
}