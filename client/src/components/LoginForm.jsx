import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const styles = {
  modalOverlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "1000",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "350px",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
    fontSize: "18px",
    color: "gray",
    background: "none",
    border: "none",
  },
  input: {
    width: "98%",
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "10px",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "red",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    marginTop: "10px",
  },
  link: {
    color: "red",
    cursor: "pointer",
    textAlign: "center",
    display: "block",
    marginTop: "10px",
  },
};

export default function LoginForm({ isOpen, onClose, onSwitch, setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setFormData({ email: "", password: "", rememberMe: false });
      setError(""); // Clear errors when modal opens
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

  try {
    const response = await fetch(
      "https://car-rental-portal-backend.onrender.com/login", // Ensure correct API endpoint
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include", // Ensure cookies are sent for session-based auth
      }
    );

    const text = await response.text();
    console.log("Server response:", text); // Debugging output

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Unexpected response from server. Please try again.");
    }

    if (!response.ok) {
      throw new Error(data.message || "Login failed. Please try again.");
    }

    // Store user token based on "Remember Me"
    if (formData.rememberMe) {
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      sessionStorage.setItem("user", JSON.stringify(data));
    }

    // Call setUser to update the global state if needed
    if (setUser) {
      setUser(data);
    }

    // Close the login modal
    onClose();

    // Redirect user to dashboard
window.location.reload();
  } catch (error) {
    console.error("Login Error:", error.message);
    setError(error.message);
  }
};

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <button style={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Login</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label>Remember Me</label>
          </div>

          <button type="submit" style={styles.loginButton}>
            Login
          </button>

          <Link to="/forget-password" style={styles.link}>
            Forgot Password?
          </Link>
          <span style={styles.link} onClick={onSwitch}>
            Don't have an account? Sign Up
          </span>
        </form>
      </div>
    </div>
  );
}
