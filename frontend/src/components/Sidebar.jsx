import { MdDashboard } from "react-icons/md";
import { FaHome, FaStickyNote, FaList, FaBook, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AccountsContext } from "../context/AccountsContext";

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout } = useContext(AccountsContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false); // close sidebar on mobile
    navigate("/login");
  };

  const menuItems = [
    { icon: <MdDashboard />, label: "Dashboard", path: "/" },
    { icon: <FaHome />, label: "Feeds", path: "/feeds" },
    { icon: <FaStickyNote />, label: "Notes", path: "/notes" },
    { icon: <FaList />, label: "MCQs", path: "/mcqs" },
    { icon: <FaBook />, label: "Flashcards", path: "/flashcards" },
    { icon: <FaUser />, label: "Profile", path: "/profile" },
  ];

  const handleLinkClick = () => {
    if (isOpen) setIsOpen(false); // close sidebar on mobile
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={`fixed lg:static z-30 bg-white dark:bg-gray-800 w-64 h-full shadow-md transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-4 text-xl font-bold border-b border-gray-200 dark:border-gray-700">
          Menu
        </div>
        <ul className="p-4 space-y-3">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                onClick={handleLinkClick}
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 cursor-pointer transition-colors duration-200"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 w-full text-left cursor-pointer transition-colors duration-200"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
}
