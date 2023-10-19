import { DefaultUser, Session } from "next-auth";
import LoginButton from '../buttons/loginButton';

interface SidebarIsOpenProps {
    sidebarIsOpen: boolean;
    closeModal: () => void;
    session?: Session | null;
}

export default function Sidebar({ sidebarIsOpen, closeModal, session }: SidebarIsOpenProps) {
    return (
        <>
            {
                sidebarIsOpen &&
                <div className="z-10 absolute left-0 top-0 h-screen w-screen bg-white/10"
                    onClick={closeModal}>
                    <div className="ml-auto top-0 h-screen w-1/4 bg-black/80 rounded-2xl">
                        <div className="flex p-5">
                            <p className="text-2xl">Sidebar</p>
                            <button title="btn_sidebar_close" className="ml-auto text-black" onClick={closeModal}>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="flex mt-auto p-5">
                            <LoginButton user={session?.user as DefaultUser} />
                        </div>
                    </div>
                </div>
            }
        </>
    );
}
