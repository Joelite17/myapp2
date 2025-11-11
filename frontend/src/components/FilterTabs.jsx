export default function FilterTabs({ activeTab, setActiveTab, tabs = ["all", "note", "mcq", "flashcard"] }) {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
            activeTab === tab
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-800 border-green-200 hover:bg-green-100 hover:text-green-700 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-green-400"
          }`}
        >
          {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1) + "s"}
        </button>
      ))}
    </div>
  );
}
