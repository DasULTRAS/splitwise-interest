export function HoverLabel({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div
            className={`absolute top-8 left-1/2 z-10 -translate-x-1/2 transform rounded bg-black p-2 ${className}`}>
            {children}
            <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform bg-black"></div>
        </div>
    );
}