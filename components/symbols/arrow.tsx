export function ArrowHeadUp({ width = "24", height = "24" }: { width?: string, height?: string }) {
    return (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 15l-6-6-6 6" />
            </svg>
        </>
    );
}

export function ArrowHeadDown({ width = "24", height = "24" }: { width?: string, height?: string }) {
    return (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
            </svg>
        </>
    );
}
