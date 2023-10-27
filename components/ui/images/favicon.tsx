import Image from "next/image";

export default function Favicon({ className, width, height }: { className?: string, alt?: string, width?: number, height?: number }) {
    return (
        <>
            <Image className={`block dark:hidden ${className}`} src="/icons/favicon-light.ico" alt="favicon" width={width}
                   height={height} loading="lazy"/>
            <Image className={`hidden dark:block ${className}`} src="/favicon.ico" alt="favicon"
                   width={width} height={height} loading="lazy"/>
        </>
    )
}
