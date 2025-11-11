import { useState, useEffect } from "react";

export default function MCQQuestion({ question, onNext }) {
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setSelected(null);
    setShowAnswer(false);
  }, [question]);

  // Auto move to next after 5s
  useEffect(() => {
    let timer;
    if (showAnswer) {
      timer = setTimeout(() => {
        onNext(selected);
      }, 3000); // 3 seconds
    }
    return () => clearTimeout(timer);
  }, [showAnswer]);

  const handleOptionClick = (index) => {
    if (!showAnswer) {
      setSelected(index);
      setShowAnswer(true);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-md font-semibold">{question.question}</h2>
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          let bg = "bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-900";
          if (showAnswer) {
            if (idx === question.correct)
              bg = "bg-green-400 dark:bg-green-600 text-white font-semibold";
            if (selected === idx && idx !== question.correct)
              bg = "bg-red-400 dark:bg-red-600 text-white font-semibold";
          }
          return (
            <button
              key={idx}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${bg}`}
              onClick={() => handleOptionClick(idx)}
            >
              {option}
            </button>
          );
        })}
      </div>
      {!showAnswer && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Select an answer to see the result.
        </p>
      )}
    </div>
  );
}
