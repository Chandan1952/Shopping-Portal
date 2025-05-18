import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiCheck, FiArrowLeft } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    specialChar: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, []);

  useEffect(() => {
    // Check password requirements
    setPasswordRequirements({
      length: newPassword.length >= 8,
      number: /\d/.test(newPassword),
      specialChar: /[!@#$%^&*]/.test(newPassword),
    });
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  return (
    <div className="reset-password-page">
      <ToastContainer position="top-center" autoClose={3000} />
      <Header />
      
      <main className="reset-password-container">
        <div className="reset-password-card">
          <div className="card-header">
            <button 
              className="back-button"
              onClick={() => navigate(-1)}
            >
              <FiArrowLeft />
            </button>
            <h1>Reset Your Password</h1>
            <p className="subtext">
              Create a new password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="reset-password-form">
            <input type="hidden" name="email" value={email} />
            
            <div className="input-group">
              <label htmlFor="new-password">New Password</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  id="new-password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                />
              </div>
              <div className="password-requirements">
                <p>Password must contain:</p>
                <ul>
                  <li className={passwordRequirements.length ? "met" : ""}>
                    <FiCheck /> At least 8 characters
                  </li>
                  <li className={passwordRequirements.number ? "met" : ""}>
                    <FiCheck /> At least one number
                  </li>
                  <li className={passwordRequirements.specialChar ? "met" : ""}>
                    <FiCheck /> At least one special character
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  id="confirm-password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading || !allRequirementsMet || newPassword !== confirmPassword}
            >
              {loading ? (
                <span className="button-loader"></span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .reset-password-page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f8fafc;
        }

        .reset-password-container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          padding: 2rem;
        }

        .reset-password-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          padding: 2.5rem;
          width: 100%;
          max-width: 28rem;
          margin: 0 auto;
        }

        .card-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .back-button {
          position: absolute;
          left: 0;
          top: 0;
          background: none;
          border: none;
          color: #64748b;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          color: #334155;
          background-color: #f1f5f9;
        }

        .card-header h1 {
          font-size: 1.75rem;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .subtext {
          color: #64748b;
          margin: 0;
        }

        .reset-password-form {
          margin-top: 2rem;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #475569;
          font-weight: 500;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .input-with-icon input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .input-with-icon input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .password-requirements {
          margin-top: 0.5rem;
          color: #64748b;
          font-size: 0.875rem;
        }

        .password-requirements p {
          margin-bottom: 0.5rem;
        }

        .password-requirements ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .password-requirements li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
          color: #94a3b8;
        }

        .password-requirements li.met {
          color: #10b981;
        }

        .password-requirements svg {
          font-size: 0.75rem;
        }

        .submit-button {
          width: 100%;
          padding: 1rem;
          background-color: #10b981;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 3rem;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #059669;
        }

        .submit-button:disabled {
          background-color: #cbd5e1;
          cursor: not-allowed;
        }

        .button-loader {
          width: 1.5rem;
          height: 1.5rem;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .reset-password-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;