import React, { useState, useEffect } from "react";
import {  Link } from "react-router-dom"; // ✅ Import useNavigate
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
    fontSize:"17px"
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
    const response = await fetch(
      "https://shopping-portal-backend.onrender.com/user-login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log("Login Response:", data); // ✅ Debugging API response

    if (!response.ok) {
      throw new Error(data.message || "Login failed. Please try again.");
    }

    if (!data.token) {
      throw new Error("No token received. Login may have failed.");
    }

    // ✅ Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(data));

    // ✅ Close the login modal
    onClose();

    // ✅ Reload to update auth state
    window.location.reload();
  } catch (error) {
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

          <button type="submit" style={styles.loginButton}>Login</button>

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
