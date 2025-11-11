import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { NotesAPI } from "../../api/notes";
import { AccountsContext } from "../../context/AccountsContext";

export default function NoteDetailPage() {
  const { id } = useParams();
  const { token } = useContext(AccountsContext);
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      if (!token) return;
      try {
        const data = await NotesAPI.getNote(id, token);
        setNote(data);
      } catch (err) {
        console.error("Failed to fetch note:", err);
      }
    };
    fetchNote();
  }, [id, token]);

  if (!note) {
    return <p className="text-center mt-10">Note not found.</p>;
  }

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-10 px-4">
      <div className="w-full lg:w-4/6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold mb-1">{note.title}</h1>
          <hr />
          <p className="text-gray-500 text-sm mb-4">
            {new Date(note.created_at).toISOString().split("T")[0]}
          </p>
        </div>

        <div
          className="prose dark:prose-invert max-w-full"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>
    </div>
  );
}
