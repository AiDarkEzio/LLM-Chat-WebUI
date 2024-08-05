import { SignOutButton } from "@/components/buttons";
import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Page() {
    const session = await getServerSession(authOptions)
    return (
        <div className="flex flex-col items-center justify-center gap-4 surface p-8 rounded-lg">
            <h1 className="text-3xl font-bold">LLM Chat WebUI</h1>
            <p className="text-lg">This is a web interface for interacting with large language models.</p>
            <div className="flex flex-row items-center justify-center">
                {session?.user ? (<>
                    <Link className="mx-5 font-bold primary p-2 rounded-lg mt-4" href={"/chat/newChat"}>Start a new chat</Link>
                    <SignOutButton />
                    {/* <Link className="mx-5 font-bold primary p-2 rounded-lg mt-4" href={"/api/auth/signout"}>Sign Out</Link> */}
                </>):(<>
                    <Link className="mx-5 font-bold primary p-2 rounded-lg mt-4" href={"/api/auth/signin"}>Sign In</Link>
                    <Link className="mx-5 font-bold primary p-2 rounded-lg mt-4" href={"/signup"}>Sign Up</Link>
                </>)}
            </div>
        </div>
    )
}