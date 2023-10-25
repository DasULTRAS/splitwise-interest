"use client";

import LoadingCircle from "@/components/ui/symbols/loadingCircle";
import {useState} from "react";

export default function Trigger() {
    const [message, setMessage] = useState("");
    const [interests, setInterests] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const trigger = async function () {
        setLoading(true);
        const res = await fetch("/api/friend/interests/create");
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
        <div className="mt-10 flex w-full flex-col items-center justify-center">
            <button
                className="flex h-12 w-60 items-center justify-center rounded-xl bg-black text-4xl text-black shadow-lg shadow-red-600 hover:shadow-xl disabled:bg-green-400 dark:text-white"
                onClick={trigger} disabled={loading}>{loading ?
                <LoadingCircle width="10" height="10"/> : "TRIGGER IT"}</button>
            <p className="my-5">{message}</p>
            <p>{JSON.stringify(interests)}</p>
        </div>
    );
}
