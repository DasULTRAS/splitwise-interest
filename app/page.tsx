import Favicon from "@/components/ui/images/favicon";

export default function Home() {
    return (
        <div className="flex h-full flex-col items-center justify-center p-10">
            <Favicon width={150} height={150} className="mb-10"/>

            <h1 className="text-center text-4xl font-bold">Welcome to the Splitwise interest Calculator</h1>
            <p className="mt-4 text-center text-xl">
                Are there individuals who owe you money, and you are looking to earn some interest on it? <br/>
                Discover our app – the perfect solution for you. Sign in and select the interest plan that suits your
                needs.
            </p>
        </div>
    )
}
