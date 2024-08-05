import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOption";

const auth = NextAuth(authOptions);

export { auth as GET, auth as POST }