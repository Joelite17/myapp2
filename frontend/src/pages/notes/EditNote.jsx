import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import SuccessCheck from "../../components/SuccessCheck";
import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { NotesAPI } from "../../api/notes";
import { AccountsContext } from "../../context/AccountsContext";

export default function EditNotePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const note = state?.note;

  const { token } = useContext(AccountsContext);

  const [title, setTitle] = useState(note?.title || "");
  const [visibility, setVisibility] = useState(note?.visibility || "private");
  const [showSuccess, setShowSuccess] = useState(false);

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

  // Initialize quill content when ready
  useEffect(() => {
    if (quill && note?.content) quill.root.innerHTML = note.content;
  }, [quill, note]);

  const handleSave = async () => {
    if (!token) return alert("You must be logged in");

    try {
      const updatedContent = quill.root.innerHTML;
      await NotesAPI.updateNote(id, { title, content: updatedContent, visibility }, token);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/notes");
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to update note. Check console for details.");
    }
  };

  return (
    <div className="relative flex justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-10 px-4">
      <div className="w-full lg:w-4/6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Edit Note</h1>

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
            Save Changes
          </button>
        </div>
      </div>

      <SuccessCheck
        show={showSuccess}
        message="Note updated successfully!"
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
