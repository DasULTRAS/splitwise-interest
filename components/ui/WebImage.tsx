"use client";

export default function WebImage({ src, className, width, height }: { src: string, className?: string, width?: number, height?: number }) {
    return (
        <>
            <img src={src} className={className} width={width} height={height} />
        </>
    )
}
