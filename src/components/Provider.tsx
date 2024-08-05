'use client'
import { SessionProvider, useSession, getSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import { Session } from "next-auth";

interface ProviderProps {
  children: ReactNode;
}

export default function Provider({ children }: ProviderProps) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };
    fetchSession();
  }, []);

  return (
    // <SessionProvider>
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
