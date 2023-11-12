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
            } else {
                setMessage("Error while data fetching: " + response.statusText);
                setTimeout(() => setMessage(""), 5000);
            }
        };

        fetchSplitwiseCredentials().then(() => setLoading(false));
    }, []);

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
        setTimeout(() => setMessage(""), 5000);

        setLoading(false);
    }

    return (
        <div className="m-3 sm:m-5 flex w-full flex-col items-center">
            <h1 className="text-center mb-5">Splitwise Credentials</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-sm lg:max-w-3xl">
                <div className="w-full lg:flex lg:justify-center">
                    <InputText
                        className="w-full"
                        id="consumer_key"
                        placeholder="Consumer Key"
                        disabled={loading}
                        value={consumerKey}
                        onChange={(event) => setConsumerKey(event.target.value)} />

                    <InputText
                        className="w-full lg:ml-2"
                        id="consumer_secret"
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
                <p className="mb-3 text-center">
                    <a className="a_link" href="https://secure.splitwise.com/apps/new" target="_blank" rel="noopener">Register an application</a> in your <a className="a_link" href="https://splitwise.com" target="_blank" rel="noopener">Splitwise</a> account.
                    <br />
                    Steps one and two are <b>optional</b>.
                </p>

                <ol type="1" className="list-inside list-decimal mr-5 space-y-3">
                    <li>
                        Login to <a className="a_link" href="https://www.splitwise.com/login" target="_blank" rel="noopener">Splitwise.com</a>
                    </li>
                    <li>
                        Open the <a className="a_link" href="https://secure.splitwise.com/apps" target="_blank" rel="noopener">&quot;Your apps&quot;</a> Site by
                        <ol type="a" className="ml-5 list-inside list-[lower-alpha]">
                            <li>selecting the profile icon in the top right corner</li>
                            <li>selecting <a className="a_link" href="https://secure.splitwise.com/account/settings" target="_blank" rel="noopener">&quot;Your account&quot;</a></li>
                            <li>select the <a className="a_link" href="https://secure.splitwise.com/apps" target="_blank" rel="noopener">&quot;Your apps&quot;</a> button under Privacy & Security</li>
                        </ol>
                    </li>
                    <li>
                        Create a new application by clicking the <a className="a_link" href="https://secure.splitwise.com/apps/new" target="_blank" rel="noopener">&quot;Register your application&quot;</a> button.
                    </li>
                    <li>
                        Enter the data and commit by clicking the <b>Register</b> button.
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
                    <li>
                        Enter the <b>Consumer Key</b> and <b>Consumer Secret</b> in the form at the top.
                    </li>
                </ol>
            </section>
        </div>
    );
}
