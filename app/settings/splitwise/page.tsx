"use client";

import React, { useEffect, useState } from "react";
import MessageText from "@/components/ui/text/messageText";
import LoadingCircle from "@/components/ui/symbols/loadingCircle";
import { InputText } from "@/components/ui/input";

export default function SplitwiseSettings() {
    const [consumerKey, setConsumerKey] = useState("");
    const [consumerSecret, setConsumerSecret] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Load old data
    useEffect(() => {
        const fetchSplitwiseCredentials = async () => {
            setLoading(true);

            const response = await fetch("/api/user/splitwise", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setConsumerKey(data.consumerKey);
                setConsumerSecret(data.consumerSecret);
            } else
                setMessage("Error while data fetching: " + response.statusText);
        };

        fetchSplitwiseCredentials().then(() => setLoading(false));
    }, []);

    // clear message after 10 seconds
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        // Wenn 'message' einen Wert hat, setzen Sie einen Timer, um es zu löschen
        if (message) {
            timer = setTimeout(() => {
                setMessage(''); // Setzen Sie die Nachricht nach 5 Sekunden zurück
            }, 10000);
        }

        // Cleanup Funktion, um sicherzustellen, dass der Timer gelöscht wird, wenn die Komponente unmontiert wird
        return () => {
            clearTimeout(timer);
        };
    }, [message]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const response = await fetch("/api/user/splitwise", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                consumerKey: consumerKey,
                consumerSecret: consumerSecret
            }),
        });

        if (response.ok)
            setMessage("Data saved successfully");
        else {
            const data = await response.json();
            setMessage("Error while saving: " + data.message || response.statusText);
        }

        setLoading(false);
    }

    return (
        <div className="mx-5 mt-5 flex w-full flex-col items-center">
            <h1 className="text-center text-4xl font-bold">Splitwise Credentials</h1>
            <a href="https://secure.splitwise.com/oauth_clients" target="_blank">Where to find this Credentials?</a>
            <br />

            <div className="my-5" />

            <form onSubmit={handleSubmit} className="w-full max-96 sm:w-96">
                <InputText
                    id={"consumer_key"}
                    placeholder={"Consumer Key"}
                    disabled={loading}
                    value={consumerKey}
                    onChange={(event) => setConsumerKey(event.target.value)} />
                <InputText
                    id={"consumer_secret"}
                    placeholder={"Consumer Secret"}
                    disabled={loading}
                    value={consumerSecret}
                    onChange={(event) => setConsumerSecret(event.target.value)} />

                <div className="mb-6 flex justify-center">
                    <button className="flex" id="btn_save"
                        type="submit"
                        disabled={loading || !consumerKey || !consumerSecret}>
                        {loading && <LoadingCircle />}
                        <span>Save</span>
                    </button>
                </div>
            </form>

            {message && <>
                <hr className="my-3" />
                <MessageText message={message} />
            </>}
        </div>
    )
}
