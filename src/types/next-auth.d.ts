// types.d.ts
import { $Enums } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role: $Enums.UserRole;
    id: string;
    name: string;
    email: string;
    image?: string;
  }

  interface Session {
    user?: {
      role: $Enums.UserRole;
      id: string;
      name: string;
      email: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: $Enums.UserRole;
    id?: string;
    name?: string;
    email?: string;
    picture?: string;
  }
}
