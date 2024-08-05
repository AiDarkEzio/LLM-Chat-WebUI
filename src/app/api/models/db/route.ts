import { NextRequest, NextResponse } from "next/server";
import {db} from "@/lib/db";
import ollama from "ollama";

export async function GET() {
    try {
        const models = await db.assistant.findMany({select: {id: true, name: true}})
        return NextResponse.json(models, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const data: {name: string} = await request.json()
        const ollamaModels = (await ollama.list()).models.map(m => m.name)
        if (!ollamaModels.includes(data.name)) {
            return NextResponse.json({ message: "Model not found in ollama." }, { status: 404 })
        }
        const model = await db.assistant.create({data: {name: data.name}})
        return NextResponse.json(model, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong"}, { status: 500 })
    }
}