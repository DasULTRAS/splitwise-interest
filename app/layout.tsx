import React from "react";
import type {Metadata} from 'next';
import {AuthProvider} from "@/app/api/auth/[...nextauth]/provider";
import Navbar from '@/components/ui/navbar/navbar';
import manifest from '@/app/manifest';

// These styles apply to every route in the application
import './globals.css'

export const metadata: Metadata = {
    title: manifest().name,
    description: manifest().description,
    themeColor: manifest().theme_color,
}

export default function RootLayout({children,}: { children: React.ReactNode }) {
    return (
        <html lang="en">
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
