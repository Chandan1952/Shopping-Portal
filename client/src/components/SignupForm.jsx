import React, { useState, useEffect } from "react";
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
    textAlign: "center",
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
  signupButton: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    marginTop: "10px",
    transition: "background 0.3s ease",
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
    color: "red",
    cursor: "pointer",
    marginTop: "10px",
    textDecoration: "none",
    fontSize: "14px",
  },
  label:{
    fontSize: "14px",
  },

  errorMessage: {
    color: "red",
    fontSize: "14px",
    marginTop: "5px",
  },
  successMessage: {
    color: "green",
    fontSize: "14px",
    marginTop: "5px",
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
    setSuccess("");
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      const response = await fetch("https://shopping-portal-backend.onrender.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.mobileNumber,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Signup failed. Please try again.");
      }
  
      setSuccess("User Registration Successful!");
      alert("User Registration Successful!");
  
      // Close signup modal and open login form immediately
      onClose();
      onSwitch();
    } catch (error) {
      setError(error.message);
    }
  };
  

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        {/* Close Button */}
        <button style={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>

        <h2>Sign Up</h2>

        {/* Display Error or Success Message */}
        {error && <p style={styles.errorMessage}>{error}</p>}
        {success && <p style={styles.successMessage}>{success}</p>}

        {/* Signup Form */}
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

          {/* Checkbox */}
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <label style={styles.label} >
              I agree with{" "}
              <span style={styles.link}>Terms and Conditions</span>
            </label>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            style={{
              ...styles.signupButton,
              ...(formData.agreeToTerms
                ? styles.signupButtonEnabled
                : styles.signupButtonDisabled),
            }}
            disabled={!formData.agreeToTerms} // Button is disabled if checkbox is not checked
          >
            Sign Up
          </button>

          {/* Switch to Login */}
          <span style={styles.link} onClick={onSwitch}>
            Already have an account? Login
          </span>
        </form>
      </div>
    </div>
  );
}
