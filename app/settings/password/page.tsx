"use client";

import { checkPassword } from "@/utils/validation";
import LoadingCircle from "@/components/ui/symbols/loadingCircle";
import MessageText from "@/components/ui/text/messageText";
import React, { useEffect, useState } from "react";
import { InputPassword } from "@/components/ui/input";

export default function PasswordChangeForm() {
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevent the default form submit event (page reload)

        setLoading(true);

        if (password !== passwordConfirm) {
            setMessage("Passwords do not match!");
            setLoading(false)
            return;
        }

        try {
            const res = await fetch("/api/user/password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message || "Account created successfully!");
            } else {
                setMessage(data.message || `Error: ${res.statusText}`);
                return;
            }
        } catch (error: any) {
            setMessage(`Error: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    // clear message after 5 seconds
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        // Wenn 'message' einen Wert hat, setzen Sie einen Timer, um es zu löschen
        if (message) {
            timer = setTimeout(() => {
                setMessage(''); // Setzen Sie die Nachricht nach 5 Sekunden zurück
            }, 5000);
        }

        // Cleanup Funktion, um sicherzustellen, dass der Timer gelöscht wird, wenn die Komponente unmontiert wird
        return () => {
            clearTimeout(timer);
        };
    }, [message]);

    return (
        <div className="mx-5 mt-5 w-full">
            <h1 className="text-center text-3xl font-bold">Change Password</h1>

            <form className="rounded pt-6 pb-8" onSubmit={handleSubmit}>
                <div className="mb-4 w-full md:flex md:justify-between">
                    <InputPassword
                        placeholder="Password"
                        className="mb-4 w-full md:mr-2 md:mb-0 md:w-1/2"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        inputError={password && checkPassword(password)} />

                    <InputPassword
                        placeholder="Password Confirm"
                        className="w-full md:ml-2 md:w-1/2"
                        value={passwordConfirm}
                        onChange={(event) => setPasswordConfirm(event.target.value)}
                        inputError={passwordConfirm && checkPassword(passwordConfirm)} />
                </div>

                <div className="mb-6 flex w-full justify-center">
                    <button
                        className="flex btn_save"
                        type="submit"
                        disabled={loading || !!checkPassword(password) || password !== passwordConfirm}>
                        {loading && <LoadingCircle />}
                        <span>Change Password</span>
                    </button>
                </div>

                {message &&
                    <MessageText message={message} className="text-black" />
                }
            </form>
        </div>
    );
}