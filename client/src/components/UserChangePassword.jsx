import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import UserSidebar from "../components/UserSidebar"; // Import UserSidebar

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: "24px",
    padding: "0 16px",
    maxWidth: "1200px",
    marginLeft: "auto",
    marginRight: "auto",
    gap: "20px",
  },
  mainContent: {
    flex: "1",
    minWidth: "300px",
    maxWidth: "500px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
    textAlign: "center",
    backgroundColor: "white",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "black",
    color: "white",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
  },
};

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://shopping-portal-backend.onrender.com/api/auth/check", { credentials: "include" })
        .catch(() => console.error("Authentication check failed"));
}, []);


  const handleUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch("https://shopping-portal-backend.onrender.com/api/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        // setMessage("Password updated successfully!");
        alert("Password updated successfully!");

      // Reset fields after successful update
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.error || "Password update failed.");
      }
    } catch (error) {
      setMessage("Error updating password.");
    }
  };

  return (
    <>
      <Header />
      <div style={styles.container}>
        {/* Sidebar Component */}
        <UserSidebar />

        {/* Main Content */}
        <div style={styles.mainContent}>
          <h2>Update Password</h2>
          <input
            type="password"
            placeholder="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleUpdate} style={styles.button}>Update Password</button>
          {message && <p>{message}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
}
