export default function UnauthorizedPage({ href, anchorText }: { href?: string, anchorText?: string }) {
    return (
        <div className="w-full h-full flex flex-col">
            <h1 className="flex justify-center content-center">You are unauthorized to see this Page.</h1>
            <a href={href || "/"}>{anchorText || "Go back to Home Page"}</a>
        </div>
    );
}
