import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(request: NextRequest, context: { params: { assistantId: string } }) {
    try {
        if (!context.params.assistantId) {
            return NextResponse.json({ message: "Assistant ID is required" }, { status: 400 });
        }
        let assistant = await db.assistant.findUnique({ where: { id: context.params.assistantId }});
        if (!assistant) {
            return NextResponse.json({ message: "Assistant not found" }, { status: 404 });
        }
        const deletedAssistant = await db.assistant.delete({where: { id: context.params.assistantId } });
        if (!deletedAssistant) {
            return NextResponse.json({ message: 'Failed to delete assistant.' }, { status: 500 });
        }
        return NextResponse.json(deletedAssistant, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong"}, { status: 500 })
    }
}