import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
    position: "relative",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    cursor: "pointer",
    fontSize: "20px",
    color: "#555",
    background: "none",
    border: "none",
  },
  input: {
    width: "90%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    gap: "8px",
    fontSize: "14px",
    margin: "10px 0",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#d32f2f",
    color: "white",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
    marginTop: "10px",
    transition: "0.3s",
  },
  link: {
    color: "#d32f2f",
    cursor: "pointer",
    textAlign: "center",
    display: "block",
    marginTop: "12px",
    fontSize: "14px",
    textDecoration: "none",
  },
  errorText: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
};

export default function LoginForm({ isOpen, onClose, onSwitch, setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");

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
    const response = await fetch("https://shopping-portal-backend.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
      credentials: "include",
    });

    const data = await response.json();
    console.log("Response Data:", data); // Debugging step

    if (!response.ok || !data) {
      throw new Error(data?.message || "Login failed. Please try again.");
    }

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    onClose();
    setTimeout(() => window.location.reload(), 500); // Refresh UI after login
  } catch (error) {
    console.error("Login Error:", error);
    setError(error.message); // Ensure setError is called correctly
  }
};

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <button style={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>

        <h2 style={{ marginBottom: "15px", fontSize: "22px" }}>Login</h2>

        {error && <p style={styles.errorText}>{error}</p>}

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

          <button
            type="submit"
            style={styles.loginButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#b71c1c")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#d32f2f")}
          >
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
