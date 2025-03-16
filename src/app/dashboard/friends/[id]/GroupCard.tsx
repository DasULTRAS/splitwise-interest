import WebImage from "@/components/images/WebImage";

export default async function GroupCard({
  id,
  name,
  avatarSrc,
  balance,
}: {
  id: number;
  name: string;
  avatarSrc: string;
  balance: { amount: number; currency_code: string };
}) {
  return (
    <li key={id} className="m-2 flex flex-col gap-2 rounded-2xl bg-black/20 p-4">
      <div className="flex gap-2">
        <WebImage src={avatarSrc} className="rounded-full" width={32} />
        <b className="truncate overflow-hidden font-mono text-lg whitespace-nowrap">{name}</b>
      </div>
      <p className="ml-auto w-full text-center">
        {balance.amount} {balance.currency_code}
      </p>
    </li>
  );
}
