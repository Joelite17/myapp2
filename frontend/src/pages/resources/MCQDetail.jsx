import { useState, useEffect } from "react";
import { MCQAPI, ScoreAPI } from "../../api/mcqs";
import { useParams } from "react-router-dom";

export default function MCQDetailPage() {
  const { id: mcqSetId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [mode, setMode] = useState("exam"); // "exam" | "review" | "result"
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSet = async () => {
      setLoading(true);
      try {
        const data = await MCQAPI.fetchMCQSet(mcqSetId);
        const formatted = data.mcqs.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options.reduce((acc, opt) => {
            acc[opt.key] = opt.text;
            return acc;
          }, {}),
          trueAnswers: q.options.filter((o) => o.is_correct).map((o) => o.key),
          explanation: q.explanation || "",
        }));
        setQuestions(formatted);
      } catch (err) {
        console.error("Error fetching MCQ set:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSet();
  }, [mcqSetId]);

  const q = questions[current] || {};
  const selected = selectedOptions[current] || {};

  const handleTFChange = (optKey, value) => {
    if (mode !== "exam") return;
    setSelectedOptions((prev) => ({
      ...prev,
      [current]: {
        ...prev[current],
        [optKey]: prev[current]?.[optKey] === value ? null : value,
      },
    }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent((c) => c + 1);
    else handleSubmit();
    setShowExplanation(false);
  };

  const handleBack = () => {
    if (current > 0) setCurrent((c) => c - 1);
    setShowExplanation(false);
  };

  const handleSubmit = async () => {
    let totalScore = 0;
    let totalPossibleScore = 0;

    questions.forEach((q, idx) => {
      const selected = selectedOptions[idx] || {};
      Object.keys(q.options).forEach((key) => {
        const isTrue = q.trueAnswers.includes(key);
        const ans = selected[key];
        totalPossibleScore += 1;
        if ((ans === "T" && isTrue) || (ans === "F" && !isTrue)) totalScore += 1;
        else if (ans && ans !== (isTrue ? "T" : "F")) totalScore -= 0.5;
      });
    });

    if (mode === "exam") {
      setScore(totalScore);
      setMode("result");
      try {
        await ScoreAPI.postScore(mcqSetId, totalScore, totalPossibleScore);
      } catch (err) {
        console.error("Error posting score:", err);
      }
    }
  };


  const handleRetry = async () => {
  setLoading(true);
  setCurrent(0);
  setSelectedOptions({});
  setScore(0);
  setMode("exam");
  setShowExplanation(false);

  try {
    // Fetch new reshuffled questions again
    const data = await MCQAPI.fetchMCQSet(mcqSetId);
    const formatted = data.mcqs.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options.reduce((acc, opt) => {
        acc[opt.key] = opt.text;
        return acc;
      }, {}),
      trueAnswers: q.options.filter((o) => o.is_correct).map((o) => o.key),
      explanation: q.explanation || "",
    }));
    setQuestions(formatted);
  } catch (err) {
    console.error("Error refetching MCQ set:", err);
  } finally {
    setLoading(false);
  }
  };


  const handleReview = () => {
    setCurrent(0);
    setMode("review");
    setShowExplanation(false);
  };

  const totalPossibleScore = questions.reduce(
    (sum, q) => sum + Object.keys(q.options).length,
    0
  );

  const getCheckboxStyle = (optKey, value) => {
    if (mode !== "review") return "";
    const correct = q.trueAnswers.includes(optKey) ? "T" : "F";
    const userAnswer = selected[optKey];
    if (correct === value) return "bg-green-100 dark:bg-green-800/40 border-green-600";
    if (userAnswer === value && userAnswer !== correct)
      return "bg-red-100 dark:bg-red-800/40 border-red-600";
    return "";
  };

  if (loading) return <p className="text-center py-6">Loading questions...</p>;

  return (
    <div className="flex flex-col items-center w-full min-h-[400px] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      {mode !== "result" && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Question {current + 1} of {questions.length}
        </p>
      )}

      <div className="w-full lg:w-4/6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
        {mode === "result" ? (
          <div className="text-center space-y-6 py-12">
            <h2 className="text-2xl font-bold">
              Your Score: {score} / {totalPossibleScore}
            </h2>
            <div className="text-6xl animate-bounce">
              {score >= totalPossibleScore / 2 ? "🎉🌸😊" : "😢💔"}
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleReview}
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Review
              </button>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold mb-4">{q.question}</p>

            {Object.entries(q.options).map(([optKey, optText]) => (
              <div key={optKey} className="mb-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <span className="text-sm font-medium">
                    {optKey}. {optText}
                  </span>
                </div>

                <div className="flex gap-4 mt-1 px-2">
                  {["T", "F"].map((val) => (
                    <label
                      key={val}
                      className={`flex items-center gap-2 px-2 py-1 border rounded ${getCheckboxStyle(
                        optKey,
                        val
                      )}`}
                    >
                      <input
                        type="checkbox"
                        disabled={mode !== "exam"}
                        checked={selected[optKey] === val}
                        onChange={() => handleTFChange(optKey, val)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm">{val === "T" ? "True" : "False"}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {mode === "review" && q.explanation && (
              <div className="mt-4">
                <button
                  onClick={() => setShowExplanation((prev) => !prev)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {showExplanation ? "Hide Explanation" : "Show Explanation"}
                </button>
                {showExplanation && (
                  <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">
                    {q.explanation}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                disabled={current === 0}
                className={`px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded ${
                  current === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Back
              </button>

              {mode === "exam" ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {current < questions.length - 1 ? "Next" : "Submit"}
                </button>
              ) : mode === "review" ? (
                current < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => setMode("result")}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Finish Review
                  </button>
                )
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
