import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Header({ adminPanel = true }: { adminPanel?: boolean }) {
    if (adminPanel) {
        const session = await getServerSession(authOptions)
        return (
            <header className="mt-1 flex items-center justify-between h-16 px-4 surface">
                <Link href={'/'} className="text-3xl font-bold hover:shadow-lg">LLM Chat WebUI</Link>
                {
                    session?.user?.role === 'ADMIN'? (
                        <Link href={'/admin-panel'} className="secondary p-1 px-2 rounded-md shadow-md">Admin Panel</Link>
                    ) : ('')
                    
                }
            </header>
        )
    } else {
        return (
            <header className="mt-1 flex items-center justify-between h-16 px-4 surface">
                <Link href={'/'} className="text-3xl font-bold hover:shadow-lg">LLM Chat WebUI</Link>
                <Link href={'/chat/newChat'} className="secondary p-1 px-2 rounded-md shadow-md">Chat</Link>
            </header>
        )

    }
}