"use client";

import { useSession } from "next-auth/react";

export default function UserAvatar({
  height,
  width,
  className = "h-12 w-12",
}: {
  height: number;
  width: number;
  className: string;
}) {
  const session = useSession();

  if (!session || session.status === "loading") return null;

  if (session.status === "unauthenticated")
    return (
      <>
        <p>Unauthorized</p>
      </>
    );

  return (
    <>
      <div
        className={`btn_clickable relative inline-flex items-center justify-center overflow-hidden rounded-full border-1 border-black bg-gray-100 dark:border-white dark:bg-gray-600 ${className}`}
      >
        {session.data?.user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={session.data.user.image} alt="User Avatar" height={height} width={width} />
        ) : (
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {session?.data?.user?.name?.substring(0, 2) || "?"}
          </span>
        )}
      </div>
    </>
  );
}
