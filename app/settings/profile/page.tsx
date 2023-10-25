"use client";

import Image from "next/image";
import React, {useEffect, useState} from "react";
import LoadingCircle from "@/components/ui/symbols/loadingCircle";
import MessageText from "@/components/ui/text/messageText";

export default function ProfileSettings() {
    const [avatar, setAvatar] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAvatar = async () => {
            setLoading(true);
            const response = await fetch("/api/user/avatar", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAvatar(data?.avatar);
            } else
                setMessage("Error while fetching old avatar: " + response.statusText);
        };

        if (!avatar)
            fetchAvatar().then(() => setLoading(false));
    }, [avatar]);

    // clear message after 10 seconds
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        // Wenn 'message' einen Wert hat, setzen Sie einen Timer, um es zu löschen
        if (message) {
            timer = setTimeout(() => {
                setMessage('');
            }, 10000);
        }

        // Cleanup Funktion, um sicherzustellen, dass der Timer gelöscht wird, wenn die Komponente unmontiert wird
        return () => {
            clearTimeout(timer);
        };
    }, [message]);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);

        const file = event.target.files?.[0];
        // Check if file exists, has right datatype and smaller than 2mb
        if (file)
            if (/^image\/(jpe?g|png|gif|svg|ico)$/i.test(file.type)) {
                if (file.size / 1024 / 1024 < 2) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file)

                    reader.onload = () => {
                        setAvatar(reader.result as string);
                    };
                    reader.onerror = () => {
                        setMessage("Error loading image");
                    }
                } else
                    setMessage(`Max Upload Size is 2MB (${file.size / 1024 / 1024}).`);
            } else
                setMessage(`Unsupported datatype: ${file.type}`);

        setLoading(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!avatar) return;

        setLoading(true);

        try {
            const response = await fetch("/api/user/avatar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({avatar})
            });

            if (response.ok) {
                setMessage("Image saved.")
            } else {
                setMessage(`Error: ${response.statusText}`);
                return;
            }
        } catch (error: any) {
            setMessage(error.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-5 mt-5 w-full">
            <h1 className="text-center text-3xl font-bold">Profile</h1>

            <form className="flex flex-col items-center justify-center"
                  onSubmit={handleSubmit}>

                {avatar && <Image src={avatar} alt="User Avatar" height={180} width={180}/>}
                <input
                    className="my-5 block w-full cursor-pointer rounded-lg border border-gray-300 text-sm focus:outline-none dark:placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700"
                    title="avatar_upload" type="file" accept="image/*" onChange={handleAvatarUpload}
                    disabled={loading}/>

                <div className="mb-6 flex justify-center">
                    <button id="btn_save"
                            className="flex"
                            type="submit"
                            disabled={loading || !avatar}>
                        {loading && <LoadingCircle/>}
                        <span>Save</span>
                    </button>
                </div>
            </form>

            {message && <>
                <MessageText message={message}/>
            </>}
        </div>
    );
}
