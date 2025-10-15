import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Wheel } from 'react-custom-roulette';

export default function WheelModal({
  members,
  winnerUsername,
  onClose,
  onFinished,
}) {
  // stable data reference unless usernames change
  const data = useMemo(() => {
    if (!members) return [];
    return members.map((m) => ({ option: m.user.username }));
  }, [members?.map((m) => m.user.username).join(',')]);

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const lastWinnerRef = useRef('');
  const spinningRef = useRef(false);

  useEffect(() => {
    if (!winnerUsername || data.length === 0) return;

    // only spin if the winner changed and we're not already spinning
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg relative w-[340px] sm:w-[400px] flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold text-center mb-4">
          🎯 Selecting a Winner...
        </h2>

        {data.length > 0 ? (
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            outerBorderColor="#ccc"
            outerBorderWidth={8}
            innerBorderColor="#f2f2f2"
            radiusLineColor="#dedede"
            radiusLineWidth={2}
            textColors={['#ffffff']}
            backgroundColors={[
              '#E74C3C',
              '#3498DB',
              '#2ECC71',
              '#F1C40F',
              '#9B59B6',
              '#1ABC9C',
              '#E67E22',
            ]}
            onStopSpinning={handleSpinStop}
          />
        ) : (
          <p className="text-gray-500 mt-4">No members to spin.</p>
        )}
      </div>
    </div>
  );
}
