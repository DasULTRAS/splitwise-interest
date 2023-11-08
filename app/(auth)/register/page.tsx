'use client'

import React, { useEffect, useState } from "react";
import { signIn } from 'next-auth/react';
import ForgetPasswordButton from "@/components/ui/buttons/forgetPasswordButton";
import RegisterButton from "@/components/ui/buttons/registerButton";
import LoadingCircle from "@/components/ui/symbols/loadingCircle";
import { InputPassword, InputText } from "@/components/ui/input";
import MessageText from "@/components/ui/text/messageText";
import { checkEmail, checkPassword, checkUsername } from "@/utils/validation";

export default function Register() {

    interface RegisterResponse {
        message: string;
    }

    interface LoginResponse {
        error: string,
        ok: boolean,
        status: number,
        url: string | null,
    }

    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevent the default form submit event (page reload)

        setLoading(true);

        if (password !== passwordConfirm) {
            setMessage("Passwords do not match!");
            setLoading(false)
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });

            const responseData: RegisterResponse = await response.json();
            if (!response.ok) {
                setMessage(responseData.message || `Error: ${response.statusText}`);
                return;
            }
            setMessage(responseData.message || "Account created successfully!");

            const user = await signIn('credentials', {
                username: username,
                password: password,
                callbackUrl: '/dashboard',
            }) as LoginResponse;

            if (user.ok) {
                setMessage("Account created successfully!, Login successful!");
            } else {
                setMessage("Account was created, but Login failed?");
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
            }, 10000);
        }

        // Cleanup Funktion, um sicherzustellen, dass der Timer gelöscht wird, wenn die Komponente unmontiert wird
        return () => {
            clearTimeout(timer);
        };
    }, [message]);

    return (
        <div className="container mx-auto w-full max-w-2xl p-5">
            <h3 className="mb-2 text-center text-2xl">Create an Account</h3>
            <div className="rounded-lg bg-white shadow-xl shadow-neutral-900">
                <form className="rounded bg-white px-8 pt-6 pb-8" onSubmit={handleSubmit}>

                    <InputText
                        id={"username"}
                        placeholder={"Username"}
                        className={"text-gray-700"}
                        disabled={loading}
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        inputError={username && checkUsername(username)} />

                    <InputText
                        id="email"
                        placeholder="Email"
                        className="text-gray-700"
                        disabled={loading}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        inputError={email && checkEmail(email)} />


                    <div className="mb-4 w-full md:flex md:justify-between">
                        <InputPassword
                            id="password"
                            placeholder="Password"
                            className="text-gray-700"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            inputError={password && checkPassword(password)} />

                        <InputPassword
                            id="password_confirm"
                            placeholder="Confirm password"
                            className="text-gray-700 md:ml-5"
                            value={passwordConfirm}
                            onChange={(event) => setPasswordConfirm(event.target.value)}
                            inputError={passwordConfirm && checkPassword(passwordConfirm)} />
                    </div>

                    <div className="mb-6 flex w-full justify-center">
                        <button
                            className="flex btn_save"
                            type="submit"
                            disabled={loading || !!checkUsername(username) || !!checkEmail(email) || !!checkPassword(password) || password !== passwordConfirm}>
                            {loading && <LoadingCircle />}
                            <span>Register Account</span>
                        </button>
                    </div>

                    {message &&
                        <MessageText message={message} className="text-black" />
                    }

                    <hr className="mb-6 border-t" />

                    <ForgetPasswordButton />
                    <RegisterButton />
                </form>
            </div>
        </div>
    );
}
