import UserAvatar from "@/app/avatar";

export default function Home() {
  return (
    <main>
        <div className="sticky items-center justify-between w-screen flex row-span-3 justify-center bg-white/10 py-2 px-5">
            <div>
                <a className="mx-5">LOGO</a>
            </div>
            <div>
                <h1>Navigation</h1>
            </div>
            <UserAvatar/>
        </div>

        <h1 className="text-4xl font-bold">Welcome to your app!</h1>
    </main>
  )
}
