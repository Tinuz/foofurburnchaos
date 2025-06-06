import Image from "next/image";

type PrizePoolProps = {
  solPrize: number;
  boostPercent?: number; // optioneel
};

const PrizePool: React.FC<PrizePoolProps> = ({ solPrize, boostPercent = 0 }) => {
  const boostedPrize = (solPrize * (1 + boostPercent / 100)).toFixed(2);

  return (
    <div
      className="
      fixed
      left-2 bottom-2
      md:left-6 md:bottom-6
      z-30
      flex items-center
      bg-[rgba(255,247,224,0.95)]
      rounded-xl
      shadow-lg
      px-3 py-2
      md:px-5 md:py-3
      min-w-[100px] md:min-w-[120px]
      font-mono
      "
      style={{
        fontFamily: "'Press Start 2P', 'VT323', monospace",
        boxShadow: "0 4px 24px #d2b77c55",
      }}
    >
      <Image
        src="/images/prize_pool.png"
        alt="Prijzenpot"
        width={36}
        height={36}
        className="mr-2 md:mr-3 md:w-12 md:h-12"
        style={{ imageRendering: "pixelated" }}
        priority
      />
      <div>
        <div className="text-[11px] md:text-[13px] font-bold" style={{ color: "#3a2f1b" }}>
          Prize Pool
        </div>
        <div className="text-[15px] md:text-[18px] font-bold flex items-baseline" style={{ color: "#cc3d3d" }}>
          {boostedPrize}
          <span className="ml-1 text-[12px] md:text-[14px]" style={{ color: "#3a2f1b" }}>$SOL</span>
        </div>
        {boostPercent > 0 && (
          <div className="text-xs text-green-700 font-bold">
            +{boostPercent}% boost!
          </div>
        )}
      </div>
    </div>
  );
};

export default PrizePool;