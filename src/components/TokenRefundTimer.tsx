import React, { useEffect, useState } from 'react';

const TokenRefundTimer: React.FC<{ burnTime: number }> = ({ burnTime }) => {
    const [timeLeft, setTimeLeft] = useState(burnTime);
    const [isRefunded, setIsRefunded] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setIsRefunded(true);
        }
    }, [timeLeft]);

    return (
        <div className="flex flex-col items-center">
            {isRefunded ? (
                <p className="text-green-500">Tokens have been refunded! 🎉</p>
            ) : (
                <p className="text-red-500">Refunding tokens in {timeLeft} seconds...</p>
            )}
        </div>
    );
};

export default TokenRefundTimer;