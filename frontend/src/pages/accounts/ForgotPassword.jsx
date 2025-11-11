// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { AccountsAPI } from "../../api/accounts";
import Spinner from "../../components/Spinner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await AccountsAPI.forgotPassword(email);
      setMessage("If the email exists, a reset link has been sent.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div
        aria-hidden
        className="fixed inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url('/login-hero-bg.jpg')` }}
      />
      <div className="fixed inset-0 bg-black/50" aria-hidden />

      {loading && <Spinner />}

      <div className="relative w-full max-w-md mx-4 py-16">
        <div className="bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-3xl font-semibold text-center mb-8">Forgot Password</h2>

          {message && <div className="mb-4 text-green-400 text-center">{message}</div>}
          {error && <div className="mb-4 text-red-400 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative border-b border-white/40 pb-3">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                className="peer w-full bg-transparent border-none outline-none text-white text-base pt-5 pb-2 placeholder-transparent"
              />
              <label
                className="absolute left-0 text-gray-200 transition-all pointer-events-none
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                peer-focus:top-0 peer-focus:-translate-y-3 peer-focus:text-sm peer-focus:text-white
                top-0 -translate-y-3 text-sm"
              >
                Email
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full border border-white text-white py-2 rounded-md font-medium bg-transparent hover:bg-white hover:text-gray-900 transition duration-300"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center mt-4 text-sm text-gray-200">
              <Link to="/login" className="text-white font-semibold hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
