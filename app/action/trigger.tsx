"use client";

import LoadingCircle from "@/components/ui/symbols/loadingCircle";
import { useState } from "react";

export default function Trigger() {
    const [message, setMessage] = useState("");
    const [interests, setInterests] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const trigger = async function () {
        setLoading(true);
        const res = await fetch("/api/friend/cron/interests/create");
        if (res.ok) {
            const data = await res.json();
            setMessage(data.message);
            setInterests(data.interests);
        } else {
            try {
                const data = await res.json();
                setMessage(data.message);
            } catch (e) {
                setMessage(res.statusText);
            }
        }
        setLoading(false);
    }

    return (
        <div className="flex flex-col mt-10 w-full justify-center items-center">
            <button className="flex items-center justify-center text-4xl h-12 w-56 bg-black shadow-lg shadow-red-600 hover:shadow-xl disabled:bg-green-400 rounded-xl text-black dark:text-white" onClick={trigger} disabled={loading}>{loading ? <LoadingCircle width="10" height="10"/> : "TRIGGER IT"}</button>
            <p className="my-5">{message}</p>
            <p>{JSON.stringify(interests)}</p>
        </div>
    );
}