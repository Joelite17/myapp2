import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import SuccessCheck from "../../components/SuccessCheck";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NotesAPI } from "../../api/notes";
import { AccountsContext } from "../../context/AccountsContext";

export default function CreateNotePage() {
  const navigate = useNavigate();
  const { token } = useContext(AccountsContext);

  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["clean"],
      ],
    },
  });

  const handleSave = async () => {
    if (!title.trim()) {
      setErrorMessage("Title cannot be empty.");
      return;
    }

    setErrorMessage("");

    try {
      const content = quill.root.innerHTML;

      if (!token) {
        throw new Error("You must be logged in to create a note.");
      }

      await NotesAPI.createNote({ title, content, visibility });
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/notes");
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to create note.");
    }
  };

  return (
    <div className="relative flex justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-10 px-4">
      <div className="w-full lg:w-4/6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Create Note</h1>

        {errorMessage && (
          <div className="p-2 bg-red-100 text-red-700 rounded mb-2">
            {errorMessage}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Content</label>
          <div
            ref={quillRef}
            className="h-64 bg-gray-50 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Visibility</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="private">Private (Default)</option>
            <option value="public">Public</option>
            <option value="subscriber">Subscriber Only</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={() => navigate("/notes")}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Create Note
          </button>
        </div>
      </div>

      <SuccessCheck
        show={showSuccess}
        message="Note created successfully!"
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
