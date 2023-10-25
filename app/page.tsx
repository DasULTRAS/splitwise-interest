import Image from "next/image";
import favicon from "@/app/favicon.ico";

export default function Home() {
    return (
        <div className="flex h-full flex-col items-center justify-center p-10">
            <a title="favicon" className="mb-10">
                <Image src={favicon} alt="Logo" width={100} height={100}/>
            </a>
            <h1 className="text-center text-4xl font-bold">Welcome to the Splitwise interest Calculator</h1>
            <p className="mt-4 text-center text-xl">
                Are there individuals who owe you money, and you are looking to earn some interest on it? <br/>
                Discover our app – the perfect solution for you. Sign in and select the interest plan that suits your
                needs.
            </p>
        </div>
    )
}
