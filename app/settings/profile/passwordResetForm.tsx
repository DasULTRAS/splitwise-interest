"use client";

import {checkPassword, checkUsername} from "@/utils/validation";
import LoadingCircle from "@/components/ui/symbols/loadingCircle";
import MessageText from "@/components/ui/text/messageText";
import ForgetPasswordButton from "@/components/ui/buttons/forgetPasswordButton";
import RegisterButton from "@/components/ui/buttons/registerButton";
import React, {useEffect, useState} from "react";
import {signIn} from "next-auth/react";

export default function PasswordResetForm() {
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);

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
                body: JSON.stringify({password})
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

    const inputStyles = "w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline";

    return (
        <>
            <h1 className="text-center text-3xl font-bold">Change Password</h1>
            <form className="px-8 pt-6 pb-8 rounded" onSubmit={handleSubmit}>
                <div className="md:flex md:justify-between mb-4 w-full">
                    {["Password", "Confirm Password"].map((field, index) => (
                        <div
                            className={index === 0 ? "w-full md:w-1/2 mb-4 md:mb-0 md:mr-2" : "w-full md:w-1/2 md:ml-2"}
                            key={index}>
                            <label
                                className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-200">{field}</label>
                            <div
                                className={`flex items-center justify-between ${inputStyles}`}>
                                <input
                                    className="flex-grow focus:outline-none dark:text-gray-200"
                                    id={field === "Password" ? "password" : "c_password"}
                                    autoComplete="new-password"
                                    type={(field === "Password") ? (showPassword ? "text" : "password") : (showPasswordConfirm ? "text" : "password")}
                                    placeholder="Password"
                                    value={field === "Password" ? password : passwordConfirm}
                                    onChange={(event) => field === "Password" ? setPassword(event.target.value) : setPasswordConfirm(event.target.value)}
                                />
                                {(field === "Password" ? password : passwordConfirm) &&
                                    <button className="ml-2" type="button" tabIndex={-1}
                                            onMouseDown={() => field === "Password" ? setShowPassword(true) : setShowPasswordConfirm(true)}
                                            onMouseUp={() => field === "Password" ? setShowPassword(false) : setShowPasswordConfirm(false)}
                                            onMouseLeave={() => field === "Password" ? setShowPassword(false) : setShowPasswordConfirm(false)}
                                            onTouchStart={() => field === "Password" ? setShowPassword(true) : setShowPasswordConfirm(true)}
                                            onTouchEnd={() => field === "Password" ? setShowPassword(false) : setShowPasswordConfirm(false)}
                                    >show</button>}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mb-6 flex justify-center">
                    <button
                        className="flex w-fit px-4 py-2 font-bold text-white bg-blue-500 disabled:bg-blue-500/50 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                        type="submit"
                        disabled={loading || !!checkPassword(password) || password !== passwordConfirm}
                    >
                        {loading && <LoadingCircle/>}
                        <span>Change Password</span>
                    </button>
                </div>

                {message &&
                    <MessageText message={message} className="text-black"/>
                }

                <hr className="mb-6 border-t"/>

                <ForgetPasswordButton/>
                <RegisterButton/>
            </form>
        </>
    );
}