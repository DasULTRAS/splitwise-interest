'use client'

import React, {useEffect, useState} from "react";
import {signIn} from 'next-auth/react';
import RegisterButton from "@/components/ui/buttons/registerButton";
import MessageText from "@/components/ui/text/messageText";
import ForgetPasswordButton from "@/components/ui/buttons/forgetPasswordButton";
import LoadingCircle from "@/components/ui/symbols/loadingCircle";
import {checkEmail, checkPassword, checkUsername} from "@/utils/validation";

export default function Register() {
    interface InputErrors {
        [key: string]: string;
    }

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
    const [inputErrors, setInputErrors] = useState<InputErrors>({username: "", email: "", password: ""});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);
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
                body: JSON.stringify({username, email, password})
            });

            const responseData: RegisterResponse = await response.json();
            if (!response.ok) {
                setMessage(responseData.message || `Error: ${response.statusText}`);
                return;
            }
            setInputErrors({username: "", email: "", password: ""});
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

    const inputStyles = "w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline";

    return (
        <div className="container mx-auto w-full max-w-2xl p-5">
            <h3 className="mb-2 text-center text-2xl">Create an Account</h3>
            <div className="rounded-lg bg-white shadow-xl shadow-neutral-900">
                <form className="rounded bg-white px-8 pt-6 pb-8" onSubmit={handleSubmit}>
                    {(["Username", "Email"] as const).map((field: string, index) => (
                        <div className="mb-4" key={index}>
                            <label className="mb-2 block text-sm font-bold text-gray-700">{field}</label>
                            <input
                                className={`${inputStyles} ${inputErrors[field.toLowerCase()] ? "border-red-500" : ""}`}
                                id={field.toLowerCase()}
                                type={field.toLowerCase()}
                                autoComplete={field.toLowerCase()}
                                placeholder={field}
                                value={field === "Username" ? username : email}
                                onChange={(event) => field === "Username" ? setUsername(event.target.value) : setEmail(event.target.value)}
                            />
                            {inputErrors[field.toLowerCase()] &&
                                <p className="text-xs italic text-red-500">{inputErrors[field.toLowerCase()]}</p>}
                        </div>
                    ))}

                    <div className="mb-4 w-full md:flex md:justify-between">
                        {["Password", "Confirm Password"].map((field, index) => (
                            <div
                                className={index === 0 ? "w-full md:w-1/2 mb-4 md:mb-0 md:mr-2" : "w-full md:w-1/2 md:ml-2"}
                                key={index}>
                                <label className="mb-2 block text-sm font-bold text-gray-700">{field}</label>
                                <div
                                    className={`flex items-center justify-between ${inputStyles} ${inputErrors?.password ? "border-red-500" : ""}`}>
                                    <input
                                        className="flex-grow focus:outline-none"
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
                                {inputErrors?.password &&
                                    <p className="text-xs italic text-red-500">{inputErrors.password}</p>}
                            </div>
                        ))}
                    </div>

                    <div className="mb-6 flex justify-center">
                        <button
                            className="flex w-fit rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:shadow-outline focus:outline-none disabled:bg-blue-500/50"
                            type="submit"
                            disabled={loading || !!checkUsername(username) || !!checkEmail(email) || !!checkPassword(password) || password !== passwordConfirm}
                        >
                            {loading && <LoadingCircle/>}
                            <span>Register Account</span>
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
