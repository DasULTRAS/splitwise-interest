"use client";

import React, { useState } from "react";

const inputStyles = "w-full px-3 py-2 mb-3 text-sm leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline";

export function InputText({ id, placeholder, className, disabled, value, onChange, inputError }: { id: string, placeholder?: string, className?: string, disabled?: boolean, value: string, onChange: React.ChangeEventHandler<HTMLInputElement>, inputError?: string }) {

    return (
        <div className={`mb-4 ${className}`}>
            <label className="mb-2 block text-sm font-bold">{placeholder}</label>
            <input
                id={id}
                className={inputStyles}
                type="text"
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                onChange={onChange}
            />
            {inputError &&
                <p className="text-xs italic text-red-500">{inputError}</p>}
        </div>
    );
}

export function InputPassword({ id = "password", placeholder, className, value, onChange, inputError }: { id?: string, key?: string, placeholder?: string, className?: string, value: string, onChange: React.ChangeEventHandler<HTMLInputElement>, inputError?: string }) {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className={`mb-4 w-full ${className}`} key={id}>
            <label className="mb-2 block text-sm font-bold">{placeholder}</label>
            <div
                className={`flex items-center justify-between ${inputStyles}`}>
                <input
                    className="flex-grow focus:outline-none"
                    id={id}
                    autoComplete="off"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={value}
                    onChange={onChange}
                />
                <button className="btn_default" type="button" tabIndex={-1}
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                    onTouchStart={() => setShowPassword(true)}
                    onTouchEnd={() => setShowPassword(false)}
                >show
                </button>
            </div>
            {inputError &&
                <p className="text-xs italic text-red-500">{inputError}</p>}
        </div>
    );
}
