import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import UserSidebar from "../components/UserSidebar";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/check", { credentials: "include" })
      .catch(() => console.error("Authentication check failed"));
  }, []);

  const handleUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage("");
      } else {
        setMessage(data.error || "Password update failed. Please try again.");
      }
    } catch (error) {
      setMessage("Error updating password. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "calc(100vh - 160px)",
      padding: "40px 5%",
      maxWidth: "1400px",
      margin: "0 auto",
      gap: "30px",
      backgroundColor: "#f8f9fa",
    },
    sidebar: {
      flex: "0 0 250px",
    },
    mainContent: {
      flex: "1",
      maxWidth: "500px",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
      backgroundColor: "white",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      ":hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.12)",
      },
    },
    title: {
      fontSize: "28px",
      fontWeight: "600",
      color: "#2c3e50",
      marginBottom: "30px",
      textAlign: "center",
      position: "relative",
      ":after": {
        content: '""',
        display: "block",
        width: "60px",
        height: "4px",
        background: "linear-gradient(to right, #3498db, #9b59b6)",
        margin: "10px auto 0",
        borderRadius: "2px",
      },
    },
    inputContainer: {
      marginBottom: "20px",
      position: "relative",
    },
    input: {
      width: "80%",
      padding: "14px 16px 14px 45px",
      margin: "8px 0",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
      fontSize: "16px",
      transition: "all 0.3s",
      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
      ":focus": {
        borderColor: "#3498db",
        boxShadow: "0 0 0 3px rgba(52, 152, 219, 0.2)",
        outline: "none",
      },
    },
    inputIcon: {
      position: "absolute",
      left: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#7f8c8d",
    },
    button: {
      width: "100%",
      padding: "14px",
      borderRadius: "8px",
      background: "linear-gradient(to right, #3498db, #9b59b6)",
      color: "white",
      cursor: "pointer",
      border: "none",
      fontSize: "16px",
      fontWeight: "600",
      marginTop: "10px",
      transition: "all 0.3s ease, transform 0.2s ease",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      ":hover": {
        background: "linear-gradient(to right, #2980b9, #8e44ad)",
        transform: "translateY(-2px)",
        boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
      },
      ":active": {
        transform: "translateY(0)",
      },
      ":disabled": {
        background: "#bdc3c7",
        cursor: "not-allowed",
        transform: "none",
      },
    },
    message: {
      marginTop: "20px",
      padding: "12px",
      borderRadius: "6px",
      textAlign: "center",
      fontSize: "14px",
      backgroundColor: message && message.includes("success") ? "#d4edda" : "#f8d7da",
      color: message && message.includes("success") ? "#155724" : "#721c24",
      border: message && message.includes("success") ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
      transition: "all 0.3s ease",
    },
    passwordRules: {
      margin: "15px 0",
      padding: "15px",
      backgroundColor: "#f0f8ff",
      borderRadius: "8px",
      fontSize: "14px",
      color: "#34495e",
    },
    rule: {
      display: "flex",
      alignItems: "center",
      margin: "5px 0",
    },
    ruleIcon: {
      marginRight: "8px",
      color: "#3498db",
    },
  };

  return (
    <>
      <Header />
      <div style={styles.container}>
        <div style={styles.sidebar}>
          <UserSidebar />
        </div>
        
        <div style={styles.mainContent}>
          <h2 style={styles.title}>Update Password</h2>
          
          <div style={styles.passwordRules}>
            <p style={{ marginTop: 0, fontWeight: "600" }}>Password requirements:</p>
            <div style={styles.rule}>
              <span style={styles.ruleIcon}>✓</span>
              <span>Minimum 8 characters</span>
            </div>
            <div style={styles.rule}>
              <span style={styles.ruleIcon}>✓</span>
              <span>At least one uppercase letter</span>
            </div>
            <div style={styles.rule}>
              <span style={styles.ruleIcon}>✓</span>
              <span>At least one number or special character</span>
            </div>
          </div>
          
          <div style={styles.inputContainer}>
            <span style={styles.inputIcon}>🔒</span>
            <input
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputContainer}>
            <span style={styles.inputIcon}>🆕</span>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputContainer}>
            <span style={styles.inputIcon}>✅</span>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
          </div>
          
          <button 
            onClick={handleUpdate} 
            style={styles.button}
            disabled={isLoading || !oldPassword || !newPassword || !confirmPassword}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
          
          {message && <div style={styles.message}>{message}</div>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdatePassword;