"use client";

import { useState } from "react";
import { HoverLabel } from "../label";

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
        type="button"
        onClick={handleCopyClick}
        className="z-0 rounded p-1 text-black hover:underline dark:text-white"
      >
        {text}
      </button>

      {isCopied && <HoverLabel className="text-xs text-white">Text copied!</HoverLabel>}
    </div>
  );
}

export async function CopyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Fehler beim Kopieren des Texts: ", err);
  }
}
