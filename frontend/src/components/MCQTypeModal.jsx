import React from "react";

export default function MCQTypeModal({ show, onClose, onSelect }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4 text-center">Select MCQ Type</h2>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => onSelect("best_option")}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
          >
            Best Option
          </button>
          <button
            onClick={() => onSelect("true_false")}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
          >
            True/False
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
