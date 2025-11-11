import { useState } from "react";
import { FaRegThumbsUp, FaThumbsUp, FaRegComment, FaShare } from "react-icons/fa";

export default function EngagementBar() {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(12);
  const [comments, setComments] = useState(3);
  const [shares, setShares] = useState(2);

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleComment = () => {
    alert("Comment clicked!");
  };

  const handleShare = () => {
    setShares((prev) => prev + 1);
    alert("Post shared!");
  };

  return (
    <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-2 transition-colors duration-300">
      <div className="flex justify-between text-gray-700 dark:text-gray-200 text-sm">
        <button
          className={`flex items-center space-x-2 transition-colors ${
            liked
              ? "text-green-600 dark:text-green-400"
              : "hover:text-green-600 dark:hover:text-green-400"
          }`}
          onClick={handleLike}
        >
          {liked ? <FaThumbsUp /> : <FaRegThumbsUp />}
          {/* <span>Like</span> */}
          <span className="text-gray-500 dark:text-gray-400 text-xs">({likes})</span>
        </button>

        <button
          className="flex items-center space-x-2 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          onClick={handleComment}
        >
          <FaRegComment />
          {/* <span>Comment</span> */}
          <span className="text-gray-500 dark:text-gray-400 text-xs">({comments})</span>
        </button>

        <button
          className="flex items-center space-x-2 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          onClick={handleShare}
        >
          <FaShare />
          {/* <span>Share</span> */}
          <span className="text-gray-500 dark:text-gray-400 text-xs">({shares})</span>
        </button>
      </div>
    </div>
  );
}
