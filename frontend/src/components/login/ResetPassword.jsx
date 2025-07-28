import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiLock, FiCheck, FiArrowLeft } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
  const BASEURL = import.meta.env.VITE_API_BASE_URL;
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validatePassword = (value) => {
    setPasswordRequirements({
      minLength: value.length >= 8,
      hasNumber: /\d/.test(value),
      hasSpecialChar: /[!@#$%^&*]/.test(value),
    });
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Check if password meets all requirements
    if (!Object.values(passwordRequirements).every(Boolean)) {
      toast.error("Password doesn't meet all requirements");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASEURL}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password reset failed");

      toast.success(
        "🎉 Password updated successfully! Redirecting to login..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-orange-500 hover:text-orange-600 mb-4 transition-colors">
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-orange-600 mb-2">
              Reset Your Password
            </h1>
            <p className="text-gray-600">
              Create a new password for your Munchizo account
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className="w-full border border-gray-300 pl-10 pr-3 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCheck className="text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 pl-10 pr-3 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Password requirements */}
            <div className="bg-orange-50 p-3 rounded-lg text-sm">
              <p className="font-medium text-orange-700 mb-2">
                Password Requirements:
              </p>
              <ul className="space-y-1">
                <li
                  className={`flex items-center ${
                    passwordRequirements.minLength
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}>
                  {passwordRequirements.minLength ? (
                    <FiCheck className="mr-2" />
                  ) : (
                    <span className="w-5 mr-2">•</span>
                  )}
                  At least 8 characters
                </li>
                <li
                  className={`flex items-center ${
                    passwordRequirements.hasNumber
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}>
                  {passwordRequirements.hasNumber ? (
                    <FiCheck className="mr-2" />
                  ) : (
                    <span className="w-5 mr-2">•</span>
                  )}
                  Contains a number
                </li>
                <li
                  className={`flex items-center ${
                    passwordRequirements.hasSpecialChar
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}>
                  {passwordRequirements.hasSpecialChar ? (
                    <FiCheck className="mr-2" />
                  ) : (
                    <span className="w-5 mr-2">•</span>
                  )}
                  Contains a special character (!@#$%^&*)
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex justify-center items-center w-full py-3 px-4 rounded-lg text-white font-medium ${
                loading
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              } transition-colors shadow-md`}>
              {loading ? (
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
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Munchizo. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
