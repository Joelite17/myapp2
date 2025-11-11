// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AccountsAPI } from "../../api/accounts";
import Spinner from "../../components/Spinner";

export default function ResetPassword() {
  const [formData, setFormData] = useState({ password1: "", password2: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password1 !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await AccountsAPI.resetPassword(uid, token, {
        password: formData.password1,
        password2: formData.password2
      });
      navigate("/login");
    } catch (err) {
      setError(err.message);
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
          <h2 className="text-3xl font-semibold text-center mb-8">Reset Password</h2>

          {error && <div className="mb-4 text-red-400 text-sm text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "password1", label: "New Password", type: "password" },
              { name: "password2", label: "Confirm Password", type: "password" },
            ].map((f) => (
              <div key={f.name} className="relative border-b border-white/40 pb-3">
                <input
                  name={f.name}
                  type={f.type}
                  value={formData[f.name]}
                  onChange={handleChange}
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
                  {f.label}
                </label>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full border border-white text-white py-2 rounded-md font-medium bg-transparent hover:bg-white hover:text-gray-900 transition duration-300"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
