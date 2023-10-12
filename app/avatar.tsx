import React from 'react';

interface UserAvatarProps {
    isLoggedIn?: boolean,
    userName?: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({isLoggedIn = false, userName = 'anonymous'}) => {
    return (
        <div>
            {isLoggedIn ?
                <h2>{userName}</h2> :
                <a href="/login">
                    <h2>Not Logged In</h2>
                </a>
            }
        </div>
    );
};

export default UserAvatar;
