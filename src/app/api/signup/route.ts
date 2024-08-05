import { SignUpFormData, SignUpSchema } from "@/lib/schemas";
import { db } from '@/lib/db';
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { User } from "@prisma/client";

export async function POST(request: NextRequest) {
    try {
        const data: SignUpFormData = SignUpSchema.parse(await request.json())
        if (await db.user.findUnique({where: { username: data.username }})) {
            return NextResponse.json({ message: "User already exists."}, { status: 500 })
        }
        if (await db.user.findUnique({where: { email: data.email }})) {
            return NextResponse.json({ message: "Email already exists."}, { status: 500 })
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        const user: User = await db.user.create({
            data: {
                name: data.name,
                username: data.username,
                email: data.email,
                passwordHash: hashedPassword,
            },
        })
        return NextResponse.json(user, { status: 200 })
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error}, { status: 400 })
        } else {
            return NextResponse.json({ message: "Internal server error. Please try again later."}, { status: 500 })
        }
    }
}