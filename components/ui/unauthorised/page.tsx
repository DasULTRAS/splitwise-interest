export default function UnauthorizedPage({ href, anchorText }: { href?: string, anchorText?: string }) {
    return (
        <div className="flex h-full w-full flex-col justify-center px-5 text-center">
            <h1 className="mb-2 text-2xl font-bold">You are unauthorized to see this Page.</h1>
            <a className="px-10" href={href || "/"}>{anchorText || "Go back to Home Page"}</a>
        </div>
    );
}
