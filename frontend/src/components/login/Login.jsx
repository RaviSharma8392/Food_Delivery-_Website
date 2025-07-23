import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLock, FiMail, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import useUser from "../../context/UserContext";
import { loginUser } from "../../api/publicApi/auth";

export default function Login() {
  const { login } = useUser();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await loginUser(credentials);
      login(data);

      const redirectPath =
        data?.user?.role === "Admin"
          ? "/admin"
          : data?.user?.role === "Kitchen"
          ? "/kitchen"
          : "/User";

      navigate(redirectPath);
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-4">
      {/* Food delivery app background elements */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-[#fc8019] to-[#f8462d] rounded-b-3xl z-0"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#fef0e8] rounded-tl-full z-0"></div>

      {/* Main card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl z-10 overflow-hidden">
        {/* App-branded header */}
        <div className="bg-gradient-to-r from-[#fc8019] to-[#f8462d] p-6 text-center text-white relative">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-white rounded-full opacity-10"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-full opacity-10"></div>
          <h1 className="text-3xl font-bold mb-1">FoodExpress</h1>
          <p className="opacity-90 text-sm">Good food is waiting!</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-6 rounded-lg text-sm flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Email field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
                placeholder="your@email.com"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 transition-all"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={onChange}
                placeholder="••••••••"
                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 transition-all"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <FiEyeOff className="text-gray-500 hover:text-gray-700 transition-colors" />
                ) : (
                  <FiEye className="text-gray-500 hover:text-gray-700 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all ${
                isLoading
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 shadow-md"
              }`}>
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>

        {/* Sign up link */}
        <div className="px-8 pb-8 text-center">
          <p className="text-sm text-gray-600">
            New to FoodExpress?{" "}
            <Link
              to="/signup"
              className="font-medium text-orange-500 hover:text-orange-600 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
