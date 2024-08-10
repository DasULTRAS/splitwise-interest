"use server";

import Image from "next/image";
import Link from "next/link";

export default async function PageNotFound({ message }: Readonly<{ message?: string }>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-4 flex h-16 w-16 animate-bounce items-center justify-center">
        <Link href="/">
          <Image src="/icon.png" width={128} height={128} alt="ICON" />
        </Link>
      </div>

      <h1 className="mb-4 text-4xl font-thin">{message || "404 - Page Not Found"}</h1>

      <Link className="btn_submit" href="/">
        Go to Home
      </Link>
    </div>
  );
}
