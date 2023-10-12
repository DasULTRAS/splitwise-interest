'use client'

import React, { useEffect, useState } from "react";

export default function Register() {
    interface InputErrors {
        [key: string]: string;
    }

    interface ErrorResponse {
        errors: InputErrors;
        message: string;
    }

    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [inputErrors, setInputErrors] = useState<InputErrors>({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const  handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const responseData: ErrorResponse = await response.json();
            if (!response.ok) {
                setMessage(responseData.message || `Error: ${response.statusText}`);
                return;
            }
            setInputErrors({ username: "", email: "", password: "" });
            setMessage(responseData.message || "Account created successfully!");
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
        <div className="container mx-auto w-full max-w-2xl p-5">
            <h3 className="text-2xl text-center mb-2">Create an Account</h3>
            <div className="bg-white rounded-lg shadow-neutral-900 shadow-xl">
                <form className="px-8 pt-6 pb-8 bg-white rounded" onSubmit={handleSubmit}>
                    {(["Username", "Email"] as const).map((field: string, index) => (
                        <div className="mb-4" key={index}>
                            <label className="block mb-2 text-sm font-bold text-gray-700">{field}</label>
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

                    <div className="md:flex md:justify-between mb-4 w-full">
                        {["Password", "Confirm Password"].map((field, index) => (
                            <div
                                className={index === 0 ? "w-full md:w-1/2 mb-4 md:mb-0 md:mr-2" : "w-full md:w-1/2 md:ml-2"}
                                key={index}>
                                <label className="block mb-2 text-sm font-bold text-gray-700">{field}</label>
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
                                        <button className="ml-2" type="button"
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
                            className="flex w-fit px-4 py-2 font-bold text-white bg-blue-500 disabled:bg-blue-500/50 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                            type="submit"
                            disabled={loading || username.length < 3 || email.length < 4 || password.length < 8 || passwordConfirm.length < 8}
                        >
                            {loading && (
                                <svg className="m-auto animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <span>Register Account</span>
                        </button>
                    </div>

                    {message &&
                        <div className="mb-4 text-center">
                            <p className="italic text-black">{message}</p>
                        </div>
                    }

                    <hr className="mb-6 border-t" />

                    <div className="text-center">
                        <a className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800" href="/password_reset">
                            Forgot Password?
                        </a>
                    </div>
                    <div className="text-center">
                        <a className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                            href="/login">
                            Already have an account? Login!
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
