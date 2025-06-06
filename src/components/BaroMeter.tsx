import React from "react";

type BurnBarometerProps = {
  totalBurned: number;
  goal: number; // goal is nu verplicht
  basePrizePool?: number;
};

const BurnBarometer: React.FC<BurnBarometerProps> = ({
  totalBurned,
  goal,
  basePrizePool = 1,
}) => {
  const percentComplete = Math.min((totalBurned / goal) * 100, 100);
  const bonusSteps = Math.floor((totalBurned / goal) * 5); // 5 stappen tot 100%
  const bonusPercent = Math.min(bonusSteps, 5);
  const prizeWithBonus = (basePrizePool * (1 + bonusPercent / 100)).toFixed(2);

  return (
    <div
      className="w-full max-w-md mx-auto mt-6 px-2 md:px-4"
      style={{
        fontFamily: "'Press Start 2P', 'VT323', monospace",
      }}
    >
      <div
        className="text-base md:text-lg text-center font-bold mb-2 flex items-center justify-center"
        style={{
          color: "#8d5c1b",
        }}
      >
        Burn Barometer:{" "}
        <span style={{ color: "#388e3c", margin: "0 4px" }}>
          {totalBurned.toLocaleString("en-US")}
        </span>
        / {goal.toLocaleString("en-US")} $FOOF
      </div>
      <div
        className="relative w-full rounded-lg h-6 md:h-7 border flex items-center"
        style={{
          background: "linear-gradient(90deg, #fffbe8 70%, #d2b77c22 100%)",
          borderColor: "#d2b77c",
          boxShadow: "0 2px 12px #d2b77c33",
        }}
      >
        <div
          className="h-full rounded-lg transition-all duration-500"
          style={{
            width: `${percentComplete}%`,
            background: "linear-gradient(90deg, #cc3d3d 60%, #ffb700 100%)",
            boxShadow: "0 0 8px #cc3d3d55",
            opacity: 0.92,
          }}
        ></div>
        {/* Flame icon always right */}
        <span
          className="
    absolute
    right-[-8px] top-1/2
    -translate-y-1/2
    text-[32px]
    md:right-[-20px] 
     md:top-[30%]
    md:text-[40px]
    pointer-events-none
    z-20
  "
          style={{
            filter: "drop-shadow(0 2px 6px #ffb70088)",
          }}
        >
          🔥
        </span>
        <div
          className="absolute w-full text-xs md:text-sm text-center font-bold"
          style={{
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            color: "#388e3c",
            textShadow: "0 0 6px #fffbe8, 0 0 2px #d2b77c",
            letterSpacing: "0.04em",
            pointerEvents: "none",
          }}
        >
          +{bonusPercent}% Prize Pool Boost
        </div>
      </div>
    </div>
  );
};

export default BurnBarometer;