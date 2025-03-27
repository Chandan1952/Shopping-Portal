import React, { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import ForgotPassword from "./ForgotPassword";

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
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    width: "350px",
    textAlign: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "transparent",
    color: "gray",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
};

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState("login"); // "login", "signup", "forgotPassword"

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        {/* Close Button */}
        <button style={styles.closeButton} onClick={onClose}>×</button>

        {/* Render Forms Based on Mode */}
        {mode === "login" && (
          <LoginForm
            isOpen={isOpen}
            onClose={onClose}
            onSwitch={() => setMode("signup")} // Switch to Signup
            onForgotPassword={() => setMode("forgotPassword")} // Open Forgot Password
          />
        )}
        {mode === "signup" && (
          <SignupForm
            isOpen={isOpen}
            onClose={onClose}
            onSwitch={() => setMode("login")} // Switch to Login
          />
        )}
        {mode === "forgotPassword" && (
          <ForgotPassword
            isOpen={isOpen}
            onClose={() => setMode("login")} // Return to Login after closing
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
