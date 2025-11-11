import { useState, useEffect, useContext } from "react";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user's notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      setErrorMessage("");
      try {
        if (!token) throw new Error("You must be logged in to view notes.");
        const data = await NotesAPI.getNotes(); // backend should return only this user's notes
        setNotes(data);
      } catch (err) {
        console.error(err);
        setErrorMessage(err.message || "Failed to load notes.");
      }
    };

    fetchNotes();
  }, [token]);

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

  const handleEditClick = (note) => {
    navigate(`/notes/${note.id}/edit`, { state: { note } });
  };

  const handleViewClick = (note) => {
    navigate(`/notes/${note.id}`, { state: { note } });
  };

  return (
    <div className="relative flex justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4">
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
          <div className="p-2 bg-red-100 text-red-700 rounded mb-2">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <Link to={`/notes/${note.id}`}>
                <p className="font-semibold text-sm mb-1">{note.title}</p>
              </Link>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
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
          ))}
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
