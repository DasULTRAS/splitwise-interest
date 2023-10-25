export default function UnauthorizedPage({href, anchorText}: { href?: string, anchorText?: string }) {
    return (
        <div className="flex h-full w-full flex-col">
            <h1 className="flex content-center justify-center">You are unauthorized to see this Page.</h1>
            <a href={href || "/"}>{anchorText || "Go back to Home Page"}</a>
        </div>
    );
}
