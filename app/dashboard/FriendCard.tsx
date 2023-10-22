import { Balance, Friend } from '@/utils/splitwise/datatypes';
import WebImage from './WebImage';

export default function FriendCard({ friend }: { friend: Friend }) {
    const baseStyles = 'w-64 h-36 dark:bg-black/80 bg-blue-700 rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow';
    const balanceStyle = 'text-sm mt-3';
    return (
        <>
            <div className={friend.balance.length > 0 ? `${baseStyles} shadow-red-700` : `${baseStyles} shadow-green-500`}>
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

