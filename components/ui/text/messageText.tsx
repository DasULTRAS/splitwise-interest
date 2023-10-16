export default function MessageText({ message }: { message: string }) {
    return (
        <div className="mb-4 text-center">
            <p className="italic text-black">{message}</p>
        </div>
    );
}