import React from 'react';

const Disclaimer: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Disclaimer</h1>
            <p className="text-center max-w-md mb-4">
                This is a satirical Web3 demo. No real $FOOF is harmed in this burn.
            </p>
            <p className="text-center max-w-md">
                The game is designed for entertainment purposes only and does not involve any actual token transactions.
            </p>
        </div>
    );
};

export default Disclaimer;