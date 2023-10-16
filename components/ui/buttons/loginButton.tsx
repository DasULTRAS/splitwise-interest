'use client'

import React, { useState } from "react";
import { signOut } from 'next-auth/react';

interface nextAuthUser {
    name?: string | null | undefined; 
    email?: string | null | undefined;
    image?: string | null | undefined;
};

export default function LoginButton({ user }: nextAuthUser | undefined ) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        await signOut();
        setLoading(false);
    };

    return (
        <>
            {user ?
                <button onClick={handleClick}>
                    {loading && (
                        <svg className="m-auto animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>)}
                    Logout</button> :
                <a href="/login">
                    <h2>Login</h2>
                </a>
            }
        </>
    );
};