import { Link } from "react-router-dom";
import { useContext } from "react";
import { AccountsContext } from "../context/AccountsContext";

export default function Dashboard() {
  const { user } = useContext(AccountsContext);
  const username = user.username

  return (
    <div className="flex-1 p-6 lg:p-10 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Welcome {username}</h1>

      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/notes"
          className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-start justify-center"
        >
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <p className="text-gray-500 dark:text-gray-400">View and manage your notes</p>
        </Link>

        <Link
          to="/mcqs"
          className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-start justify-center"
        >
          <h2 className="text-lg font-semibold mb-2">MCQs</h2>
          <p className="text-gray-500 dark:text-gray-400">Practice multiple choice questions</p>
        </Link>

        <Link
          to="/flashcards"
          className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-start justify-center"
        >
          <h2 className="text-lg font-semibold mb-2">Flashcards</h2>
          <p className="text-gray-500 dark:text-gray-400">Study with flashcards</p>
        </Link>
      </div>
    </div>
  );
}
