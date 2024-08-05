'use client'
import { signIn, signOut } from "next-auth/react"

// export function SignInButton() {
//     return (
//         <button className="mx-5 font-bold primary p-2 rounded-lg mt-4" onClick={() => signIn()}>Sign In</button>
//     )
// }

export function SignOutButton() {
    return (
        <button 
        className="mx-5 font-bold primary p-2 rounded-lg mt-4" 
        onClick={() => signOut(
            {
                callbackUrl: '/'
            },
        )}>Sign Out</button>
    )
}