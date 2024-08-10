import { getAvatar } from "@/utils/splitwise/splitwise";
import { Session } from "next-auth";
import Image from "next/image";

export default async function UserAvatar({
  session,
  height,
  width,
  className = "h-12 w-12",
}: {
  session: Session | null | undefined;
  height: number;
  width: number;
  className: string;
}) {
  if (!session?.user?.name)
    return (
      <>
        {" "}
        <p>Unauthorized</p>
      </>
    );

  const avatar = await getAvatar(session.user.name);

  return (
    <>
      <div
        className={`btn_clickable border-1 relative inline-flex items-center justify-center overflow-hidden rounded-full border-black bg-gray-100 dark:border-white dark:bg-gray-600 ${className}`}
      >
        {avatar ? (
          <Image src={avatar} alt="User Avatar" height={height} width={width} />
        ) : (
          <span className="font-medium text-gray-600 dark:text-gray-300">{session.user?.name?.substring(0, 2)}</span>
        )}
      </div>
    </>
  );
}
