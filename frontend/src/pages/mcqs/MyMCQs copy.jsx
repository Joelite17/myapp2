import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import ConfirmDialog from "../../components/ConfirmDialog";
import SuccessCheck from "../../components/SuccessCheck";
import { fetchMCQs, deleteMCQ } from "../../api/mcqs"; // make sure this points to your API service

export default function MyMCQsPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [mcqs, setMcqs] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mcqToDelete, setMcqToDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [wordsPerLine, setWordsPerLine] = useState(10);

  // Fetch MCQs from backend
  useEffect(() => {
    const loadMCQs = async () => {
      try {
        const data = await fetchMCQs();
        setMcqs(data);
      } catch (err) {
        console.error("Error fetching MCQs:", err);
      }
    };
    loadMCQs();
  }, []);

  // Calculate words per line dynamically based on container width
  useEffect(() => {
    const calculateWordsPerLine = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const avgCharWidth = 8; // approximate width of a character in pixels
      const approxCharsPerLine = Math.floor(containerWidth / avgCharWidth);
      const approxWords = Math.floor(approxCharsPerLine / 6); // 5 chars + 1 space
      setWordsPerLine(approxWords);
    };

    calculateWordsPerLine();
    window.addEventListener("resize", calculateWordsPerLine);
    return () => window.removeEventListener("resize", calculateWordsPerLine);
  }, []);

  // Truncate text helper
  const truncateText = (text, numWords) => {
    const words = text.split(" ");
    if (words.length <= numWords) return text;
    return words.slice(0, numWords).join(" ") + "…";
  };

  const toggleExpanded = (id) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Delete handlers
  const handleDeleteClick = (id) => {
    setMcqToDelete(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMCQ(mcqToDelete);
      setMcqs(mcqs.filter((mcq) => mcq.id !== mcqToDelete));
      setSuccessMessage("MCQ deleted successfully!");
      setShowSuccess(true);
    } catch (err) {
      console.error("Error deleting MCQ:", err);
      alert("Failed to delete MCQ: " + err.message);
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleEditClick = (mcq) => {
    navigate(`/mcqs/${mcq.id}/edit`, { state: { mcq } });
  };

  const handleAddClick = () => setShowTypeModal(true);

  const handleSelectType = (type) => {
    setShowTypeModal(false);
    navigate("/mcqs/create", { state: { type } });
  };

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center w-full min-h-screen px-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      <div className={`${showTypeModal ? "filter blur-sm" : ""} w-full lg:w-4/6 space-y-6 transition-all duration-300`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My MCQs</h1>
          <button
            onClick={handleAddClick}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-md transition"
          >
            <FaPlus />
          </button>
        </div>

        {/* MCQ List */}
        <div className="space-y-4">
          {mcqs.length > 0 ? (
            mcqs.map((mcq) => {
              const isExpanded = expandedQuestions[mcq.id];
              const displayQuestion = isExpanded
                ? mcq.question
                : truncateText(mcq.question, wordsPerLine);

              return (
                <div
                  key={mcq.id}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
                >
                  <p
                    className="font-semibold text-sm mb-2 cursor-pointer"
                    onClick={() => toggleExpanded(mcq.id)}
                  >
                    {displayQuestion}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      {mcq.created_at
                        ? new Date(mcq.created_at).toISOString().split("T")[0]
                        : ""}
                    </p>
                    <div className="space-x-4">
                      <button
                        onClick={() => navigate(`/mcqs/${mcq.id}`)}
                        className="text-blue-500 font-semibold hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(mcq)}
                        className="text-yellow-500 font-semibold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(mcq.id)}
                        className="text-red-600 font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No MCQs found.</p>
          )}
        </div>
      </div>

      {/* Type Selection Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-50 w-80 flex flex-col space-y-4">
            <h2 className="text-xl font-bold text-center">Select MCQ Type</h2>
            <button
              onClick={() => handleSelectType("Best Option")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Best Option
            </button>
            <button
              onClick={() => handleSelectType("True/False")}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              True/False
            </button>
            <button
              onClick={() => setShowTypeModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDialogOpen && (
        <ConfirmDialog
          message="Are you sure you want to delete this MCQ?"
          onConfirm={confirmDelete}
          onCancel={() => setIsDialogOpen(false)}
        />
      )}

      {/* Success Feedback */}
      <SuccessCheck
        show={showSuccess}
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
