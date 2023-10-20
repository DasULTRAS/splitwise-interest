import Image from "next/image";
import favicon from "@/app/favicon.ico";

export default function Home() {
  return (
    <div className="flex flex-col h-full bg-gray-100 justify-center items-center">
      <a title="favicon" className="mb-10">
        <Image src={favicon} alt="Logo" width={100} height={100} />
      </a>
      <h1 className="text-4xl font-bold text-black">Welcome to the Splitwise interest Calculator</h1>
      <p className="mt-4 text-xl text-gray-600">
        Do you have people who own your money and want to make a profit?
      </p>
      <p className="mt-4 text-xl text-gray-600">
        This app is your solution. Log in and choose your interest plan.
      </p>
    </div>
  )
}
