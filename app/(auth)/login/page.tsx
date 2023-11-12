"use client";

import React, { useState } from "react";
import { SignInResponse, signIn } from 'next-auth/react';
import ForgetPasswordButton from "@/components/buttons/forgetPasswordButton";
import RegisterButton from "@/components/buttons/registerButton";
import LoadingCircle from "@/components/symbols/loadingCircle";
import { checkPassword, checkUsername } from "@/utils/validation";
import { InputPassword, InputText } from "@/components/input";
import MessageText from "@/components/text/messageText";
import { useRouter, useParams } from "next/navigation";

export default function Login() {
    const [idString, setIdString] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>("");
    const router = useRouter();
    const params = useParams();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLoading(true);

        try {
            const res = await signIn('credentials', {
                username: idString,
                password: password,
                redirect: false
            }) as SignInResponse;

            // Redirect
            if (!res) {
                setMessage("Wait for redirect...");
            } else if (res.ok) {
                setMessage("Login successful!");
            } else {
                setMessage(`Login Error (${res.status}): ${res.status === 401 ? 'wrong Credentials' : res.error || 'Unknown error'}`);
            }

            let callbackUrl: string = params?.callbackUrl?.toString() || "/dashboard";

            setTimeout(() => {
                router.refresh();
                router.replace(callbackUrl);
            }, 1000);

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

                    <div className="mb-6 flex w-full justify-center">
                        <button
                            className="btn_save flex"
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
