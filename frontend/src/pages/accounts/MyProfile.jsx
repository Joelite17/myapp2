import { useState, useEffect, useContext } from "react";
import FeedItem from "../../components/FeedItem";
import ProfileInfo from "../../components/ProfileInfo";
import FilterTabs from "../../components/FilterTabs";
import { AccountsContext } from "../../context/AccountsContext";
import { MCQAPI } from "../../api/mcqs";
import { FlashcardsAPI } from "../../api/flashcards"; // ✅ import flashcards API

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [mcqPosts, setMcqPosts] = useState([]);
  const [flashcardPosts, setFlashcardPosts] = useState([]);
  const { user } = useContext(AccountsContext);

  const userData = {
    name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username,
    username: `@${user.username}`,
    avatar: "https://i.pravatar.cc/100?img=3",
  };

  // Fetch liked MCQs
  useEffect(() => {
    const fetchMCQs = async () => {
      try {
        const data = await MCQAPI.fetchMCQSets();
        const likedMCQs = data
          .filter((item) => item.user_liked)
          .map((item) => ({
            id: item.id,
            type: "MCQ",
            title: item.title,
            total_likes: item.total_likes,
            user_liked: item.user_liked,
          }));
        setMcqPosts(likedMCQs);
      } catch (err) {
        console.error("Failed to load liked MCQ data:", err);
      }
    };
    fetchMCQs();
  }, []);

  // Fetch user's flashcard sets
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const data = await FlashcardsAPI.fetchFlashcardSets();
        const formatted = data
        .filter((item) => item.user_liked)
        .map((item) => ({
          id: item.id,
          type: "Flashcard",
          title: item.title,
          total_likes: item.total_likes,
          user_liked: item.user_liked,
        }));
        setFlashcardPosts(formatted);
      } catch (err) {
        console.error("Failed to load flashcard data:", err);
      }
    };
    fetchFlashcards();
  }, []);

  // Handle like/unlike for MCQs
  const handleLikeChange = (id, liked, likes_count, type) => {
    console.log(type)
    if (type === "MCQ") {
      console.log(type)
      setMcqPosts((prev) => {
        if (!liked) return prev.filter((p) => p.id !== id);
        return prev.map((p) =>
          p.id === id ? { ...p, user_liked: liked, total_likes: likes_count } : p
        );
      });
    } else {
      setFlashcardPosts((prev) => {
        if (!liked) return prev.filter((p) => p.id !== id);
        return prev.map((p) =>
          p.id === id ? { ...p, user_liked: liked, total_likes: likes_count } : p
        );
      });
    }
  };

  // Combine all posts
  const posts = [
    { id: 100, type: "Note", title: "Understanding PEM pathophysiology" },
    ...mcqPosts,
    ...flashcardPosts,
  ];

  const filteredPosts =
    activeTab === "all"
      ? posts
      : posts.filter((p) => p.type.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="flex justify-center w-full min-h-screen text-gray-900 dark:text-gray-100">
      <div className="w-full lg:w-4/6 space-y-4 py-8 px-4">
        <ProfileInfo user={userData} />
        <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <FeedItem
              key={`${post.type}-${post.id}`}
              post={post}
              onLikeChange={handleLikeChange} // only MCQs
            />
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
            No public posts available yet.
          </p>
        )}
      </div>
    </div>
  );
}
