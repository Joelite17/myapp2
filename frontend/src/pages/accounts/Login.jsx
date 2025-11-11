import { useContext, useState } from "react";
import { AccountsContext } from "../../context/AccountsContext";
import { AccountsAPI } from "../../api/accounts";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner"; // import spinner

export default function Login() {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useContext(AccountsContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await AccountsAPI.login(formData.identifier, formData.password);
      login(res.user, res.tokens.access)
      navigate("/");
    } catch (err) {
      if (err.message.includes("identifier")) {
        setErrors({ identifier: err.message });
      } else if (err.message.includes("password")) {
        setErrors({ password: err.message });
      } else {
        setErrors({ general: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div
        aria-hidden
        className="fixed inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url('/login-hero-bg.jpg')` }}
      />
      <div className="fixed inset-0 bg-black/50" aria-hidden />

      {/* Spinner */}
      {loading && <Spinner color="green" size="70" />}

      <div className="relative w-full max-w-md mx-4 py-16">
        <div className="bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-3xl font-semibold text-center mb-8">Login</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative border-b border-white/40 pb-3">
              <input
                name="identifier"
                type="text"
                value={formData.identifier}
                onChange={handleChange}
                placeholder=" "
                required
                className="peer w-full bg-transparent border-none outline-none text-white text-base pt-5 pb-2 placeholder-transparent"
              />
              <label className="absolute left-0 text-gray-200 transition-all pointer-events-none
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                peer-focus:top-0 peer-focus:-translate-y-3 peer-focus:text-sm peer-focus:text-white
                top-0 -translate-y-3 text-sm">
                Email or Username
              </label>
              {errors.identifier && (
                <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>
              )}
            </div>

            <div className="relative border-b border-white/40 pb-3">
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                required
                className="peer w-full bg-transparent border-none outline-none text-white text-base pt-5 pb-2 placeholder-transparent"
              />
              <label className="absolute left-0 text-gray-200 transition-all pointer-events-none
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                peer-focus:top-0 peer-focus:-translate-y-3 peer-focus:text-sm peer-focus:text-white
                top-0 -translate-y-3 text-sm">
                Password
              </label>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-end text-sm mt-2">
              <Link to="/forgot-password" className="text-white hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full border border-white text-white py-2 rounded-md font-medium bg-transparent hover:bg-white hover:text-gray-900 transition duration-300"
            >
              Log In
            </button>

            <div className="text-center mt-4 text-sm text-gray-200">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-white font-semibold hover:underline">
                Sign up
              </Link>
            </div>

            {errors.general && (
              <p className="text-red-500 text-sm mt-2">{errors.general}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
