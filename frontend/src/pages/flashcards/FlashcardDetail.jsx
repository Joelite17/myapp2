import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FlashcardsAPI } from "../../api/flashcards";

export default function FlashCardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const fetchSet = async () => {
      try {
        const data = await FlashcardsAPI.getFlashcardSet(id);
        if (!data.cards || data.cards.length === 0) {
          alert("This flashcard set is empty.");
          navigate("/flashcards");
          return;
        }

        // Shuffle cards
        const shuffled = [...data.cards].sort(() => Math.random() - 0.5);
        setFlashcards(shuffled);
      } catch (err) {
        console.error("Error fetching flashcard set:", err);
        alert("Failed to load flashcard set.");
        navigate("/flashcards");
      }
    };
    fetchSet();
  }, [id, navigate]);


  const nextCard = () => {
    setFlipped(false);
    setCurrent((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setFlipped(false);
    setCurrent((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  if (flashcards.length === 0) return null;

  return (
    <div className="flex justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-[calc(100vh-64px)] p-4">
      <div className="w-full lg:w-4/6 flex flex-col space-y-4">
        {/* Flashcard Container */}
        <div className="w-full max-w-3xl h-80 lg:h-96 mx-auto relative perspective">
          <div
            className={`relative w-full h-full transition-transform duration-700 transform ${
              flipped ? "rotate-y-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
            onClick={() => setFlipped(!flipped)}
          >
            {/* Front Face */}
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col overflow-hidden backface-hidden">
              <div className="flex-1 flex items-center justify-center overflow-y-auto p-2">
                <p className="text-gray-900 dark:text-gray-100 text-lg whitespace-pre-line text-center">
                  {flashcards[current].question}
                </p>
              </div>
            </div>

            {/* Back Face */}
            <div className="absolute inset-0 bg-green-100 dark:bg-green-800 rounded-lg shadow-lg p-4 flex flex-col overflow-hidden rotate-y-180 backface-hidden">
              <div className="flex-1 flex items-center justify-center overflow-y-auto p-2">
               <p
                  className="text-gray-900 dark:text-gray-100 text-lg whitespace-pre-line text-center"
                  dangerouslySetInnerHTML={{ __html: flashcards[current].answer }}
                />

              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between w-full mt-2">
          <button
            onClick={prevCard}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Previous
          </button>
          <button
            onClick={nextCard}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Next
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Card {current + 1} of {flashcards.length}
        </p>
      </div>
    </div>
  );
}
