"use client";

import { useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyClick = async () => {
        await CopyToClipboard(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000); // Die Nachricht wird nach 3 Sekunden ausgeblendet
    };

    return (
        <div className="relative inline-block">
            <button
                type='button'
                onClick={handleCopyClick}
                className="z-0 rounded p-1 text-black hover:underline dark:text-white"
            >
                {text}
            </button>

            {isCopied && (
                <div
                    className="absolute top-8 left-1/2 z-10 -translate-x-1/2 transform rounded bg-black p-2 text-xs text-white">
                    Text copied!
                    <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform bg-black"></div>
                </div>
            )}
        </div>
    );
}

export async function CopyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Fehler beim Kopieren des Texts: ', err);
    }
};
