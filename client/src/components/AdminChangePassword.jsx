import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminSession = async () => {
      try {
        const response = await axios.get(`https://shopping-portal-backend.onrender.com/admin-verify`, { withCredentials: true });
        if (!response.data.isAdmin) {
          navigate("/");
        }
      } catch {
        navigate("/");
      }
    };
    verifyAdminSession();
  }, [navigate]);

  const handleUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://shopping-portal-backend.onrender.com/api/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.error || "Password update failed");
      }
    } catch (error) {
      setMessage("Error updating password");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div style={styles.container}>
      <AdminHeader />
      <div style={styles.contentWrapper}>
        <AdminSidebar />
        <div style={styles.mainContent}>
          <div style={styles.card}>
            <h2 style={styles.title}>Update Password</h2>
            <p style={styles.subtitle}>Secure your account with a new password</p>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Current Password</label>
              <div style={styles.passwordInputContainer}>
                <input
                  type={showPassword.old ? "text" : "password"}
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  style={styles.input}
                />
                <button 
                  onClick={() => togglePasswordVisibility('old')}
                  style={styles.eyeButton}
                >
                  {showPassword.old ? (
                    <svg style={styles.eyeIcon} viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
                    </svg>
                  ) : (
                    <svg style={styles.eyeIcon} viewBox="0 0 24 24">
                      <path fill="currentColor" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <div style={styles.passwordInputContainer}>
                <input
                  type={showPassword.new ? "text" : "password"}
                  placeholder="Enter new password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                />
                <button 
                  onClick={() => togglePasswordVisibility('new')}
                  style={styles.eyeButton}
                >
                  {showPassword.new ? (
                    <svg style={styles.eyeIcon} viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
                    </svg>
                  ) : (
                    <svg style={styles.eyeIcon} viewBox="0 0 24 24">
                      <path fill="currentColor" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm New Password</label>
              <div style={styles.passwordInputContainer}>
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                />
                <button 
                  onClick={() => togglePasswordVisibility('confirm')}
                  style={styles.eyeButton}
                >
                  {showPassword.confirm ? (
                    <svg style={styles.eyeIcon} viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
                    </svg>
                  ) : (
                    <svg style={styles.eyeIcon} viewBox="0 0 24 24">
                      <path fill="currentColor" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              onClick={handleUpdate} 
              disabled={isLoading || !oldPassword || !newPassword || !confirmPassword}
              style={{
                ...styles.button,
                opacity: isLoading || !oldPassword || !newPassword || !confirmPassword ? 0.7 : 1,
                cursor: isLoading || !oldPassword || !newPassword || !confirmPassword ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                <div style={styles.spinnerContainer}>
                  <div style={styles.spinner}></div>
                  <span>Updating...</span>
                </div>
              ) : (
                "Update Password"
              )}
            </button>

            {message && (
              <div style={{
                ...styles.message,
                backgroundColor: message.includes("success") ? "#e6ffed" : "#fff0f0",
                color: message.includes("success") ? "#2d8a4a" : "#d73a49"
              }}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif"
  },
  contentWrapper: {
    display: "flex",
    flex: 1,
    marginTop: "60px" // Account for header height
  },
  mainContent: {
    flex: 1,
    padding: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa"
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    backgroundColor: "#ffffff",
    textAlign: "center"
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: "8px"
  },
  subtitle: {
    fontSize: "14px",
    color: "#718096",
    marginBottom: "32px"
  },
  inputGroup: {
    marginBottom: "20px",
    textAlign: "left"
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#4a5568",
    marginBottom: "8px"
  },
  passwordInputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    paddingRight: "40px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#2d3748",
    backgroundColor: "#f8fafc",
    transition: "all 0.2s ease",
    ':focus': {
      outline: "none",
      borderColor: "#3182ce",
      boxShadow: "0 0 0 3px rgba(49, 130, 206, 0.2)"
    }
  },
  eyeButton: {
    position: "absolute",
    right: "10px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  eyeIcon: {
    width: "20px",
    height: "20px",
    color: "#718096"
  },
  button: {
    width: "100%",
    padding: "16px",
    borderRadius: "8px",
    backgroundColor: "#3182ce",
    color: "white",
    border: "none",
    fontSize: "16px",
    fontWeight: "500",
    marginTop: "16px",
    transition: "all 0.2s ease",
    ':hover': {
      backgroundColor: "#2c5282"
    }
  },
  message: {
    padding: "12px 16px",
    borderRadius: "8px",
    marginTop: "20px",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center"
  },
  spinnerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    borderTopColor: "#ffffff",
    animation: "spin 1s ease-in-out infinite"
  },
  '@keyframes spin': {
    to: { transform: "rotate(360deg)" }
  }
};
