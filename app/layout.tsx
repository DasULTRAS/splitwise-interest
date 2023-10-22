import type { Metadata } from 'next'
import { AuthProvider } from "@/app/api/auth/[...nextauth]/provider"
import Navbar from '@/components/ui/navbar/navbar'

// These styles apply to every route in the application
import './globals.css'

export const metadata: Metadata = {
    title: 'Splitwise interest calculator',
    description: 'A Webapp to automatically calculate interest on Splitwise.',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
    return (
        <html>
            <body className="h-screen w-screen flex flex-col">
                <AuthProvider>
                    <header>
                        <Navbar />
                    </header>
                    <main>
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    )
}
