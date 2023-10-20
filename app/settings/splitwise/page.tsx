"use client";

import React, {useEffect, useState} from "react";
import MessageText from "@/components/ui/text/messageText";
import LoadingCircle from "@/components/ui/symbols/loadingCircle";

export default function SplitwiseSettings() {
    const [consumerKey, setConsumerKey] = useState("");
    const [consumerSecret, setConsumerSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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
        else
            setMessage("Error while saving: " + response.statusText);

        setLoading(false);
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold">Splitwise Credentials</h1>
            <a href="https://secure.splitwise.com/oauth_clients" target="_blank">Where to find this Credentials?</a>
            <br/>

            <div className="my-5"/>

            <form onSubmit={handleSubmit}>
                {(["Consumer Key", "Consumer Secret"] as const).map((field: string, index) => (
                    <div className="flex flex-col mb-4" key={index}>
                        <label className="block">{field}</label>
                        <input
                            id={field.toLowerCase()}
                            type={field.toLowerCase()}
                            autoComplete={field.toLowerCase()}
                            placeholder={field}
                            value={field === "Consumer Key" ? consumerKey : consumerSecret}
                            onChange={(event) => field === "Consumer Key" ? setConsumerKey(event.target.value) : setConsumerSecret(event.target.value)}
                        />
                    </div>
                ))}

                <div className="mb-6 flex justify-center">
                    <button className="flex" id="btn-save"
                            type="submit"
                            disabled={!consumerKey || !consumerSecret}>
                        {loading && <LoadingCircle/>}
                        <span>Save</span>
                    </button>
                </div>

                {message && <>
                    <hr className="my-3"/>
                    <MessageText message={message}/>
                </>}
            </form>
        </div>
    )
}
  