"use client";

import React, { useEffect, useState } from "react";
import MessageText from "@/components/ui/text/messageText";

export default function WeeklyRateForm({ friend_id }: { friend_id: number }) {
    const [weeklyRate, setWeeklyRate] = useState(-1);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeeklyRate = async () => {
            const res = await fetch(`/api/friend/weeklyRate/${friend_id}/`);
            const data = await res.json();
            if (res.ok) {
                setWeeklyRate(data.weeklyRate);
            } else {
                setMessage(data.message);
                setWeeklyRate(0);
            }
        };

        if (weeklyRate === -1)
            fetchWeeklyRate().then(() => setLoading(false));
    }, [friend_id, weeklyRate]);

    // clear message after 5 seconds
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (message) {
            timer = setTimeout(() => {
                setMessage('');
            }, 5000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [message]);

    const handleSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);

        const res = await fetch(`/api/friend/weeklyRate/${friend_id}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ weeklyRate })
        });

        const data = await res.json();
        if (res.ok) {
            setWeeklyRate(data.weeklyRate);
            setMessage(data.message);
        } else {
            setMessage(data.message);
            setWeeklyRate(0);
        }
        setLoading(false);
    }

    return (
        <form className="flex flex-col" onSubmit={handleSubmit}>
            <label htmlFor="weeklyRate" className="text-center">Weekly Rate</label>
            <div className="flex items-center justify-center">
                <input
                    className="w-16 appearance-none rounded-2xl border bg-transparent px-3 outline outline-0 transition-all peer border-blue-gray-200 py-2.5 focus:border-pink-500 disabled:bg-blue-gray-50 disabled:border-0"
                    type="number" name="weeklyRate" id="weeklyRate"
                    value={weeklyRate} disabled={loading}
                    onChange={e => {
                        if (parseInt(e.target.value) >= 0)
                            setWeeklyRate(parseInt(e.target.value))
                    }} />
                <p className="ml-1">%</p>
            </div>
            <button className="text-black dsn_clickable dark:text-white" type="submit">save</button>
            <MessageText message={message} />
        </form>
    );
}
