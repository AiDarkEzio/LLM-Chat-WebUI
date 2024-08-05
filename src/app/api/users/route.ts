import { NextResponse } from "next/server";
import {User} from '@/types/types';
import {db} from '@/lib/db';

export async function GET() {
    try {
        const users: User[] = await db.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: true,
                image: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return NextResponse.json(users, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong", conversation: null }, { status: 500 })
    }
}