import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function BestOptionQuestion({ question, index, setQuestions, allQuestions, setDeleteTarget }) {
  const [expanded, setExpanded] = useState(true);

  const optionLabel = (idx) => String.fromCharCode(65 + idx);

  const handleOptionChange = (oIdx, value) => {
    const updated = [...allQuestions];
    updated[index].options[oIdx].text = value;
    setQuestions(updated);
  };

  const handleCorrectChange = (value) => {
    const updated = [...allQuestions];
    updated[index].options.forEach((opt, idx) => {
      opt.correct = optionLabel(idx) === value;
    });
    setQuestions(updated);
  };

  const addOption = () => {
    const updated = [...allQuestions];
    updated[index].options.push({ text: "", correct: false });
    setQuestions(updated);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 shadow-md rounded-lg p-3 mb-4 relative">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <span className="font-semibold">{index + 1}.</span>
        <input
          type="text"
          placeholder={`Question ${index + 1}`}
          className="flex-1 ml-2 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
          value={question.question}
          onChange={(e) => {
            const updated = [...allQuestions];
            updated[index].question = e.target.value;
            setQuestions(updated);
          }}
        />
        <span className="ml-2">{expanded ? <FaChevronUp /> : <FaChevronDown />}</span>
      </div>

      <div className={`overflow-hidden transition-all mt-2 ${expanded ? "max-h-96" : "max-h-0"}`}>
        {question.options.map((opt, oIdx) => (
          <div key={oIdx} className="flex items-center gap-2 mb-2">
            <span className="font-semibold w-5">{optionLabel(oIdx)}.</span>
            <input
              type="text"
              className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              value={opt.text}
              onChange={(e) => handleOptionChange(oIdx, e.target.value)}
            />
            <input
              type="radio"
              checked={opt.correct}
              onChange={() => handleCorrectChange(optionLabel(oIdx))}
            />
          </div>
        ))}
        <button onClick={addOption} className="text-green-600 font-medium text-sm hover:underline">+ Add Option</button>
      </div>

      <button
        onClick={() => setDeleteTarget(question.id)}
        className="absolute top-2 right-2 px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
      >
        Delete
      </button>
    </div>
  );
}
