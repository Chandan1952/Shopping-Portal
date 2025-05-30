import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaTimes, FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const LoginForm = ({ isOpen, onClose, onSwitch, setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setFormData({ email: "", password: "", rememberMe: false });
      setError("");
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("https://myntra-clone-api.vercel.app/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      localStorage.setItem("user", JSON.stringify(data));
      onClose();
      navigate("/");
    } catch (error) {
      setError(error.message);
      // Shake animation trigger
      document.getElementById("login-form").classList.add("shake");
      setTimeout(() => {
        document.getElementById("login-form").classList.remove("shake");
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            id="login-form"
            className="modal-content"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>

            <div className="modal-header">
              <h2>Welcome Back</h2>
              <p>Sign in to access your account</p>
            </div>

            {error && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    fill="currentColor"
                    d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="options-row">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <Link to="/forget-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? (
                  <div className="spinner"></div>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="divider">
                <span>or continue with</span>
              </div>

              <div className="social-login">
                <button type="button" className="social-button google">
                  <FaGoogle /> Google
                </button>
                <button type="button" className="social-button facebook">
                  <FaFacebook /> Facebook
                </button>
              </div>

              <div className="switch-auth">
                Don't have an account?{" "}
                <button type="button" onClick={onSwitch}>
                  Create account
                </button>
              </div>
            </form>

            <style jsx>{`
              .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
              }

              .modal-content {
                background-color: white;
                padding: 32px;
                border-radius: 16px;
                width: 100%;
                max-width: 420px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                position: relative;
              }

              .modal-content.shake {
                animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
              }

              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
              }

              .close-button {
                position: absolute;
                top: 16px;
                right: 16px;
                cursor: pointer;
                font-size: 18px;
                color: #64748b;
                background: none;
                border: none;
                padding: 8px;
                border-radius: 50%;
                transition: all 0.2s ease;
              }

              .close-button:hover {
                background-color: #f1f5f9;
                color: #334155;
              }

              .modal-header {
                margin-bottom: 24px;
                text-align: center;
              }

              .modal-header h2 {
                margin: 0;
                color: #1e293b;
                font-size: 24px;
                font-weight: 600;
              }

              .modal-header p {
                margin: 8px 0 0;
                color: #64748b;
                font-size: 14px;
              }

              .error-message {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px;
                background-color: #fee2e2;
                color: #dc2626;
                border-radius: 8px;
                margin-bottom: 16px;
                font-size: 14px;
              }

              .input-group {
                margin-bottom: 16px;
              }

              .input-group label {
                display: block;
                margin-bottom: 8px;
                color: #334155;
                font-size: 14px;
                font-weight: 500;
              }

              .input-group input {
                width:90%;
                padding: 12px 16px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.2s ease;
              }

              .input-group input:focus {
                outline: none;
                border-color: #6366f1;
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
              }

              .password-input {
                position: relative;
              }

              .toggle-password {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: #64748b;
                cursor: pointer;
                padding: 4px;
              }

              .options-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 16px 0 24px;
              }

              .checkbox-container {
                display: flex;
                align-items: center;
                position: relative;
                cursor: pointer;
                user-select: none;
                color: #334155;
                font-size: 14px;
              }

              .checkbox-container input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
                height: 0;
                width: 0;
              }

              .checkmark {
                height: 16px;
                width: 16px;
                background-color: white;
                border: 1px solid #cbd5e1;
                border-radius: 4px;
                margin-right: 8px;
                transition: all 0.2s ease;
              }

              .checkbox-container:hover input ~ .checkmark {
                border-color: #94a3b8;
              }

              .checkbox-container input:checked ~ .checkmark {
                background-color: #6366f1;
                border-color: #6366f1;
              }

              .checkmark:after {
                content: "";
                position: absolute;
                display: none;
              }

              .checkbox-container input:checked ~ .checkmark:after {
                display: block;
              }

              .checkbox-container .checkmark:after {
                left: 5px;
                top: 2px;
                width: 4px;
                height: 8px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
              }

              .forgot-password {
                color: #6366f1;
                font-size: 14px;
                text-decoration: none;
                transition: color 0.2s ease;
              }

              .forgot-password:hover {
                color: #4f46e5;
                text-decoration: underline;
              }

              .login-button {
                width: 100%;
                padding: 12px;
                background-color: #6366f1;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 44px;
              }

              .login-button:hover {
                background-color: #4f46e5;
              }

              .login-button:disabled {
                background-color: #a5b4fc;
                cursor: not-allowed;
              }

              .spinner {
                width: 20px;
                height: 20px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s ease-in-out infinite;
              }

              @keyframes spin {
                to { transform: rotate(360deg); }
              }

              .divider {
                display: flex;
                align-items: center;
                margin: 24px 0;
                color: #64748b;
                font-size: 14px;
              }

              .divider::before,
              .divider::after {
                content: "";
                flex: 1;
                border-bottom: 1px solid #e2e8f0;
              }

              .divider::before {
                margin-right: 16px;
              }

              .divider::after {
                margin-left: 16px;
              }

              .social-login {
                display: flex;
                gap: 12px;
                margin-bottom: 24px;
              }

              .social-button {
                flex: 1;
                padding: 10px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
              }

              .social-button:hover {
                background-color: #f8fafc;
              }

              .social-button.google {
                color: #db4437;
              }

              .social-button.facebook {
                color: #1877f2;
              }

              .switch-auth {
                text-align: center;
                color: #64748b;
                font-size: 14px;
              }

              .switch-auth button {
                background: none;
                border: none;
                color: #6366f1;
                font-weight: 500;
                cursor: pointer;
                padding: 0;
                margin-left: 4px;
              }

              .switch-auth button:hover {
                text-decoration: underline;
              }
            `}</style>
         </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginForm;
