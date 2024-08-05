import { NextResponse } from "next/server";
import ollama from "ollama";

export async function GET() {
    try {
        const models = (await ollama.list()).models.map(model => model.name)
        return NextResponse.json(models, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong", conversation: null }, { status: 500 })
    }
}