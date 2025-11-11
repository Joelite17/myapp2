import FeedItem from "../components/FeedItem";

export default function Feeds() {
  const notes = [
    {
      id: 1,
      type: "Note",
      title: "Sample Note on PEM Sample Note on PEMSample Note on PEMSample Note on PEMSample Note on PEMSample Note on PEM",
      time: "3m ago",
      user: { name: "Dr. Egbeogu", avatar: "https://i.pravatar.cc/50?img=3" },
    },
    {
      id: 2,
      type: "MCQ",
      title: "What is React?",
      time: "1h ago",
      user: { name: "Dr. Egbeogu", avatar: "https://i.pravatar.cc/50?img=5" },
    },
    {
      id: 3,
      type: "Flashcard",
      title: "Python Basics",
      time: "2 days ago",
      user: { name: "Dr. Egbeogu", avatar: "https://i.pravatar.cc/50?img=8" },
    },
  ];

  return (
    <div className="flex justify-center w-full text-gray-900 dark:text-gray-100">
      <div className="w-full lg:w-4/6 space-y-4 py-6 px-4">
        {notes.map((post) => (
          <FeedItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
