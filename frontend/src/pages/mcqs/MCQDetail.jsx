import { useState } from "react";

const questions = [
  {
    id: 1,
    question: "Which of the following is a key component of Primary Health Care?",
    options: ["Advanced surgery", "Health education", "Specialist consultation", "Luxury hospital facilities"],
    correct: 1,
  },
  {
    id: 2,
    question: "Epidemiology is primarily concerned with:",
    options: ["Studying individual patient symptoms", "Distribution of diseases in populations", "Developing new medications", "Hospital management"],
    correct: 1,
  },
];

export default function MCQDetailPage({ type = "TF" }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({}); // stores T/F/null per option

  const handleNextBestOption = (selected) => {
    const totalOptions = questions[current].options.length;
    let questionScore = 0;

    questions[current].options.forEach((_, idx) => {
      if (idx === selected) questionScore += 1;
    });

    setScore((prev) => prev + questionScore);

    if (current < questions.length - 1) setCurrent((prev) => prev + 1);
    else setFinished(true);
  };

  const handleNextTrueFalse = () => {
    const selected = selectedOptions[current] || [];
    const correct = questions[current].options.map((_, idx) =>
      idx === questions[current].correct ? "T" : "F"
    );

    let questionScore = 0;
    correct.forEach((val, idx) => {
      if (selected[idx] === val) questionScore += 1;       // correct
      else if (selected[idx] && selected[idx] !== val) questionScore -= 0.5; // incorrect
      // null/undefined = 0
    });

    setScore((prev) => prev + questionScore);

    if (current < questions.length - 1) setCurrent((prev) => prev + 1);
    else setFinished(true);
  };

  const handleTFChange = (optionIdx, value) => {
    setSelectedOptions((prev) => {
      const curr = prev[current] ? [...prev[current]] : Array(questions[current].options.length).fill(null);

      // toggle logic: deselect if clicked again
      if (curr[optionIdx] === value) curr[optionIdx] = null;
      else curr[optionIdx] = value;

      return { ...prev, [current]: curr };
    });
  };

  const handleRetry = () => {
    setCurrent(0);
    setScore(0);
    setFinished(false);
    setSelectedOptions({});
  };

  const totalPossibleScore = questions.reduce((sum, q) => sum + q.options.length, 0);

  return (
    <div className="flex flex-col items-center w-full min-h-[300px] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      {!finished && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Question {current + 1} of {questions.length}
        </p>
      )}

      <div className="w-full lg:w-4/6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-colors duration-300 flex flex-col space-y-6">
        {!finished ? (
          <div className="space-y-4">
            <p className="text-sm font-semibold">{questions[current].question}</p>

            {type === "BO" ? (
              <div className="flex flex-col space-y-2">
                {questions[current].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleNextBestOption(idx)}
                    className="text-left p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-green-100 dark:hover:bg-green-700 transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {questions[current].options.map((opt, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                      <span className="text-sm font-medium">{opt}</span>
                    </div>
                    <div className="flex flex-col px-2 space-y-1">
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={selectedOptions[current]?.[idx] === "T"}
                          onChange={() => handleTFChange(idx, "T")}
                          className="w-4 h-4 accent-green-600"
                        />
                        <span className="text-sm">True</span>
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={selectedOptions[current]?.[idx] === "F"}
                          onChange={() => handleTFChange(idx, "F")}
                          className="w-4 h-4 accent-red-600"
                        />
                        <span className="text-sm">False</span>
                      </label>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleNextTrueFalse}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-2"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-6 py-12">
            <h2 className="text-2xl font-bold">
              Your Score: {score} / {totalPossibleScore}
            </h2>
            {score >= totalPossibleScore / 2 ? (
              <div className="text-6xl animate-bounce">🎉🌸😊</div>
            ) : (
              <div className="text-6xl animate-bounce">😢💔</div>
            )}
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
