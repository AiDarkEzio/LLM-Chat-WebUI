import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import toast from "react-hot-toast";
import { User as NextAuthUser } from "next-auth";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          let user = await db.user.findUnique({ where: { email: credentials.email } });
          if (!user) {
            return null;
          }
          const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!isValidPassword) {
            toast.error("Invalid password");
            return null;
          }
          return {
            email: user.email,
            name: user.name,
            role: user.role,
            id: user.id,
            image: user.image || undefined,
          } as NextAuthUser; // Cast the user to NextAuthUser to ensure type compatibility
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.picture = user.image;
      }
      // console.log("JWT: ", token);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id??"",
          email: token.email??"",
          name: token.name??"",
          role: token.role??"USER",
          image: token.picture,
        };
      }
      // console.log("SESSION: ", session);
      return session;
    },
  },
  theme: {
    colorScheme: "dark",
    brandColor: "#03DAC5",
    buttonText: "#ffffff",
  },
};
