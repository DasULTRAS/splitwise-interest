import type {Metadata} from 'next'

// These styles apply to every route in the application
import './globals.css'

export const metadata: Metadata = {
    title: 'Splitwise interest calculator',
    description: 'A Webapp to automatically calculate interest on Splitwise.',
}

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }) {
    return (
        <html lang="de">
        <body>{children}</body>
        </html>
    )
}
