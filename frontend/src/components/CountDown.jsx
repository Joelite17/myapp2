import { useEffect, useState } from "react";

export default function CountDown({ start = 3, onComplete }) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (count === null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Glowing circles */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-72 h-72 rounded-full bg-black/20 dark:bg-white/10 animate-pulse shadow-[0_0_50px_25px_rgba(0,0,0,0.7)] dark:shadow-[0_0_50px_25px_rgba(255,255,255,0.7)]"></div>
        <div className="absolute w-56 h-56 rounded-full border-4 border-black/30 dark:border-white/40 animate-ping"></div>
        <div className="absolute w-44 h-44 rounded-full border-2 border-black/50 animate-ping delay-200"></div>

        {/* Countdown number */}
        <span className="text-9xl font-extrabold text-black dark:text-white z-10">{count}</span>
      </div>
    </div>
  );
}
