import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const TrueFalseQuestion = ({ questionNumber }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "", answer: "", letter: "A" },
    { id: 2, text: "", answer: "", letter: "B" },
  ]);
  const [errors, setErrors] = useState({});

  const handleQuestionChange = (e) => setQuestion(e.target.value);

  const handleOptionChange = (id, field, value) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, [field]: value } : opt
      )
    );
  };

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: "",
        answer: "",
        letter: String.fromCharCode(65 + prev.length),
      },
    ]);
  };

  const removeOption = (id) => {
    if (options.length > 1) {
      setOptions((prev) => prev.filter((opt) => opt.id !== id));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!question.trim()) newErrors.question = "Question cannot be empty.";
    options.forEach((opt, i) => {
      if (!opt.text.trim())
        newErrors[`option-${opt.id}`] = `Option ${opt.letter} cannot be empty.`;
      if (!opt.answer)
        newErrors[`answer-${opt.id}`] = `Select True or False for option ${opt.letter}.`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="border rounded-xl p-4 my-4 bg-white shadow">
      <div className="mb-2 font-semibold text-lg flex gap-2 items-center">
        <span>{questionNumber}.</span>
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="Enter your question"
          value={question}
          onChange={handleQuestionChange}
        />
      </div>
      {errors.question && (
        <p className="text-red-500 text-sm mb-2">{errors.question}</p>
      )}

      {/* T F Header */}
      <div className="grid grid-cols-12 font-semibold mb-2">
        <div className="col-span-1 text-left">T</div>
        <div className="col-span-1 text-left">F</div>
        <div className="col-span-10"></div>
      </div>

      {/* Options */}
      {options.map((opt, index) => (
        <div key={opt.id} className="grid grid-cols-12 items-center gap-2 mb-2">
          {/* True */}
          <div className="col-span-1 flex justify-center">
            <input
              type="radio"
              name={`answer-${opt.id}`}
              checked={opt.answer === "T"}
              onChange={() => handleOptionChange(opt.id, "answer", "T")}
              className="accent-green-500 scale-125"
            />
          </div>
          {/* False */}
          <div className="col-span-1 flex justify-center">
            <input
              type="radio"
              name={`answer-${opt.id}`}
              checked={opt.answer === "F"}
              onChange={() => handleOptionChange(opt.id, "answer", "F")}
              className="accent-red-500 scale-125"
            />
          </div>
          {/* Option Text */}
          <div className="col-span-9">
            <input
              type="text"
              placeholder={`${opt.letter}. Enter option text`}
              value={opt.text}
              onChange={(e) =>
                handleOptionChange(opt.id, "text", e.target.value)
              }
              className="border p-2 rounded w-full"
            />
            {errors[`option-${opt.id}`] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[`option-${opt.id}`]}
              </p>
            )}
          </div>
          {/* Remove Button */}
          <div className="col-span-1 flex justify-center">
            <button
              onClick={() => removeOption(opt.id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaMinus />
            </button>
          </div>
        </div>
      ))}

      {/* Add Option */}
      <button
        onClick={addOption}
        className="mt-2 text-green-600 flex items-center gap-1 hover:text-green-800"
      >
        <FaPlus /> Add Option
      </button>
    </div>
  );
};

export default TrueFalseQuestion;
