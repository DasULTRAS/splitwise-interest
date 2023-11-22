"use client";

import React, { useEffect, useState } from "react";
import MessageText from "@/components/text/messageText";
import { Input } from "@/components/input";
import { ArrowHeadDown, ArrowHeadUp } from "@/components/symbols/arrow";
import { checkApy, checkCycles, checkMinDebtAge, checkNextDate } from "@/utils/validation";

export default function RateSettingsForm({ friend_id }: Readonly<{ friend_id: number }>) {
    const [initialised, setInitialised] = useState<boolean>(false);

    const [apy, setAPY] = useState<number>(0);
    const [cycles, setCycles] = useState<number>(7);
    const [minDebtAge, setMinDebtAge] = useState<number>(14);
    const [nextDate, setNextDate] = useState<Date>(new Date());
    const [showAllSettings, setShowAllSettings] = useState<boolean>(false);

    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchValues = async () => {
            try {
                const res = await fetch(`/api/friend/settings/${friend_id}/`);
                const data = await res.json();

                if (res.ok) {
                    setAPY(data?.settings?.apy);
                    setCycles(data?.settings?.cycles);
                    setMinDebtAge(data?.settings?.minDebtAge);
                    setNextDate(new Date(data.settings.nextDate));
                } else {
                    setMessage(data.message);
                    setTimeout(() => setMessage(""), 5000);
                }
            } catch (error) {
                if (error instanceof TypeError) {
                    setMessage("Error: " + error.message);
                    setTimeout(() => setMessage(""), 10000);
                } else {
                    throw error;
                }
            }
        };

        if (!initialised)
            fetchValues().then(() => {
                setLoading(false);
                setInitialised(true)
            });
    }, [initialised, friend_id]);

    const handleSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);

        try {
            const nextDateISO = nextDate.toISOString();
            const res = await fetch(`/api/friend/settings/${friend_id}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ settings: { apy, cycles, minDebtAge, nextDate: nextDateISO } })
            });

            const data = await res.json();

            if (res.ok) {
                setAPY(data?.settings?.apy || 0);
                setCycles(data?.settings?.cycles || 7);
                setMinDebtAge(data?.settings?.minDebtAge || 14);
                setNextDate(new Date(data.settings.nextDate));

                setMessage(data.message);
                setTimeout(() => setMessage(""), 5000);
            } else {
                setMessage("Error: " + data.message);
                setTimeout(() => setMessage(""), 10000);
            }
        } catch (error) {
            if (error instanceof TypeError) {
                setMessage("Error: " + error.message);
            } else {
                throw error;
            }
            setTimeout(() => setMessage(""), 10000);
        }

        setLoading(false);
    }

    return (
        <form className="flex flex-col max-w-lg" onSubmit={handleSubmit}>
            {/* APY */}
            <div className="md:mx-auto">
                <label htmlFor="setting-slider" className="block text-sm font-bold mb-2">
                    Annual percentage yield (%)
                </label>
                <div className="md:flex">
                    <input
                        id="setting-slider" type="range"
                        className="md:mr-2 w-full"
                        min="0" max="150" value={apy}
                        disabled={loading}
                        onChange={(e) => setAPY(e.target.valueAsNumber)}
                    />
                    <Input id="apy" type="number"
                        placeholder="APY (%)"
                        className="md:w-24"
                        min={0}
                        value={apy}
                        disabled={loading}
                        onChange={e => setAPY(e.target.valueAsNumber)}
                        inputError={checkApy(apy)}
                    />
                </div>
            </div>

            {/* See more */}
            <button className="flex mx-auto font-mono shadow-sm my-3" type="button" onClick={() => { setShowAllSettings(!showAllSettings) }}>
                {showAllSettings ?
                    <>
                        <p className="mr-2">Hide all settings</p>
                        <ArrowHeadUp />
                    </> : <>
                        <p className="mr-2">Show all settings</p>
                        <ArrowHeadDown />
                    </>}
            </button>

            {showAllSettings &&
                <>
                    <div className="md:flex">
                        {/* Number input for cycles */}
                        < Input type="number"
                            id="cycles-input" label="Days between two interests"
                            className="mb-4 md:mr-2"
                            min={1} max={365}
                            value={cycles}
                            disabled={loading}
                            onChange={(e) => setCycles(e.target.valueAsNumber)}
                            inputError={checkCycles(cycles)}
                        />

                        {/* Number input for min age of days */}
                        <Input type="number"
                            id="min-age-input" label="Min Debt Age in Days"
                            className="mb-4 md:ml-2"
                            min={1} max={365}
                            value={minDebtAge}
                            disabled={loading}
                            onChange={(e) => setMinDebtAge(e.target.valueAsNumber)}
                            inputError={checkMinDebtAge(minDebtAge)}
                        />
                    </div>

                    {/* Date input */}
                    <Input id="start-date" type="date" label="Next Date"
                        className="mb-4 w-full md:w-1/2"
                        value={nextDate.toISOString().split('T')[0]} // Format the date in YYYY-MM-DD format
                        disabled={loading}
                        onChange={(e) => { if (e.target.value) setNextDate(new Date(e.target.value + 'T00:00:00Z')) }}
                        inputError={checkNextDate(nextDate)}
                    />
                </>
            }

            <button className="btn_save mx-auto" disabled={loading} type="submit">save</button>
            <MessageText message={message} />
        </form >
    );
}
