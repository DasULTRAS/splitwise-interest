import WebImage from "@/components/images/WebImage";
import { Balance, Friend } from "@/utils/splitwise/datatypes";

function getFriendBalance(friend: Friend): number {
  let balance = 0;
  friend.balance.forEach((bal) => {
    balance += Number.parseFloat(bal.amount);
  });
  return balance;
}

export default function FriendCard({ friend, apy }: { friend: Friend; apy: number | null }) {
  const balance: number = getFriendBalance(friend);

  return (
    <a
      href={`/dashboard/friends/${friend.id}`}
      className={`h-36 w-64 rounded-xl bg-neutral-100/80 p-5 shadow-lg transition-shadow hover:shadow-xl dark:bg-black/80 ${balance == 0 ? `shadow-white dark:shadow-black` : balance > 0 ? `shadow-green-500` : `shadow-red-600`}`}
    >
      <div className="flex items-center space-x-4" key={friend.id}>
        {friend.picture.small && (
          <WebImage src={friend.picture.small} className="rounded-full" height={55} width={55} />
        )}
        <div>
          <p className="text-xs text-gray-500">{friend.id}</p>
          <div className="flex space-x-1">
            <p className="overflow-hidden truncate whitespace-nowrap font-medium">
              {friend.first_name} {friend?.last_name}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex">
        {friend.balance.map((bal: Balance, index) => (
          <p key={index} className="text-sm">
            {`${bal.amount} ${bal.currency_code}`}
          </p>
        ))}

        {apy != null && <p className="ml-auto text-sm">{apy}%</p>}
      </div>
    </a>
  );
}
