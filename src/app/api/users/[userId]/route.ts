
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(request: NextRequest, context: { params: { userId: string } }) {
    try {
        if (!context.params.userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }
        let user = await db.user.findUnique({ where: { id: context.params.userId }});
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const deletedUser = await db.user.delete({where: { id: context.params.userId } });
        if (!deletedUser) {
            return NextResponse.json({ message: 'Failed to delete user.' }, { status: 500 });
        }
        return NextResponse.json(deletedUser, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong"}, { status: 500 })
    }
}