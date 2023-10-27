'use client'

import React, { useState } from "react";
import { signIn } from 'next-auth/react';
import ForgetPasswordButton from "@/components/ui/buttons/forgetPasswordButton";
import RegisterButton from "@/components/ui/buttons/registerButton";
import LoadingCircle from "@/components/ui/symbols/loadingCircle";
import { checkPassword, checkUsername } from "@/utils/validation";
import { InputPassword, InputText } from "@/components/ui/input";
import MessageText from "@/components/ui/text/messageText";

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

    return (
        <div className="container mx-auto w-full max-w-2xl p-5">
            <h3 className="mb-2 text-center text-2xl">Login</h3>
            <div className="rounded-lg bg-white shadow-xl shadow-neutral-900">
                <form className="rounded bg-white px-8 pt-6 pb-8" onSubmit={handleSubmit}>

                    <InputText
                        className="text-gray-700"
                        placeholder="Benutzername oder E-Mail"
                        id="username"
                        value={idString}
                        onChange={(event) => setIdString(event.target.value)} />
                    <InputPassword
                        className="text-gray-700"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)} />

                    <div className="mb-6 w-full flex justify-center">
                        <button
                            id="btn_save"
                            className="flex"
                            type="submit"
                            disabled={loading || !!checkUsername(idString) || !!checkPassword(password)}>
                            {loading && <LoadingCircle />}
                            <span>Login</span>
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
