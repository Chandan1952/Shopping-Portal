import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // Adjust path if needed
import Footer from "../components/Footer"; // Adjust path if needed

const ResetPassword = () => {
  const [email, setEmail] = useState(""); // Email state
  const [newPassword, setNewPassword] = useState(""); // New password state
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
  const [message, setMessage] = useState(""); // Message state
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    // Get email from query params (if present)
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl); // Set email from the URL
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Check if the passwords match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://shopping-portal-backend.onrender.com/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }), // Send email along with the new password
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      alert("Password reset successfully.")
      setTimeout(() => navigate("/"), 2000); // Redirect to login page after success
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header /> {/* Imported Header Component */}
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2 style={styles.heading}>Reset Password</h2>
          <p style={styles.text}>Enter your new password below.</p>
          {message && (
            <p style={{ textAlign: "center", color: message.includes("successfully") ? "green" : "red" }}>
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="email" value={email} />
            <div style={styles.inputGroup}>
              <label htmlFor="new-password" style={styles.label}>New Password</label>
              <input
                type="password"
                id="new-password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
                placeholder="Enter new password"
                required
                disabled={loading}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="confirm-password" style={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                placeholder="Confirm new password"
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              style={{ ...styles.button, backgroundColor: loading ? "#aaa" : styles.button.backgroundColor }} 
              disabled={loading}
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
      <Footer /> {/* Imported Footer Component */}
    </>
  );
};

// Reusing styles from Forgot Password page
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    backgroundColor: "#f3f4f6",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
  },
  heading: {
    textAlign: "center",
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "1rem",
  },
  text: {
    textAlign: "center",
    color: "#555",
    marginBottom: "1.5rem",
  },
  inputGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  backToLogin: {
    textAlign: "center",
    color: "#555",
    marginTop: "1rem",
  },
  link: {
    color: "#007BFF",
    textDecoration: "none",
  }
};

export default ResetPassword;
