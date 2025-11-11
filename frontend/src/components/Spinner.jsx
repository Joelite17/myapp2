// src/components/Spinner.jsx
import { useEffect, useState } from "react";

export default function Spinner({ show = true, color = "green", size = 70, minDuration = 2000 }) {
  const [visible, setVisible] = useState(show);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (show) {
      setStartTime(Date.now());
      setVisible(true);
    } else if (startTime) {
      const elapsed = Date.now() - startTime;
      const remaining = minDuration - elapsed;
      const timeout = setTimeout(() => setVisible(false), remaining > 0 ? remaining : 0);
      return () => clearTimeout(timeout);
    }
  }, [show, startTime, minDuration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 transition-opacity duration-300">
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        color={color}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke={`currentColor`}
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill={`currentColor`}
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );
}
