import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Page({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role == 'USER') {
        redirect('/')
    }

    return (<>
        {children}
    </>)
}