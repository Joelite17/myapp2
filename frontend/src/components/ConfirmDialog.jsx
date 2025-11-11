export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-80 text-center">
        <p className="text-gray-800 dark:text-gray-100 mb-4">{message}</p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium px-4 py-2 rounded-md transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
