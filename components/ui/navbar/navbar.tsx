import UserAvatar from "@/components/ui/navbar/avatar";

export default function Navbar() {
    return (
        <div className="sticky items-center justify-between w-screen flex row-span-3 justify-center bg-white/30 py-2 px-5 dark:bg-black/30 h-16">
            <div>
                <a className="mx-5" href="/">LOGO</a>
            </div>
            <h1>Navigation</h1>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                </ul>
            </nav>
            <UserAvatar />
        </div>
    );
}