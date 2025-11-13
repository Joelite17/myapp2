import { useState, useEffect, useContext } from "react";
import { AccountsContext } from "../context/AccountsContext";
import { ScoreAPI } from "../api/mcqs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { user } = useContext(AccountsContext);
  const username = user.username;

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detect dark mode
  const isDark = document.documentElement.classList.contains("dark");

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        const data = await ScoreAPI.fetchAllScores();

        // Sort chronologically
        const sorted = data.sort(
          (a, b) => new Date(a.taken_at) - new Date(b.taken_at)
        );

        const formatted = sorted.map((s) => ({
          id: s.id,
          mcq_set_title: s.mcq_set_title,
          percentage: ((s.score / s.total_score) * 100).toFixed(1),
          taken_at: s.taken_at,
        }));

        setScores(formatted);
      } catch (err) {
        console.error("Error fetching scores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const gridColor = isDark ? "#374151" : "#e5e7eb"; // gray-700 / gray-200
  const textColor = isDark ? "#f9fafb" : "#111827"; // gray-50 / gray-900
  const bgColor = isDark ? "#1f2937" : "#ffffff"; // chart background

  return (
    <div className="flex-1 p-6 lg:bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome {username}</h1>

      {loading ? (
        <p>Loading scores...</p>
      ) : scores.length === 0 ? (
        <p>No scores yet. Take some tests to see your progress!</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={scores}
            margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
            style={{ backgroundColor: bgColor, borderRadius: 8 }}
          >
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis
              dataKey="mcq_set_title"
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              unit="%"
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: bgColor,
                border: `1px solid ${gridColor}`,
                color: textColor,
              }}
            />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="#4ade80"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
