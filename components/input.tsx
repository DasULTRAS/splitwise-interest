"use client";

import React, { useState } from "react";

const inputStyles = "w-full px-3 py-2 mb-3 text-sm leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline";

export function Input({ id, label, placeholder = label, className, disabled, value, type = "text", onChange, inputError }: { id: string, label?: string, placeholder?: string, className?: string, disabled?: boolean, value: string, type?: string, onChange: React.ChangeEventHandler<HTMLInputElement>, inputError?: string }) {

    return (
        <div key={id} className={className}>
            <label className="mb-1 block text-sm font-bold">{label}</label>
            <input
                className={inputStyles}
                type={type}
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

export function InputPassword({ id = "password", label, placeholder = label, className, value, onChange, inputError }: { id?: string, key?: string, label?:string, placeholder?: string, className?: string, value: string, onChange: React.ChangeEventHandler<HTMLInputElement>, inputError?: string }) {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className={`mb-4 w-full ${className}`} key={id}>
            <label className="mb-1 block text-sm font-bold">{label}</label>
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
