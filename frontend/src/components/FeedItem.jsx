import { useState } from "react";
import { Link } from "react-router-dom";
import { MCQAPI } from "../api/mcqs";
import { FlashcardsAPI } from "../api/flashcards";
export default function FeedItem({ post, onLikeChange }) {
  const [likesCount, setLikesCount] = useState(post.total_likes || 0);
  const [liked, setLiked] = useState(post.user_liked || false);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    let data

    try {
      setLoading(true);
      if (post.type === "MCQ") {
        data = await MCQAPI.toggleLike(post.id);

      } else {
        data = await FlashcardsAPI.toggleLike(post.id)
      }
      setLiked(data.liked);
      setLikesCount(data.likes_count);

      // Notify parent for live update
      if (onLikeChange) onLikeChange(post.id, data.liked, data.likes_count, post.type);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  const link = {
    Note: `/notes/${post.id}`,
    MCQ: `/mcqsets/${post.id}`,
    Flashcard: `/flashcardsets/${post.id}`,
  }[post.type] || "#";

  return (
    <Link
      to={link}
      className="block bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-green-100 dark:border-green-700 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 relative"
    >
      <p className="text-gray-900 dark:text-gray-100 font-medium text-sm leading-snug break-words">
        {post.title}
      </p>

      <div className="flex justify-between items-center mt-3">
        <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded-md">
          {post.type?.toUpperCase()}
        </span>

        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-all ${
            liked
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${liked ? "fill-green-600" : "fill-gray-400"}`}
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41 1 4.13 2.44h.74C13.09 5 14.76 4 16.5 4 19.01 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {likesCount}
        </button>
  
      </div>
    </Link>
  );
}
