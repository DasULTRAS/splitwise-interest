import Image from "next/image";
import favicon from "@/app/favicon.ico";

export default function Home() {
  return (
    <div className="flex flex-col h-full justify-center items-center p-10">
      <a title="favicon" className="mb-10">
        <Image src={favicon} alt="Logo" width={100} height={100} />
      </a>
      <h1 className="text-4xl font-bold text-center">Welcome to the Splitwise interest Calculator</h1>
      <p className="mt-4 text-xl text-center">
          Are there individuals who owe you money, and you are looking to earn some interest on it? <br/>
          Discover our app – the perfect solution for you. Sign in and select the interest plan that suits your needs.
      </p>
    </div>
  )
}
