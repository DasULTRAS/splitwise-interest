'use client'

import React, { useState } from "react";
import { redirect } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react';
import RegisterButton from "../../../components/ui/buttons/registerButton";
import MessageText from "../../../components/ui/text/messageText";
import ForgetPasswordButton from "../../../components/ui/buttons/forgetPasswordButton";

export default function Login() {
    interface LoginResponse {
        error: string,
        ok: boolean,
        status: number,
        url: string | null,
    }

    const [idString, setIdString] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLoading(true);

        try {
            const user = await signIn('credentials', {
                username: idString,
                password: password,
                callbackUrl: '/'
            }) as LoginResponse;

            if (user.ok) {
                setMessage(`Login successful!`);
            } else {
                setMessage("Login failed!");
            }
        } catch (error: any) {
            setMessage(`Error: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const inputStyles = "w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline";

    return (
        <div className="container mx-auto w-full max-w-2xl p-5">
            <h3 className="text-2xl text-center mb-2">Login</h3>
            <div className="rounded-lg bg-white shadow-neutral-900 shadow-xl">
                <form className="px-8 pt-6 pb-8 bg-white rounded" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Benutzername oder E-Mail</label>
                        <input
                            className={inputStyles}
                            id="idString"
                            type="text"
                            placeholder="Benutzername oder E-Mail"
                            value={idString}
                            onChange={(event) => setIdString(event.target.value)}
                        />
                    </div>

                    <div className="w-full mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Password</label>
                        <div
                            className={`flex items-center justify-between ${inputStyles}`}>
                            <input
                                className="flex-grow focus:outline-none"
                                id="password"
                                autoComplete="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            <button className="ml-2" type="button"
                                onMouseDown={() => setShowPassword(true)}
                                onMouseUp={() => setShowPassword(false)}
                                onMouseLeave={() => setShowPassword(false)}
                                onTouchStart={() => setShowPassword(true)}
                                onTouchEnd={() => setShowPassword(false)}
                            >show
                            </button>
                        </div>
                    </div>

                    <div className="mb-6 flex justify-center">
                        <button
                            className="flex w-fit px-4 py-2 font-bold text-white bg-blue-500 disabled:bg-blue-500/50 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                            type="submit"
                            disabled={loading || (idString.length < 3) || (password.length < 8)}
                        >
                            {loading && (
                                <svg className="m-auto animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <span>Login</span>
                        </button>
                    </div>

                    {message &&
                        <MessageText message={message} />
                    }

                    <hr className="mb-6 border-t" />

                    <ForgetPasswordButton />
                    <RegisterButton />
                </form>
            </div>
        </div>
    );
}
