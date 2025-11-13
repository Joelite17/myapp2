// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Layout & UI
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// Pages
import Feeds from "./pages/Feeds";
import Dashboard from "./pages/Dashboard";
import MCQDetailPage from "./pages/resources/MCQDetail";
import FlashcardDetailPage from "./pages/resources/FlashcardDetail"
// import NoteDetailPage from "./pages/resources/NoteDetail"

// Accounts
import Signup from "./pages/accounts/Signup";
import UserProfilePage from "./pages/accounts/UserProfile";
import MyProfilePage from "./pages/accounts/MyProfile";
import Login from "./pages/accounts/Login";
import ForgotPassword from "./pages/accounts/ForgotPassword";
import ResetPassword from "./pages/accounts/ResetPassword";

// Context & Protection
import { AccountsProvider } from "./context/AccountsContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Helper Layout wrapper
function Layout({ children, sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) {
  const location = useLocation();

  // Hide sidebar & navbar on accounts pages
  const hideLayout = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ].includes(location.pathname);

  if (hideLayout) return <>{children}</>;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="flex-1 flex flex-col relative">
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main
          className={`p-4 overflow-y-auto transition-all duration-300 ${
            sidebarOpen
              ? "opacity-50 pointer-events-none lg:opacity-100 lg:pointer-events-auto"
              : "opacity-100"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <AccountsProvider>
      <Router>
        <Layout
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/" element={<Dashboard darkMode={darkMode} />} />
                    <Route path="/feeds" element={<Feeds darkMode={darkMode} />} />
                    <Route path="/profiles/:username" element={<UserProfilePage darkMode={darkMode} />} />
                    <Route path="/profile" element={<MyProfilePage darkMode={darkMode} />} />
                    <Route path="/mcqsets/:id" element={<MCQDetailPage />} />
                    <Route path="/flashcardsets/:id" element={<FlashcardDetailPage />} />

                    {/* <Route path="/notes/:id" element={<NoteDetailPage darkMode={darkMode} />} /> */}
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AccountsProvider>
  );
}
