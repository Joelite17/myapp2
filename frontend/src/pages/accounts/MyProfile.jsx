import { useState } from "react";
import FeedItem from "../../components/FeedItem";
import ProfileInfo from "../../components/ProfileInfo";
import FilterTabs from "../../components/FilterTabs";

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState("all");

  // Mock authenticated user
  const authUser = {
    name: "Dr. Egbeogu",
    username: "@dr_egbeogu",
    avatar: "https://i.pravatar.cc/100?img=3",
    bio: "Pediatrician | Educator | Lifelong Learner",
    followers: 1280,
    following: 523,
  };

  // Mock posts belonging only to the authenticated user
  const myPosts = [
    {
      id: 1,
      type: "Note",
      title: "Understanding PEM pathophysiology",
      time: "2 days ago",
      user: { name: authUser.name, avatar: authUser.avatar },
    },
    {
      id: 2,
      type: "MCQ",
      title: "Marasmus vs Kwashiorkor clinical differences",
      time: "1 week ago",
      user: { name: authUser.name, avatar: authUser.avatar },
    },
    {
      id: 3,
      type: "Flashcard",
      title: "Key signs of protein-energy malnutrition",
      time: "3 weeks ago",
      user: { name: authUser.name, avatar: authUser.avatar },
    },
  ];

  // Filter posts based on the active tab
  const filteredPosts =
    activeTab === "all"
      ? myPosts
      : myPosts.filter((p) => p.type.toLowerCase() === activeTab);

  return (
    <div className="flex justify-center w-full min-h-screen text-gray-900 dark:text-gray-100">
      <div className="w-full lg:w-4/6 space-y-4 py-8 px-4">
        {/* Profile Header */}
        <ProfileInfo user={authUser} />

        {/* Filter Tabs */}
        <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* User’s Posts */}
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <FeedItem key={post.id} post={post} />)
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
            You haven't created any posts yet.
          </p>
        )}
      </div>
    </div>
  );
}
