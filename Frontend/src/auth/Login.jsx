import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { login as apiLogin } from "../services/authApi";
import { getApiBase } from "../lib/apiClient";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    // Read from the form DOM so browser autofill still works when React state is empty
    const form = e.currentTarget;
    const emailField = form.elements.namedItem("email");
    const passwordField = form.elements.namedItem("password");
    const emailVal =
      emailField && "value" in emailField ? String(emailField.value).trim() : email.trim();
    const passwordVal =
      passwordField && "value" in passwordField ? String(passwordField.value) : password;
    setEmail(emailVal);
    setPassword(passwordVal);

    if (!emailVal || !passwordVal) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiLogin(emailVal, passwordVal);
      if (!data?.token) {
        setError("Invalid response from server.");
        return;
      }
      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      const role = data.user?.role;
      if (role === "member") {
        navigate("/portal");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.message || "Sign-in failed. Check API URL and that MongoDB is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <div className="relative hidden w-3/5 flex-col justify-end overflow-hidden bg-brand p-16 lg:flex">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-darker to-transparent" />
      <img
  src="/syada-team.png"
  className="absolute inset-0 h-full w-full "
  alt="SYADA Team"
/>

        <div className="relative z-20 max-w-xl">
        
          <p className="mb-10 text-lg leading-relaxed text-green-50/80">
            Staff use the admin dashboard; members use the member area. Same login page for both.
          </p>
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-12 bg-green-200/30" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-green-200/50">Secured with JWT</span>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center p-8 md:p-16 lg:w-2/5">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
              <span className="text-xl font-black italic text-[#E67E22]">SYADA SIGN IN</span>
            </div>
            <h2 className="mb-2 text-3xl font-black text-gray-900">Welcome back</h2>
            <p className="text-sm font-medium text-gray-400">Use the email and password for your account.</p>
            <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
              Default staff (fresh DB): <span className="font-mono text-gray-700">admin@syada.org</span> /{" "}
              <span className="font-mono text-gray-700">123456</span>
              <span className="mt-1 block text-gray-400">Member accounts are created when staff registers a member (email required).</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Email address
              </label>
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-brand">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-brand"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Password</label>
                <span className="text-[10px] font-bold text-gray-300">Forgot? Contact super admin.</span>
              </div>
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-brand">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 py-4 pl-12 pr-12 text-sm outline-none transition-all focus:ring-2 focus:ring-brand"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-sm font-bold text-white shadow-lg shadow-brand-dark/20 transition-all hover:bg-brand-darker disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-10 border-t border-gray-50 pt-10 text-center text-xs text-gray-400">
            API base: <span className="font-mono text-gray-600">{getApiBase()}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
