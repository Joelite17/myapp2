import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import ConfirmDialog from "../../components/ConfirmDialog";
import SuccessCheck from "../../components/SuccessCheck";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { FlashcardsAPI } from "../../api/flashcards";

export default function EditFlashcardPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [cards, setCards] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [errors, setErrors] = useState({ title: "", cardErrors: [], general: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const titleRef = useRef(null);
  const cardRefs = useRef([]);

  // Fetch existing flashcard set
  useEffect(() => {
    const fetchSet = async () => {
      try {
        const data = await FlashcardsAPI.getFlashcardSet(id);
        setTitle(data.title || "");
        setCards(
          data.cards.length
            ? [...data.cards].reverse().map(card => ({ ...card, id: card.id || uuidv4() }))
            : [{ id: uuidv4(), question: "", answer: "" }]
        );
      } catch (err) {
        console.error("Error fetching flashcard set:", err);
        alert("Failed to load flashcard set.");
        navigate("/flashcards");
      }
    };
    fetchSet();
  }, [id, navigate]);

  const toggleExpand = (idx) => setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const handleQuestionChange = (idx, value) => {
    const updated = [...cards];
    updated[idx].question = value;
    setCards(updated);
    clearFieldError(idx, "question");
  };

  const handleAnswerChange = (idx, html) => {
    const updated = [...cards];
    updated[idx].answer = html;
    setCards(updated);
    clearFieldError(idx, "answer");
  };

  const handleAddFlashcard = () => {
    setCards([{ id: uuidv4(), question: "", answer: "" }, ...cards]);
  };

  const handleDeleteFlashcard = () => {
    setCards(cards.filter((_, idx) => idx !== deleteTarget));
    setDeleteTarget(null);
    setShowSuccess(true);
    setSuccessMessage("Flashcard deleted successfully!");
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const clearFieldError = (idx, field) => {
    setErrors((prev) => {
      const updatedCardErrors = [...prev.cardErrors];
      if (!updatedCardErrors[idx]) updatedCardErrors[idx] = {};
      updatedCardErrors[idx][field] = "";
      return { ...prev, cardErrors: updatedCardErrors, general: "" };
    });
  };

  const validateInputs = () => {
    const newErrors = { title: "", cardErrors: [], general: "" };
    let valid = true;
    const newExpanded = { ...expanded };

    if (!title.trim()) {
      newErrors.title = "Title is required.";
      valid = false;
    }

    const hasAtLeastOneQuestion = cards.some((card) => card.question.trim());
    if (!hasAtLeastOneQuestion) {
      newErrors.general = "Please add at least one question before saving.";
      valid = false;
    }

    cards.forEach((card, i) => {
      const cardError = {};
      if (card.question.trim() && (!card.answer || card.answer === "<p><br></p>")) {
        cardError.answer = "Answer is required.";
        valid = false;
        newExpanded[i] = true;
      }
      if (card.question.trim() === "") {
        cardError.question = "Question is required.";
        valid = false;
        newExpanded[i] = true;
      }
      newErrors.cardErrors[i] = cardError;
    });

    setErrors(newErrors);
    setExpanded(newExpanded);

    if (!valid) {
      setTimeout(() => {
        if (newErrors.title) {
          titleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          const firstCardErrorIdx = newErrors.cardErrors.findIndex(
            (e) => e.question || e.answer
          );
          if (firstCardErrorIdx !== -1) {
            cardRefs.current[firstCardErrorIdx]?.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }, 50);
    }

    return valid;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    const filteredCards = cards
      .filter(c => c.question.trim())
      .map(c => ({ question: c.question, answer: c.answer }));

    const payload = { title, cards: filteredCards };

    try {
      setIsSaving(true);
      await FlashcardsAPI.updateFlashcardSet(id, payload);
      setShowSuccess(true);
      setSuccessMessage("Flashcard set updated successfully!");
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/flashcards");
      }, 1500);
    } catch (err) {
      console.error("Error updating flashcard set:", err);
      alert("Error updating flashcard set: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-10 px-4">
      <div className="w-full lg:w-4/6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Edit Flashcard Set</h1>
          <button
            onClick={handleAddFlashcard}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition"
          >
            <FaPlus />
          </button>
        </div>

        <div>
          <label className="block font-semibold mb-2">Title</label>
          <input
            ref={titleRef}
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

        {cards.map((card, idx) => (
          <div key={card.id} className="flex flex-col sm:flex-row sm:items-start gap-2">
            <div className="flex-1 bg-white dark:bg-gray-800 shadow-md rounded-lg p-3 relative">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(idx)}
              >
                {/* Numbering reflects newest at top */}
                <span className="font-semibold">{cards.length - idx}.</span>
                <input
                  ref={(el) => (cardRefs.current[idx] = el)}
                  type="text"
                  value={card.question}
                  onChange={(e) => handleQuestionChange(idx, e.target.value)}
                  placeholder={`Question ${cards.length - idx}`}
                  className="flex-1 ml-2 p-2 rounded border border-gray-300 dark:border-gray-600 
                             bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-600 
                             focus:border-green-600 outline-none font-semibold"
                />
                <span className="ml-2">{expanded[idx] ? <FaChevronUp /> : <FaChevronDown />}</span>
              </div>
              {errors.cardErrors[idx]?.question && (
                <p className="text-red-500 text-sm mt-1">{errors.cardErrors[idx].question}</p>
              )}

              <div
                className={`overflow-hidden transition-all duration-300 mt-3 ${
                  expanded[idx] ? "max-h-[600px]" : "max-h-0"
                }`}
              >
                <AnswerEditor
                  value={card.answer}
                  onChange={(html) => handleAnswerChange(idx, html)}
                />
                {errors.cardErrors[idx]?.answer && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardErrors[idx].answer}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setDeleteTarget(idx)}
                className="px-3 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}

        <div className="flex justify-end space-x-3 pt-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg text-white transition ${
              isSaving ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSaving ? "Saving..." : "Update Flashcard Set"}
          </button>
        </div>
      </div>

      {deleteTarget !== null && (
        <ConfirmDialog
          message="Are you sure you want to delete this flashcard?"
          onConfirm={handleDeleteFlashcard}
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
  );
}

function AnswerEditor({ value, onChange }) {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["clean"]],
    },
  });

  // Set initial content once to avoid cursor jump
  useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(value || "");
    }
  }, [quill]);

  useEffect(() => {
    if (!quill) return;
    const handler = () => onChange(quill.root.innerHTML);
    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, [quill, onChange]);

  return (
    <div className="mt-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
      <div ref={quillRef} className="h-40 rounded-lg" />
    </div>
  );
}
