import Trigger from "./trigger";

export default function Action() {
    return (
        <div className="flex flex-col w-full mt-10 mx-10">
            <h1 className="text-4xl font-bold text-center">Action</h1>
            <Trigger />
        </div>
    );
}