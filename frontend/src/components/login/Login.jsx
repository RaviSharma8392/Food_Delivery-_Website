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
    <div className="h-screen mt-10 w-full bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-none sm:rounded-xl shadow-lg h-full sm:h-auto sm:my-6 flex flex-col">
        <div className="bg-orange-500 p-6 text-center text-white">
          <h1 className="text-2xl font-bold">Welcome to FoodExpress</h1>
          <p className="opacity-90 mt-1">Sign in to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 mx-4 mt-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-6 flex-1 space-y-5 overflow-y-auto">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
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
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <FiEyeOff className="text-gray-400 hover:text-gray-500" />
                ) : (
                  <FiEye className="text-gray-400 hover:text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orange-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-orange-500 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                isLoading ? "opacity-75" : "hover:bg-orange-600"
              } bg-orange-500`}>
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
                  Processing...
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

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-orange-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
