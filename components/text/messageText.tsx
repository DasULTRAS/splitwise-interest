export default function MessageText({ message, className }: { message: string; className?: string }) {
  return (
    <div className={`${className} mb-4 text-center`}>
      <p className="italic">{message}</p>
    </div>
  );
}
