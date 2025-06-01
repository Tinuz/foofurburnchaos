import React from 'react';

type BurnButtonProps = {
  setShowMicrowave: React.Dispatch<React.SetStateAction<boolean>>;
  isBurning: boolean;
};

const BurnButton: React.FC<BurnButtonProps> = ({ setShowMicrowave, isBurning }) => (
  <button
    className="bg-red-500 text-white px-8 py-4 rounded-full text-2xl font-bold shadow-lg hover:bg-red-600 transition"
    onClick={() => setShowMicrowave(true)}
    disabled={isBurning}
  >
    {isBurning ? 'Burning...' : 'BURN'}
  </button>
);

export default BurnButton;