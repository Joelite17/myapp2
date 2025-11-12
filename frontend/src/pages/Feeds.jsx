import { useState, useEffect } from "react";
import FeedItem from "../components/FeedItem";
import { MCQAPI } from "../api/resources";

export default function Feeds() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);

      try {
        const mcqSets = await MCQAPI.fetchMCQSets();

        // Transform to unified format for FeedItem
        const mcqPosts = mcqSets.map((mcq) => ({
          id: mcq.id,
          type: "MCQ",
          title: mcq.title,
        }));

        setPosts(mcqPosts);
      } catch (err) {
        console.error("Failed to load MCQ sets:", err);
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
          <FeedItem key={`MCQ-${post.id}`} post={post} />
        ))}
      </div>
    </div>
  );
}
