import React, { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

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

const AuthModal = ({ isOpen, onClose, setUser }) => {
  const [mode, setMode] = useState("login"); // "login" or "signup"

  if (!isOpen) return null;

  // ✅ Close modal if user clicks outside content
  const handleOverlayClick = (event) => {
    if (event.target.id === "modalOverlay") {
      onClose();
    }
  };

  return (
    <div id="modalOverlay" style={styles.modalOverlay} onClick={handleOverlayClick}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          style={styles.closeButton}
          onClick={onClose}
          aria-label="Close authentication modal"
        >
          ×
        </button>

        {/* Render Forms Based on Mode */}
        {mode === "login" ? (
          <LoginForm
            onClose={onClose}
            onSwitch={() => setMode("signup")} // Switch to Signup
            setUser={setUser} // ✅ Pass setUser to update user state
          />
        ) : (
          <SignupForm
            onClose={onClose}
            onSwitch={() => setMode("login")} // Switch to Login
            setUser={setUser} // ✅ Ensure user is set after signup
          />
        )}
      </div>
    </div>
  );
};

// ✅ Default export
export default AuthModal;
