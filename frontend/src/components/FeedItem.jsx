import { Link } from "react-router-dom";

export default function FeedItem({ post }) {
  console.log(["post", post])
  if (!post) return null;

  // Determine link based on post type
  const link = {
    Note: `/notes/${post.id}`,
    MCQ: `/mcqsets/${post.id}`,
    Flashcard: `/flashcards/${post.id}`,
  }[post.type] || "#";

  return (
    <Link
      to={link}
      className="block bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-green-100 dark:border-green-700 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 relative"
    >
      {/* Title */}
      <p className="text-gray-900 dark:text-gray-100 font-medium text-sm leading-snug break-words">
        {post.title}
      </p>

      {/* Badge */}
      <div className="flex justify-end mt-2">
        <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded-md">
          {post.type?.toUpperCase()}
        </span>
      </div>
    </Link>
  );
}
