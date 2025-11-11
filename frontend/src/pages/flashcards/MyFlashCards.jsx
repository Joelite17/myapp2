import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import ConfirmDialog from "../../components/ConfirmDialog";
import SuccessCheck from "../../components/SuccessCheck";
import { FlashcardsAPI } from "../../api/flashcards";

export default function FlashcardPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [flashcards, setFlashcards] = useState([]);
  const [expandedTitles, setExpandedTitles] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [wordsPerLine, setWordsPerLine] = useState(10);

  // Fetch flashcards
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const data = await FlashcardsAPI.getFlashcardSets();
        setFlashcards(data);
      } catch (err) {
        console.error(err);
        setErrorMessage(err.message || "Failed to load flashcards.");
      }
    };
    fetchFlashcards();
  }, []);

  // Calculate words per line dynamically
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

  const truncateText = (text, numWords) => {
    const words = text.split(" ");
    if (words.length <= numWords) return text;
    return words.slice(0, numWords).join(" ") + "…";
  };

  const toggleExpanded = (id) => {
    setExpandedTitles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteClick = (id) => {
    setFlashcardToDelete(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await FlashcardsAPI.deleteFlashcardSet(flashcardToDelete);
      setFlashcards(flashcards.filter((f) => f.id !== flashcardToDelete));
      setSuccessMessage("Flashcard deleted successfully!");
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to delete flashcard.");
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleEditClick = (flashcard) =>
    navigate(`/flashcards/${flashcard.id}/edit`, { state: { flashcard } });
  const handleViewClick = (flashcard) =>
    navigate(`/flashcards/${flashcard.id}`, { state: { flashcard } });

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4"
    >
      <div className="w-full lg:w-4/6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Flashcards</h1>
          <button
            onClick={() => navigate("/flashcards/create")}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-md transition"
          >
            <FaPlus />
          </button>
        </div>

        {errorMessage && (
          <div className="p-2 bg-red-100 text-red-700 rounded mb-2">{errorMessage}</div>
        )}

        <div className="space-y-4">
          {flashcards.length > 0 ? (
            flashcards.map((f) => {
              const isExpanded = expandedTitles[f.id];
              const displayTitle = isExpanded
                ? f.title
                : truncateText(f.title, wordsPerLine);

              return (
                <div
                  key={f.id}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
                >
                  <p
                    className="font-semibold text-sm mb-1 cursor-pointer"
                    onClick={() => toggleExpanded(f.id)}
                  >
                    {displayTitle}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      {f.created_at
                        ? new Date(f.created_at).toISOString().split("T")[0]
                        : ""}
                    </p>
                    <div className="space-x-4">
                      <button
                        onClick={() => handleViewClick(f)}
                        className="text-blue-500 font-semibold hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(f)}
                        className="text-yellow-500 font-semibold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(f.id)}
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
            <p className="text-center text-gray-500 dark:text-gray-400">
              No flashcards yet.
            </p>
          )}
        </div>
      </div>

      {isDialogOpen && (
        <ConfirmDialog
          message="Are you sure you want to delete this flashcard?"
          onConfirm={confirmDelete}
          onCancel={() => setIsDialogOpen(false)}
        />
      )}

      <SuccessCheck
        show={showSuccess}
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
