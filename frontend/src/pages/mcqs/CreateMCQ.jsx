import { useState, useRef } from "react";
import { FaPlus, FaChevronDown, FaChevronUp, FaMinus } from "react-icons/fa";
import ConfirmDialog from "../../components/ConfirmDialog";
import SuccessCheck from "../../components/SuccessCheck";
import { useNavigate, useLocation } from "react-router-dom";
import { MCQAPI } from "../../api/mcqs"; // adjust path if needed

export default function CreateMCQPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const mcqType = location.state?.type || "Best Option";

  const [title, setTitle] = useState(""); // MCQ set title
  const [questions, setQuestions] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [errors, setErrors] = useState({ questionErrors: [], general: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const questionRefs = useRef([]);

  const toggleExpand = (idx) =>
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const handleAddQuestion = () => {
    const newQuestion =
      mcqType === "Best Option"
        ? { id: Date.now(), question: "", options: [""], correctAnswer: "" }
        : { id: Date.now(), question: "", options: [{ text: "", value: "" }] };
    setQuestions([...questions, newQuestion]);
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
    clearFieldError(qIdx, oIdx);
  };

  const handleCorrectAnswerChange = (qIdx, value) => {
    const updated = [...questions];
    updated[qIdx].correctAnswer = value;
    setQuestions(updated);
  };

  const handleAddOption = (qIdx) => {
    const updated = [...questions];
    updated[qIdx].options.push(mcqType === "Best Option" ? "" : { text: "", value: "" });
    setQuestions(updated);
  };

  const handleDeleteOption = (qIdx, oIdx) => {
    const updated = [...questions];
    updated[qIdx].options.splice(oIdx, 1);
    setQuestions(updated);
  };

  const handleTFOptionTextChange = (qIdx, oIdx, text) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx].text = text;
    setQuestions(updated);
    clearFieldError(qIdx, oIdx);
  };

  const handleTFSelect = (qIdx, oIdx, val) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx].value = val;
    setQuestions(updated);
  };

  const clearFieldError = (qIdx, field) => {
    setErrors((prev) => {
      const updatedErrors = [...prev.questionErrors];
      if (!updatedErrors[qIdx]) updatedErrors[qIdx] = {};
      updatedErrors[qIdx][field] = "";
      return { ...prev, questionErrors: updatedErrors, general: "" };
    });
  };

  const validateInputs = () => {
    const newErrors = { questionErrors: [], general: "" };
    let valid = true;
    const newExpanded = { ...expanded };

    if (!title.trim()) {
      newErrors.general = "MCQ set title is required.";
      valid = false;
    }

    if (!questions.length) {
      newErrors.general = "Please add at least one question.";
      valid = false;
    }

    questions.forEach((q, qIdx) => {
      const qError = {};
      if (!q.question.trim()) {
        qError.question = "Question is required.";
        valid = false;
        newExpanded[qIdx] = true;
      }

      if (mcqType === "Best Option") {
        q.options.forEach((opt, oIdx) => {
          if (!opt.trim()) {
            qError[oIdx] = "Option cannot be empty.";
            valid = false;
            newExpanded[qIdx] = true;
          }
        });
        if (!q.correctAnswer) {
          qError.correctAnswer = "Select the correct answer.";
          valid = false;
          newExpanded[qIdx] = true;
        }
      } else {
        q.options.forEach((opt, oIdx) => {
          if (!opt.text.trim()) {
            qError[oIdx] = "Option text is required.";
            valid = false;
            newExpanded[qIdx] = true;
          }
        });
      }

      newErrors.questionErrors[qIdx] = qError;
    });

    setErrors(newErrors);
    setExpanded(newExpanded);

    // Scroll to first error
    if (!valid) {
      setTimeout(() => {
        const firstErrorIdx = newErrors.questionErrors.findIndex(
          (qe) => Object.keys(qe).length > 0
        );
        if (firstErrorIdx !== -1) {
          questionRefs.current[firstErrorIdx]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 50);
    }

    return valid;
  };

  const handleSaveMCQ = async () => {
    if (!validateInputs()) return;

    try {
      setIsSaving(true);

      const payload = {
        title,
        questions: questions.map((q) =>
          mcqType === "Best Option"
            ? {
                question: q.question,
                mcq_type: "Best Option",
                options: q.options.map((opt, idx) => ({
                  text: opt,
                  is_correct: q.correctAnswer === String.fromCharCode(65 + idx),
                })),
              }
            : {
                question: q.question,
                mcq_type: "True/False",
                options: q.options.map((opt) => ({
                  text: opt.text,
                  value: opt.value,
                })),
              }
        ),
      };

      await MCQAPI.createMCQSet(payload); // Send full set with title

      setShowSuccess(true);
      setSuccessMessage("MCQ set created successfully!");
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/mcqs");
      }, 1500);
    } catch (err) {
      console.error("Error saving MCQ:", err);
      alert("Error saving MCQ: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const optionLabel = (idx) => String.fromCharCode(65 + idx);

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-10 px-4">
      <div className="w-full lg:w-4/6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Create MCQ ({mcqType})</h1>
          <button
            onClick={handleAddQuestion}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition"
          >
            <FaPlus /> Add Question
          </button>
        </div>

        {/* Title input */}
        <div>
          <label className="block font-semibold mb-2">Title</label>
          <input
            // ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors({ ...errors, title: "", general: "" });
            }}
            placeholder="Enter flashcard set title"
            className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 
                       focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {errors.general && (
          <p className="text-red-500 text-center mb-2">{errors.general}</p>
        )}

        {/* Questions */}
        {questions.map((q, qIdx) => (
          <div
            key={q.id}
            ref={(el) => (questionRefs.current[qIdx] = el)}
            className="flex flex-col sm:flex-row sm:items-start gap-2"
          >
            <div className="flex-1 bg-white dark:bg-gray-800 shadow-md rounded-lg p-3 relative">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(qIdx)}
              >
                <span className="font-semibold">{qIdx + 1}.</span>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[qIdx].question = e.target.value;
                    setQuestions(updated);
                    clearFieldError(qIdx, "question");
                  }}
                  placeholder={`Question ${qIdx + 1}`}
                  className="flex-1 ml-2 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-green-600 focus:ring-0 font-semibold"
                />
                <span className="ml-2">
                  {expanded[qIdx] ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>

              {errors.questionErrors[qIdx]?.question && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.questionErrors[qIdx].question}
                </p>
              )}

              <div
                className={`overflow-hidden transition-all duration-300 mt-2 ${
                  expanded[qIdx] ? "max-h-[600px]" : "max-h-0"
                }`}
              >
                {/* Options rendering: Best Option / True-False */}
                {mcqType === "Best Option" &&
                  q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold w-5">{optionLabel(oIdx)}.</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                          className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-green-600 focus:ring-0"
                        />
                        <button
                          onClick={() => handleDeleteOption(qIdx, oIdx)}
                          className="text-red-600 hover:text-white px-2 py-1 rounded bg-gray-200 hover:bg-red-500"
                        >
                          <FaMinus />
                        </button>
                      </div>
                      {errors.questionErrors[qIdx]?.[oIdx] && (
                        <p className="text-red-500 text-xs mt-1 ml-7">
                          {errors.questionErrors[qIdx][oIdx]}
                        </p>
                      )}
                    </div>
                  ))}

                {mcqType === "Best Option" && (
                  <>
                    <button
                      onClick={() => handleAddOption(qIdx)}
                      className="text-green-600 font-medium text-sm mb-2 hover:underline"
                    >
                      + Add Option
                    </button>
                    {q.options.length > 0 && (
                      <select
                        value={q.correctAnswer}
                        onChange={(e) => handleCorrectAnswerChange(qIdx, e.target.value)}
                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-green-600 focus:ring-0"
                      >
                        <option value="">Select correct answer</option>
                        {q.options.map((_, idx) => (
                          <option key={idx} value={optionLabel(idx)}>
                            {optionLabel(idx)}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.questionErrors[qIdx]?.correctAnswer && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.questionErrors[qIdx].correctAnswer}
                      </p>
                    )}
                  </>
                )}

                {mcqType === "True/False" && (
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2 mb-1 font-semibold">
                      <span className="w-6 text-center">T</span>
                      <span className="w-6 text-center">F</span>
                      <span>Option</span>
                    </div>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="mb-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`tf-${qIdx}-${oIdx}`}
                            checked={opt.value === "T"}
                            onChange={() => handleTFSelect(qIdx, oIdx, "T")}
                            className="w-4 h-4 text-green-600 accent-green-600"
                          />
                          <input
                            type="radio"
                            name={`tf-${qIdx}-${oIdx}`}
                            checked={opt.value === "F"}
                            onChange={() => handleTFSelect(qIdx, oIdx, "F")}
                            className="w-4 h-4 text-red-600 accent-red-600"
                          />
                          <span className="font-semibold w-4">{optionLabel(oIdx)}.</span>
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => handleTFOptionTextChange(qIdx, oIdx, e.target.value)}
                            className="flex-1 p-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-green-600 focus:ring-0"
                          />
                          <button
                            onClick={() => handleDeleteOption(qIdx, oIdx)}
                            className="text-red-600 hover:text-white px-2 py-1 rounded bg-gray-200 hover:bg-red-500"
                          >
                            <FaMinus />
                          </button>
                        </div>
                        {errors.questionErrors[qIdx]?.[oIdx] && (
                          <p className="text-red-500 text-xs mt-1 ml-12">
                            {errors.questionErrors[qIdx][oIdx]}
                          </p>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddOption(qIdx)}
                      className="text-green-600 font-medium text-sm mt-1 hover:underline"
                    >
                      + Add Option
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2 sm:mt-0">
              <button
                onClick={() => setDeleteTarget(qIdx)}
                className="px-3 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {questions.length > 0 && (
          <div className="flex justify-end space-x-3 pt-3">
            <button
              onClick={handleSaveMCQ}
              disabled={isSaving}
              className={`px-4 py-2 rounded-lg text-white transition ${
                isSaving
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSaving ? "Saving..." : "Save MCQ"}
            </button>
          </div>
        )}

        {deleteTarget !== null && (
          <ConfirmDialog
            message="Are you sure you want to delete this question?"
            onConfirm={() => {
              setQuestions(questions.filter((_, idx) => idx !== deleteTarget));
              setDeleteTarget(null);
              setShowSuccess(true);
              setSuccessMessage("Question deleted successfully!");
              setTimeout(() => setShowSuccess(false), 1500);
            }}
            onCancel={() => setDeleteTarget(null)}
          />
        )}

        {showSuccess && (
          <SuccessCheck
            show={showSuccess}
            message={successMessage}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </div>
    </div>
  );
}
