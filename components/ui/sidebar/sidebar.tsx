import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import LoginButton from '../buttons/loginButton';
import ToggleButton from './toggleButton';

export default function Sidebar() {
    // const session = getServerSession(options);

    return (
        <>
            { // session && (
                <div className="z-20 absolute right-0 h-screen w-1/4 bg-black/70 rounded-2xl">
                    <div className="flex p-5">
                        <p className="text-2xl">Sidebar</p>
                        <ToggleButton className="text-white flex ml-auto">✖</ToggleButton>
                    </div>
                    <div className="flex mt-auto p-5">
                        <LoginButton  />
                    </div>
                </div>
                // )
            }
        </>
    );
}
