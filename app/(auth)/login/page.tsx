'use client'

import React, {useState} from "react";
import {signIn} from 'next-auth/react';
import RegisterButton from "@/components/ui/buttons/registerButton";
import MessageText from "@/components/ui/text/messageText";
import ForgetPasswordButton from "@/components/ui/buttons/forgetPasswordButton";
import LoadingCircle from "@/components/ui/symbols/loadingCircle";
import {checkPassword, checkUsername} from "@/utils/validation";

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
                callbackUrl: '/dashboard',
            }) as LoginResponse;

            console.log(user);

            if (user.ok) {
                setMessage("Login successful!");
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
            <h3 className="mb-2 text-center text-2xl">Login</h3>
            <div className="rounded-lg bg-white shadow-xl shadow-neutral-900">
                <form className="rounded bg-white px-8 pt-6 pb-8" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700">Benutzername oder E-Mail</label>
                        <input
                            className={inputStyles}
                            id="idString"
                            type="text"
                            placeholder="Benutzername oder E-Mail"
                            value={idString}
                            onChange={(event) => setIdString(event.target.value)}
                        />
                    </div>

                    <div className="mb-4 w-full">
                        <label className="mb-2 block text-sm font-bold text-gray-700">Password</label>
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
                            <button className="ml-2" type="button" tabIndex={-1}
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
                            className="flex w-fit rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:shadow-outline focus:outline-none disabled:bg-blue-500/50"
                            type="submit"
                            disabled={loading || !!checkUsername(idString) || !!checkPassword(password)}
                        >
                            {loading && <LoadingCircle/>}
                            <span>Login</span>
                        </button>
                    </div>

                    {message &&
                        <MessageText message={message} className="text-black"/>
                    }

                    <hr className="mb-6 border-t"/>

                    <ForgetPasswordButton/>
                    <RegisterButton/>
                </form>
            </div>
        </div>
    );
}
