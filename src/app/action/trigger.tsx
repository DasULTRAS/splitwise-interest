"use client";

import LoadingCircle from "@/components/symbols/loadingCircle";
import { useState } from "react";

export default function Trigger() {
  const [message, setMessage] = useState("");
  const [interests, setInterests] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const trigger = async function () {
    setLoading(true);
    const res = await fetch("/api/friend/interests/create", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setMessage(data.message);
      setInterests(data.interests);
    } else {
      try {
        const data = await res.json();
        setMessage(data.message);
      } catch {
        setMessage(res.statusText);
      }
    }
    setLoading(false);
  };

  return (
    <div className="mt-10 mb-5 flex w-full flex-col items-center justify-center">
      <button
        className="flex h-12 w-60 items-center justify-center rounded-xl text-4xl text-black shadow-lg shadow-red-600 hover:shadow-xl disabled:bg-black/20 dark:bg-black dark:text-white"
        onClick={trigger}
        disabled={loading}
      >
        {loading ? <LoadingCircle width="10" height="10" /> : "TRIGGER IT"}
      </button>
      <p className="my-5">{message}</p>
      <p>{JSON.stringify(interests)}</p>
    </div>
  );
}
