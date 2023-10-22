import { Balance, Friend } from '@/utils/splitwise/datatypes';
import WebImage from '@/components/ui/WebImage';

export default function Friend({ friend }: { friend: Friend }) {
    const balanceStyle = 'text-sm mt-3';
    return (
        <>
            <div className="w-64 h-36 dark:bg-black/80 bg-blue-700 rounded-xl p-5 shadow-lg transition-shadow">
                <div className="flex items-center space-x-4" key={friend.id}>
                    {friend.picture.small &&
                        <WebImage src={friend.picture.small} className="rounded-full" height={55} width={55} />
                    }
                    <div>
                        <p className="text-xs text-gray-500">{friend.id}</p>
                        <div className='flex space-x-1'>
                            <p className="truncate whitespace-nowrap overflow-hidden font-medium">{friend.first_name} {friend?.last_name}</p>
                        </div>
                    </div>
                </div>
                {friend.balance.map((bal: Balance, index) => (
                    <p key={index} className={balanceStyle}>
                        {`${bal.amount} ${bal.currency_code}`}
                    </p>
                ))}
            </div>
        </>
    )
}

