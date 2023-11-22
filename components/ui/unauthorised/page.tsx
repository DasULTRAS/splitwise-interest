export default function UnauthorizedPage({ href, anchorText }: { href?: string, anchorText?: string }) {
    return (
        <div className="flex h-full w-full flex-col  justify-center text-center px-5">
            <h1 className=" text-2xl font-bold mb-2">You are unauthorized to see this Page.</h1>
            <a className="px-10" href={href || "/"}>{anchorText || "Go back to Home Page"}</a>
        </div>
    );
}
