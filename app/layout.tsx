import type {Metadata} from 'next'
import {AuthProvider} from "@/app/api/auth/[...nextauth]/provider"
import Navbar from '@/components/ui/navbar/navbar'

// These styles apply to every route in the application
import './globals.css'
import React from "react";

export const metadata: Metadata = {
    title: 'Splitwise interest calculator',
    description: 'A Webapp to automatically calculate interest on Splitwise.',
}

export default function RootLayout({children,}: { children: React.ReactNode }) {
    return (
        <html>
        <body className="flex h-screen w-screen flex-col">
        <AuthProvider>
            <header>
                <Navbar/>
            </header>
            <main className='h-full overflow-x-hidden'>
                {children}
            </main>
        </AuthProvider>
        </body>
        </html>
    )
}
