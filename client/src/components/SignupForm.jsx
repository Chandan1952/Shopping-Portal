import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

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
    maxWidth: "400px",
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
    margin: "8px 0",
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
  signupButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    marginTop: "12px",
    transition: "0.3s",
  },
  signupButtonDisabled: {
    backgroundColor: "gray",
    color: "white",
    cursor: "not-allowed",
  },
  signupButtonEnabled: {
    backgroundColor: "green",
    color: "white",
    cursor: "pointer",
  },
  link: {
    color: "#d32f2f",
    cursor: "pointer",
    textAlign: "center",
    marginTop: "12px",
    fontSize: "14px",
    textDecoration: "none",
  },
  errorMessage: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  successMessage: {
    color: "green",
    fontSize: "14px",
    marginBottom: "10px",
  },
};

export default function SignupForm({ isOpen, onClose, onSwitch }) {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: "",
        mobileNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      });
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target.id === "modalOverlay") {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await axios.post(
        "https://shopping-portal-backend.onrender.com/submit",
        {
          fullName: formData.fullName,
          phone: formData.mobileNumber,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess("User Registration Successful!");
      alert("User Registration Successful!");
      // localStorage.setItem("user", JSON.stringify(response.data.user));

      onClose();
      onSwitch();
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div id="modalOverlay" style={styles.modalOverlay} onClick={handleOverlayClick}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose} aria-label="Close signup modal">
          <FaTimes />
        </button>

        <h2 style={{ marginBottom: "15px", fontSize: "22px" }}>Sign Up</h2>

        {error && <p style={styles.errorMessage}>{error}</p>}
        {success && <p style={styles.successMessage}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="tel"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            style={styles.input}
            required
          />
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <label>
              I agree with <span style={styles.link}>Terms and Conditions</span>
            </label>
          </div>

          <button
            type="submit"
            style={{
              ...styles.signupButton,
              ...(formData.agreeToTerms
                ? styles.signupButtonEnabled
                : styles.signupButtonDisabled),
            }}
            disabled={!formData.agreeToTerms}
          >
            Sign Up
          </button>

          <span style={styles.link} onClick={onSwitch}>
            Already have an account? Login
          </span>
        </form>
      </div>
    </div>
  );
}
