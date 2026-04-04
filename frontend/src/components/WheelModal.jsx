import React, { useState, useEffect, useRef, useMemo } from "react";
import { Wheel } from "react-custom-roulette";

export default function WheelModal({
  members,
  winnerUsername,
  onClose,
  onFinished,
}) {
  // Create wheel data safely
  const data = useMemo(() => {
    if (!Array.isArray(members)) return [];
    return members.map((m) => ({
      option: m?.user?.username || "Unknown",
    }));
  }, [members]);

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const lastWinnerRef = useRef("");
  const spinningRef = useRef(false);

  useEffect(() => {
    if (!winnerUsername || data.length === 0) return;

    // Prevent re-spinning same winner
    if (winnerUsername !== lastWinnerRef.current && !spinningRef.current) {
      const idx = data.findIndex((d) => d.option === winnerUsername);

      if (idx === -1) return;

      setPrizeNumber(idx);
      setMustSpin(true);
      spinningRef.current = true;
      lastWinnerRef.current = winnerUsername;
    }
  }, [winnerUsername, data]);

  const handleSpinStop = () => {
    setMustSpin(false);
    spinningRef.current = false;

    if (data[prizeNumber]) {
      onFinished(data[prizeNumber].option);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl transition"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">
          🎯 Selecting a Winner...
        </h2>

        {/* Wheel */}
        {data.length > 0 ? (
          <div className="w-full flex justify-center">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              outerBorderColor="#ccc"
              outerBorderWidth={6}
              innerBorderColor="#f2f2f2"
              radiusLineColor="#ddd"
              radiusLineWidth={2}
              textColors={["#ffffff"]}
              backgroundColors={[
                "#E74C3C",
                "#3498DB",
                "#2ECC71",
                "#F1C40F",
                "#9B59B6",
                "#1ABC9C",
                "#E67E22",
              ]}
              onStopSpinning={handleSpinStop}
            />
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-center">
            No members to spin.
          </p>
        )}
      </div>
    </div>
  );
}
