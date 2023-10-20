"use client";

import { Session } from "next-auth";
import { getSession } from "next-auth/react"
import Image from "next/image";
import { useEffect, useState } from "react";
import LoadingCircle from "@/components/ui/symbols/loadingCircle";
import MessageText from "@/components/ui/text/messageText";

export default function ProfileSettings() {
  const [avatarFile, setAvatarFile] = useState<File>();
  const [avatar, setAvatar] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const currentSession = await getSession();
      if (!session && currentSession) {
        setSession(currentSession);
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

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
          setAvatarFile(file);
          var reader = new FileReader();
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
        body: JSON.stringify({ avatar })
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
    <div className="p-8 w-full">
      <h1 className="text-center text-3xl font-bold">Profile</h1>
      {
        session ?
          <>
            <form className="flex flex-col justify-center items-center"
              onSubmit={handleSubmit}>

              {avatar && <Image src={avatar} alt="User Avatar" height={180} width={180} />}
              <input className="my-5" title="avatar_upload" type="file" accept="image/*" onChange={handleAvatarUpload} />

              <div className="mb-6 flex justify-center">
                <button
                  className="flex w-fit px-4 py-2 font-bold bg-blue-500 disabled:bg-blue-500/50 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={loading || !avatar}
                >
                  {loading && <LoadingCircle />}
                  <span>Save</span>
                </button>
              </div>
            </form>
            {message && <MessageText message={message} />}
          </>
          : <LoadingCircle className={"flex justify-center items-center"} />
      }
    </div >
  );
}
