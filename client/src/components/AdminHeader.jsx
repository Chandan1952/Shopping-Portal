import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminHeader = () => {
  const [admin, setAdmin] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); 
  
 // ✅ Verify Admin Session
    useEffect(() => {
      const verifyAdminSession = async () => {
        try {
          const response = await axios.get("https://shopping-portal-backend.onrender.com/admin-verify", { withCredentials: true });
          if (!response.data.isAdmin) {
            navigate("/admin-login", { replace: true });
          }
        } catch {
          navigate("/admin-login", { replace: true });
        }
      };
  
      verifyAdminSession(); // ✅ Call the function inside useEffect
    }, [navigate]); // ✅ Add navigate as a dependency
  



  // Fetch admin details
  useEffect(() => {
    axios
      .get("https://shopping-portal-backend.onrender.com/api/admin", { withCredentials: true })
      .then((response) => setAdmin(response.data))
      .catch((error) => console.error("Error fetching admin details:", error));
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post("https://shopping-portal-backend.onrender.com/admin-logout", {}, { withCredentials: true });
      setAdmin(null);
      alert("Successfully logged out!");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
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
            <button style={styles.profileButton}>
              {admin && admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
            </button>
            <div
              style={{
                ...styles.dropdownContent,
                ...(dropdownOpen ? styles.dropdownVisible : {}),
              }}
            >
              {admin ? (
                <>
                  <h3 style={styles.dropdownContentText}>Hi, {admin.name}!</h3>
                  <p style={styles.dropdownContentParagraph}>{admin.email}</p>
                  <button onClick={handleLogout} style={styles.logoutButton}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <h3 style={styles.dropdownContentText}>Welcome!</h3>
                  <p style={styles.dropdownContentParagraph}>
                    Please <a href="/adminlogin">login</a> to continue.
                  </p>
                </>
              )}
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
    position: "fixed", // ✅ Fixed at the top
    top: 0,
    left: 0,
    width: "97%", // ✅ Full width
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
    color: "white",
    padding: "13px 20px",
    zIndex: 1000, // ✅ Ensures it stays above other elements
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
  dropdownContentParagraph: {
    fontSize: "14px",
    color: "#666",
    margin: "5px 0 15px",
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
