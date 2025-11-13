import { MCQAPI } from "../api/mcqs";
import { FlashcardsAPI } from "../api/flashcards";
import FeedItem from "../components/FeedItem";
import { useState, useEffect } from "react";

export default function Feeds() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const [mcqSets, flashSets] = await Promise.all([
          MCQAPI.fetchMCQSets(),
          FlashcardsAPI.fetchFlashcardSets(),
        ]);

        const allPosts = [
          ...mcqSets.map((m) => ({
            id: m.id,
            type: "MCQ",
            title: m.title,
            total_likes: m.total_likes,
            user_liked: m.user_liked,
          })),
          ...flashSets.map((f) => ({
            id: f.id,
            type: "Flashcard",
            title: f.title,
            total_likes: f.total_likes,
            user_liked: f.user_liked,
          })),
        ];

        setPosts(allPosts);
      } catch (err) {
        console.error("Failed to load feed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) return <p className="text-center py-6">Loading...</p>;

  return (
    <div className="flex justify-center w-full text-gray-900 dark:text-gray-100">
      <div className="w-full lg:w-4/6 space-y-4 py-6 px-4">
        {posts.map((post) => (
          <FeedItem key={`${post.type}-${post.id}`} post={post} />
        ))}
      </div>
    </div>
  );
}
