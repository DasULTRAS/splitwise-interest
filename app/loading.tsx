import LoadingCircle from "@/components/ui/symbols/loadingCircle";

export default function Loading() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <LoadingCircle />
        </div>
    );
}
