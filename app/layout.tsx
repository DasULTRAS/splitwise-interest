import type { Metadata } from 'next'
import Navbar from '@/components/ui/navbar/navbar'
import { SidebarProvider } from '@/components/ui/sidebar/sidebarContext';

// These styles apply to every route in the application
import './globals.css'

export const metadata: Metadata = {
    title: 'Splitwise interest calculator',
    description: 'A Webapp to automatically calculate interest on Splitwise.',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
    return (
        <html>
            <body className="h-screen flex flex-col">
                <SidebarProvider>
                    <header>
                        <Navbar />
                    </header>
                    <main className="flex-grow">
                        {children}
                    </main>
                </SidebarProvider>
            </body>
        </html>
    )
}
