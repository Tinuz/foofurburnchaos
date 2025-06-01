import React, { useEffect, useState } from 'react';

type MicrowaveAnimationProps = {
  isBurning: boolean;
};

const MicrowaveAnimation: React.FC<MicrowaveAnimationProps> = ({ isBurning }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isBurning) {
      setAnimationClass('animate-microwave');
      const timer = setTimeout(() => {
        setAnimationClass('');
      }, 3000); // Animation duration

      return () => clearTimeout(timer);
    }
  }, [isBurning]);

  return (
    <div className={`microwave-container ${animationClass}`}>
      <img src="/images/microwave.svg" alt="Microwave" className="microwave-image" />
      {isBurning && <div className="microwave-overlay">Burning...</div>}
      <p>{isBurning ? 'Microwave is burning...' : 'Idle'}</p>
    </div>
  );
};

export default MicrowaveAnimation;