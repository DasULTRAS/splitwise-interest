"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import LoadingCircle from "@/components/ui/symbols/loadingCircle";
import MessageText from "@/components/ui/text/messageText";
import { InputText } from "@/components/ui/input";
import CopyButton from "@/components/ui/buttons/copyButton";

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
        <div className="m-5 flex w-full flex-col items-center">
            <h1 className="text-center">Splitwise Credentials</h1>
            <hr className="my-3" />

            <form onSubmit={handleSubmit} className="w-full sm:w-[22rem] lg:w-full">
                <div className="w-full lg:flex lg:justify-center">
                    <InputText
                        className="lg:w-[22rem]"
                        id="consumer_key"
                        placeholder="Consumer Key"
                        disabled={loading}
                        value={consumerKey}
                        onChange={(event) => setConsumerKey(event.target.value)} />

                    <InputText
                        id="consumer_secret"
                        className="lg:w-[22rem] lg:ml-3"
                        placeholder="Consumer Secret"
                        disabled={loading}
                        value={consumerSecret}
                        onChange={(event) => setConsumerSecret(event.target.value)} />
                </div>

                <div className="flex w-full justify-center">
                    <button
                        className="flex btn_save"
                        type="submit"
                        disabled={loading || !consumerKey || !consumerSecret}>
                        {loading && <LoadingCircle />}
                        <span>Save</span>
                    </button>
                </div>
            </form>

            {message && <>
                <hr className="my-2" />
                <MessageText message={message} />
            </>}

            <hr className="my-8 w-full border-t" />

            <section id="setup-splitwise">
                <h2 className="mb-3 text-center">
                    <a className="a_link" href="https://secure.splitwise.com/oauth_clients" target="_blank" rel="noopener">Where to find this Credentials?</a>
                </h2>
                <div className="flex">
                    <ol type="1" className="list-inside list-decimal">
                        <li>
                            Login at <a className="a_link" href="https://www.splitwise.com/login" target="_blank" rel="noopener">Splitwise.com</a>
                        </li>
                        <li>
                            Open <a className="a_link" href="https://secure.splitwise.com/apps" target="_blank" rel="noopener">Your apps</a> by
                            <ol type="a" className="ml-5 list-inside list-[lower-alpha]">
                                <li>selecting the profile icon at the top right corner</li>
                                <li>select the point <a className="a_link" href="https://secure.splitwise.com/account/settings" target="_blank" rel="noopener">Your account</a></li>
                                <li>select the button <a className="a_link" href="https://secure.splitwise.com/apps" target="_blank" rel="noopener">Your apps</a> under Privacy & Security</li>
                            </ol>
                        </li>
                        <li>
                            Create a new app by clicking the button <a className="a_link" href="https://secure.splitwise.com/apps/new" target="_blank" rel="noopener">Register your application</a>
                        </li>
                        <li>
                            Insert the data as shown in the photo
                            <ul className="ml-5">
                                <li>
                                    <b>Application name:</b> <CopyButton text="Splitwise-Integration" />
                                </li>
                                <li>
                                    <b>Application description:</b> <CopyButton text="Splitwise Interst Calculator" />
                                </li>
                                <li>
                                    <b>Homepage URL:</b> <CopyButton text="https://splitwise.dasultras.de/" />
                                </li>
                            </ul>
                        </li>
                    </ol>

                    <Image src="/screenshots/splitwise/register_new_app-form.jpg" width={350} height={50} alt="register_new_app-form" />
                </div>
            </section>
        </div>
    )
}
