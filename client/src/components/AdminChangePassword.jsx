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
    const navigate = useNavigate();
  
    useEffect(() => {
      const verifyAdminSession = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/admin-verify`, { withCredentials: true });
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
      setMessage("New passwords do not match.");
      return;
    }

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
      <AdminHeader />
      <div style={styles.container}>
        <AdminSidebar />
        <div style={styles.contentWrapper}>
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
            <button onClick={handleUpdate} style={styles.button}>
              Update Password
            </button>
            {message && <p style={{ color: "red" }}>{message}</p>}
          </div>
        </div>
      </div>
    </>
  );
}


const styles = {
  container: {
    display: "flex",
  },
  contentWrapper: {
    marginLeft: "220px", // To prevent content from overlapping with the sidebar
    width: "100%",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  },
  mainContent: {
    width: "100%",
    maxWidth: "400px",
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
