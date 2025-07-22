import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signupUser } from "../../api/publicApi/auth";
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Camera,
  Upload,
} from "react-feather";

const avatarOptions = [
  // "https://i.pravatar.cc/150?img=1",
  // "https://i.pravatar.cc/150?img=5",
  // "https://i.pravatar.cc/150?img=11",
  // "https://i.pravatar.cc/150?img=15",
  // "https://i.pravatar.cc/150?img=20",
  // "https://i.pravatar.cc/150?img=25",
  // "https://i.pravatar.cc/150?img=30",
  // "https://i.pravatar.cc/150?img=35",
  // Game/anime character options
  "https://i.pravatar.cc/150?img=45", // Anime girl 1
  "https://i.pravatar.cc/150?img=50", // Anime boy 1
  "https://i.pravatar.cc/150?img=55", // Anime girl 2
  "https://i.pravatar.cc/150?img=60", // Anime boy 2
  "https://i.pravatar.cc/150?img=65", // Game character 1
  "https://i.pravatar.cc/150?img=70", // Game character 2
];

export default function Signup() {
  const [credentials, setCredentials] = useState({
    email: "",
    name: "",
    phoneNumber: "",
    password: "",
    address: "",
    avatar: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await signupUser(credentials);
      if (response.success) {
        navigate("/login");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!credentials.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (credentials.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!credentials.avatar) {
      setError("Please select a profile picture");
      return false;
    }
    return true;
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      placeholder: "Address",
      icon: <MapPin size={18} className="text-orange-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4 py-10">
      {/* Decorative elements */}
      <div className="hidden lg:block absolute top-0 left-0 w-1/3 h-full overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/2 -left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-20 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="hidden lg:flex w-1/2 items-center justify-center">
        <div className="max-w-md p-8">
          <img
            src="https://illustrations.popsy.co/amber/food-delivery.svg"
            alt="Signup illustration"
            className="w-full h-auto"
          />
          <h3 className="text-2xl font-bold text-orange-800 mt-6">
            Join Our Food Community
          </h3>
          <p className="text-orange-600 mt-2">
            Discover amazing food experiences and connect with fellow food
            lovers.
          </p>
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden z-10 my-8">
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Create Your Account
            </h2>
            <p className="text-gray-600 mt-2">Join our food-loving community</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar section moved to top */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">
                Profile Picture
              </h3>

              <div className="flex flex-col items-center">
                {/* Selected avatar preview */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-orange-200 flex items-center justify-center">
                    {credentials.avatar ? (
                      <img
                        src={credentials.avatar}
                        alt="Selected profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={40} className="text-gray-400" />
                    )}
                  </div>
                  {credentials.avatar && (
                    <button
                      type="button"
                      onClick={() =>
                        setCredentials({ ...credentials, avatar: "" })
                      }
                      className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-md hover:bg-orange-50">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Avatar selection options */}
                <div className="w-full">
                  <button
                    type="button"
                    onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors">
                    <Camera size={16} />
                    <span>
                      {credentials.avatar ? "Change Avatar" : "Choose Avatar"}
                    </span>
                  </button>

                  {showAvatarOptions && (
                    <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                      <h4 className="text-xs font-medium text-orange-800 mb-3 text-center">
                        Select from our options
                      </h4>
                      <div className="grid grid-cols-4 gap-3">
                        {avatarOptions.map((avatar, idx) => (
                          <div
                            key={idx}
                            className={`relative rounded-full overflow-hidden cursor-pointer transition-all duration-200 ${
                              credentials.avatar === avatar
                                ? "ring-2 ring-orange-500 ring-offset-2"
                                : "hover:ring-2 hover:ring-orange-300"
                            }`}
                            onClick={() => {
                              setCredentials({ ...credentials, avatar });
                              setShowAvatarOptions(false);
                            }}>
                            <img
                              src={avatar}
                              alt={`Avatar ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-orange-200">
                        <label className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-white hover:bg-gray-50 text-orange-600 rounded-lg transition-colors text-sm cursor-pointer">
                          <Upload size={14} />
                          <span>Upload your own</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setCredentials({
                                    ...credentials,
                                    avatar: event.target.result,
                                  });
                                  setShowAvatarOptions(false);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-5">
              {inputFields.map((field, idx) => (
                <div className="relative" key={idx}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {field.icon}
                  </div>
                  <input
                    {...field}
                    value={credentials[field.name]}
                    onChange={onChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 outline-none"
                  />
                  {field.name === "password" && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}>
                      {showPassword ? (
                        <EyeOff
                          size={18}
                          className="text-gray-400 hover:text-orange-500"
                        />
                      ) : (
                        <Eye
                          size={18}
                          className="text-gray-400 hover:text-orange-500"
                        />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg">
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
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="font-medium text-orange-600 hover:text-orange-500">
              Login
            </NavLink>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
