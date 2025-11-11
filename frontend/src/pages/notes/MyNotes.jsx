import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import ConfirmDialog from "../../components/ConfirmDialog";
import SuccessCheck from "../../components/SuccessCheck";
import { NotesAPI } from "../../api/notes";
import { AccountsContext } from "../../context/AccountsContext";

export default function MyNotesPage() {
  const navigate = useNavigate();
  const { token } = useContext(AccountsContext);
  const [notes, setNotes] = useState([]);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const containerRef = useRef(null);
  const [wordsPerLine, setWordsPerLine] = useState(10);

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        if (!token) throw new Error("You must be logged in to view notes.");
        const data = await NotesAPI.getNotes();
        setNotes(data);
      } catch (err) {
        console.error(err);
        setErrorMessage(err.message || "Failed to load notes.");
      }
    };
    fetchNotes();
  }, [token]);

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
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteClick = (id) => {
    setNoteToDelete(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!token) throw new Error("You must be logged in to delete notes.");
      await NotesAPI.deleteNote(noteToDelete);
      setNotes(notes.filter((note) => note.id !== noteToDelete));
      setSuccessMessage("Note deleted successfully!");
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to delete note.");
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleEditClick = (note) => navigate(`/notes/${note.id}/edit`, { state: { note } });
  const handleViewClick = (note) => navigate(`/notes/${note.id}`, { state: { note } });

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4"
    >
      <div className="w-full lg:w-4/6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Notes</h1>
          <button
            onClick={() => navigate("/notes/create")}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-md transition"
          >
            <FaPlus />
          </button>
        </div>

        {errorMessage && (
          <div className="p-2 bg-red-100 text-red-700 rounded mb-2">{errorMessage}</div>
        )}

        <div className="space-y-4">
          {notes.map((note) => {
            const isExpanded = expandedNotes[note.id];
            const displayText = isExpanded
              ? note.title
              : truncateText(note.title, wordsPerLine);

            return (
              <div
                key={note.id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
              >
                <p className="font-semibold text-sm">{displayText}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <p>
                    {note.created_at
                      ? new Date(note.created_at).toISOString().split("T")[0]
                      : ""}
                  </p>

                  <div className="space-x-4">
                    <button
                      onClick={() => handleViewClick(note)}
                      className="text-blue-500 font-semibold hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditClick(note)}
                      className="text-yellow-500 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(note.id)}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isDialogOpen && (
        <ConfirmDialog
          message="Are you sure you want to delete this note?"
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
