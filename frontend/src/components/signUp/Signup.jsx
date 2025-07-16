import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signupUser } from "../../api/publicApi/auth";
import { Lock, Mail, User, Phone, MapPin, Eye, EyeOff } from "react-feather";
import "./Signup.css";

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
  const [error, setError] = useState("");
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
        navigate("/login"); // redirect after successful signup
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
      icon: <Mail size={18} />,
    },
    {
      type: "text",
      name: "name",
      placeholder: "Full Name",
      icon: <User size={18} />,
    },
    {
      type: "tel",
      name: "phoneNumber",
      placeholder: "Phone Number",
      icon: <Phone size={18} />,
      pattern: "[0-9]{10}",
      maxLength: 10,
    },
    {
      type: showPassword ? "text" : "password",
      name: "password",
      placeholder: "Password",
      icon: <Lock size={18} />,
    },
    {
      type: "text",
      name: "address",
      placeholder: "Address",
      icon: <MapPin size={18} />,
    },
  ];

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h2>Create Your Account</h2>
          <p>Join our community today</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          {inputFields.map((field, idx) => (
            <div className="input-group" key={idx}>
              <label>
                {field.icon}
                <span>{field.placeholder}</span>
              </label>
              <div
                className={`input-wrapper ${
                  field.name === "password" ? "password-input" : ""
                }`}>
                <input
                  {...field}
                  value={credentials[field.name]}
                  onChange={onChange}
                  required
                />
                {field.name === "password" && (
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={togglePasswordVisibility}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : "Sign Up"}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <NavLink to={"/login"}>Login</NavLink>
        </div>
      </div>
    </div>
  );
}
