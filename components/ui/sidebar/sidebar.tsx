import { DefaultUser, Session } from "next-auth";
import LoginButton from '../../buttons/loginButton';
import React from "react";
import Link from "next/link";

interface SidebarIsOpenProps {
    closeModal: () => void;
    session?: Session | null;
}

export default function Sidebar({ closeModal, session }: SidebarIsOpenProps) {
    return (
        <>
            <div className="absolute top-0 left-0 z-10 h-screen w-screen bg-white/10">
                <div className="flex">
                    <div className="w-full h-screen" onClick={closeModal} />
                    <div
                        className="top-0 ml-auto flex h-screen flex-col rounded-2xl bg-black/80 p-6 w-3/4 sm:w-2/4 md:w-1/4">
                        <div className="flex">
                            <p className="text-2xl text-white">Sidebar</p>

                            <button title="btn_sidebar_close" className="ml-auto text-white" onClick={closeModal}>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <hr className="mb-6 border-t" />

                        <ul className="space-y-2 text-white"
                            onClick={closeModal}>
                            <li>
                                <Link href="/settings" className="btn_clickable p-2 rounded-2xl">Settings</Link>
                            </li>
                        </ul>

                        <div className="flex mt-auto ml-auto text-white items-center">
                            <LoginButton user={session?.user as DefaultUser} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
