import Favicon from "@/components/images/favicon";

export default function Home() {
    return (
        <div className="flex h-full flex-col items-center justify-center py-5 w-3/4 mx-auto">
            <Favicon width={150} height={150} className="mb-10"/>

            <h1 className="text-center">Welcome to the Splitwise interest Calculator</h1>
            <p className="mt-4 text-center">
                Are there individuals who owe you money, and you are looking to earn some interest on it? <br/>
                Discover our app – the perfect solution for you. Sign in and select the interest plan that suits your
                needs.
            </p>
        </div>
    )
}
