// src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AccountsAPI } from "../../api/accounts";
import Spinner from "../../components/Spinner";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password1: "",
    password2: "",
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await AccountsAPI.register(formData);
      navigate("/login");
    } catch (err) {
      try {
        const errData = JSON.parse(err.message);
        setErrors(errData);
      } catch {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "username", label: "Username" },
    { name: "first_name", label: "First Name" },
    { name: "last_name", label: "Last Name" },
    { name: "email", label: "Email", type: "email" },
    { name: "password1", label: "Password", type: "password" },
    { name: "password2", label: "Confirm Password", type: "password" },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <div
        aria-hidden
        className="fixed inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url('/login-hero-bg.jpg')` }}
      />
      <div className="fixed inset-0 bg-black/50" aria-hidden />

      {/* Spinner */}
      {loading && <Spinner />}

      <div className="relative w-full max-w-md mx-4 py-16">
        <div className="bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-3xl font-semibold text-center mb-8">Sign Up</h2>

          <form onSubmit={handleSignup} className="space-y-5">
            {fields.map((f) => (
              <div key={f.name}>
                <div className="relative border-b border-white/40 pb-1">
                  <input
                    name={f.name}
                    type={f.type || "text"}
                    value={formData[f.name]}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    className={`peer w-full bg-transparent border-none outline-none text-white text-base pt-5 pb-2 placeholder-transparent ${
                      errors[f.name] ? "border-red-500" : ""
                    }`}
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
                {errors[f.name] &&
                  errors[f.name].map((msg, i) => (
                    <p key={i} className="text-red-500 text-sm mt-1">{msg}</p>
                  ))}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center border border-white text-white py-2 rounded-md font-medium bg-transparent hover:bg-white hover:text-gray-900 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="text-center mt-4 text-sm text-gray-200">
              Already have an account?{" "}
              <Link to="/login" className="text-white font-semibold hover:underline">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
