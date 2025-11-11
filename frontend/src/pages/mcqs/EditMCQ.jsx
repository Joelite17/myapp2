import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import ConfirmDialog from "../../components/ConfirmDialog";
import SuccessCheck from "../../components/SuccessCheck";

export default function EditMCQPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const mcq = state?.mcq;

  const [questions, setQuestions] = useState(mcq?.questions || []);
  const [expanded, setExpanded] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!mcq) navigate("/mcqs"); // fallback if accessed directly
  }, [mcq, navigate]);

  const optionLabel = (idx) => String.fromCharCode(65 + idx);

  const toggleExpand = (idx) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIdx, value) => {
    const updated = [...questions];
    updated[qIdx].correctAnswer = value;
    setQuestions(updated);
  };

  const handleAddOption = (qIdx) => {
    const updated = [...questions];
    updated[qIdx].options.push("");
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), question: "", options: [""], correctAnswer: "" },
    ]);
  };

  const handleDeleteQuestion = () => {
    setQuestions(questions.filter((_, idx) => idx !== deleteTarget));
    setDeleteTarget(null);
    setIsDialogOpen(false);
    setShowSuccess(true);
    setSuccessMessage("Question deleted successfully!");
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const handleSaveMCQ = () => {
    console.log("Updated MCQ:", { ...mcq, questions });
    setShowSuccess(true);
    setSuccessMessage("MCQ updated successfully!");
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/mcqs");
    }, 1500);
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-10 px-4">
      <div className="w-full lg:w-4/6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Edit MCQ: {mcq?.title}</h1>
          <button
            onClick={handleAddQuestion}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition"
          >
            <FaPlus />
          </button>
        </div>

        {/* Questions List */}
        {questions.map((q, qIdx) => (
          <div key={q.id} className="flex flex-col sm:flex-row sm:items-start gap-2">
            {/* Question & Options */}
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
                  }}
                  placeholder={`Question ${qIdx + 1}`}
                  className="flex-1 ml-2 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 font-semibold"
                />
                <span className="ml-2">{expanded[qIdx] ? <FaChevronUp /> : <FaChevronDown />}</span>
              </div>

              {/* Collapsible options */}
              <div
                className={`overflow-hidden transition-all duration-300 mt-2 ${
                  expanded[qIdx] ? "max-h-96" : "max-h-0"
                }`}
              >
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2 mb-2">
                    <span className="font-semibold w-5">{optionLabel(oIdx)}.</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                      className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                ))}

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
                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select correct answer</option>
                    {q.options.map((_, idx) => (
                      <option key={idx} value={optionLabel(idx)}>
                        {optionLabel(idx)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Delete button outside */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => setDeleteTarget(qIdx)}
                    className="px-3 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
                >
                    Delete
                </button>
            </div>

          </div>
        ))}

        {/* Save MCQ button */}
        <div className="flex justify-end space-x-3 pt-3">
          <button
            onClick={handleSaveMCQ}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Save MCQ
          </button>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteTarget !== null && (
        <ConfirmDialog
          message="Are you sure you want to delete this question?"
          onConfirm={handleDeleteQuestion}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Success Feedback */}
      {showSuccess && (
        <SuccessCheck
          show={showSuccess}
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
