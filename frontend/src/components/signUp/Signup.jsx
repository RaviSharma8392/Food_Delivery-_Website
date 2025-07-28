import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, User, Phone, Lock, Eye, EyeOff, MapPin } from "react-feather";

export default function Signup() {
  const [credentials, setCredentials] = useState({
    email: "",
    name: "",
    phoneNumber: "",
    password: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (!credentials.email.includes("@")) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    if (credentials.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("🎉 Account created successfully! Redirecting to login...");

      // Redirect after delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    {
      type: "email",
      name: "email",
      placeholder: "Email Address",
      icon: <Mail size={18} className="text-orange-500" />,
    },
    {
      type: "text",
      name: "name",
      placeholder: "Full Name",
      icon: <User size={18} className="text-orange-500" />,
    },
    {
      type: "tel",
      name: "phoneNumber",
      placeholder: "Phone Number",
      icon: <Phone size={18} className="text-orange-500" />,
      pattern: "[0-9]{10}",
      maxLength: 10,
    },
    {
      type: showPassword ? "text" : "password",
      name: "password",
      placeholder: "Password",
      icon: <Lock size={18} className="text-orange-500" />,
    },
    {
      type: "text",
      name: "address",
      placeholder: "Delivery Address",
      icon: <MapPin size={18} className="text-orange-500" />,
    },
  ];

  return (
    <div className="min-h-screen mt-8 bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">Munchizo</h1>
          <p className="text-gray-600">Bhimtal's favorite food delivery</p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Create Account
            </h2>
            <p className="text-gray-600 mb-6">
              Get your favorite food delivered fast
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {inputFields.map((field, idx) => (
                <div className="relative" key={idx}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {field.icon}
                  </div>
                  <input
                    {...field}
                    value={credentials[field.name]}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        [field.name]: e.target.value,
                      })
                    }
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                  />
                  {field.name === "password" && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white mt-4 ${
                  isLoading
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                } transition-colors`}>
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="font-medium text-orange-600 hover:text-orange-500">
                Log In
              </NavLink>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          By signing up, you agree to our Terms and Privacy Policy
        </div>
      </div>
    </div>
  );
}
