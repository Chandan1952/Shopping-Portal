import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://shopping-portal-backend.onrender.com";

const AdminHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Logout function
  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/admin-logout`, {}, { withCredentials: true });
      navigate("/admin-login");
    } catch {
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <>
      {/* Fixed Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>Admin Dashboard</div>
        <div>
          <div
            style={styles.profileDropdown}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button style={styles.profileButton}>A</button>
            <div
              style={{
                ...styles.dropdownContent,
                ...(dropdownOpen ? styles.dropdownVisible : {}),
              }}
            >
              <h3 style={styles.dropdownContentText}>Welcome!</h3>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Push content down to prevent overlap */}
      <div style={{ paddingTop: "60px" }}></div>
    </>
  );
};

const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "97%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
    color: "white",
    padding: "13px 20px",
    zIndex: 1000,
  },
  headerLeft: {
    fontSize: "20px",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  profileDropdown: {
    position: "relative",
    display: "inline-block",
  },
  profileButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    fontSize: "18px",
    justifyContent: "center",
    cursor: "pointer",
  },
  dropdownContent: {
    display: "none",
    position: "absolute",
    top: "50px",
    right: "0",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    width: "250px",
    zIndex: 1,
    padding: "15px",
    textAlign: "center",
  },
  dropdownVisible: {
    display: "block",
  },
  dropdownContentText: {
    margin: "10px 0",
    fontSize: "18px",
    color: "#333",
  },
  logoutButton: {
    display: "block",
    padding: "10px",
    backgroundColor: "#c62828",
    color: "white",
    textDecoration: "none",
    border: "none",
    borderRadius: "5px",
    margin: "10px auto",
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "center",
    width: "80%",
  },
};

export default AdminHeader;
