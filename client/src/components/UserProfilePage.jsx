import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import UserSidebar from "../components/UserSidebar";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("https://shopping-portal-backend.onrender.com/api/auth/check", { credentials: "include" })
      .catch(() => console.error("Authentication check failed"));
  }, []);

  useEffect(() => {
    fetch("https://shopping-portal-backend.onrender.com/api/user", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://shopping-portal-backend.onrender.com/update-users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      const data = await response.json();
      alert("Profile updated successfully!");
      setUser(data);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "calc(100vh - 160px)",
      maxWidth: "1400px",
      margin: "40px auto",
      gap: "30px",
      padding: "0 5%",
    },
    sidebar: {
      flex: "0 0 280px",
    },
    mainContent: {
      flex: "1",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
      padding: "40px",
      transition: "transform 0.3s ease",
      ":hover": {
        transform: "translateY(-3px)",
      },
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      paddingBottom: "20px",
      borderBottom: "1px solid #eee",
    },
    title: {
      fontSize: "28px",
      fontWeight: "600",
      color: "#2c3e50",
      margin: "0",
      position: "relative",
      ":after": {
        content: '""',
        display: "block",
        width: "50px",
        height: "4px",
        background: "linear-gradient(to right, #3498db, #9b59b6)",
        marginTop: "10px",
        borderRadius: "2px",
      },
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "25px",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      fontSize: "15px",
      transition: "all 0.3s",
      backgroundColor: isEditing ? "#fff" : "#f9f9f9",
      ":focus": {
        borderColor: "#3498db",
        boxShadow: "0 0 0 3px rgba(52, 152, 219, 0.2)",
        outline: "none",
      },
      ":disabled": {
        backgroundColor: "#f0f0f0",
        color: "#777",
      },
    },
    textarea: {
      height: "100px",
      resize: "vertical",
    },
    buttonGroup: {
      display: "flex",
      gap: "15px",
      marginTop: "30px",
      gridColumn: "1 / -1",
    },
    button: {
      padding: "12px 25px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "none",
    },
    saveButton: {
      background: "linear-gradient(to right, #3498db, #9b59b6)",
      color: "white",
      ":hover": {
        background: "linear-gradient(to right, #2980b9, #8e44ad)",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      },
    },
    editButton: {
      background: "#f0f0f0",
      color: "#333",
      ":hover": {
        background: "#e0e0e0",
      },
    },
    cancelButton: {
      background: "transparent",
      color: "#e74c3c",
      border: "1px solid #e74c3c",
      ":hover": {
        background: "#fdeaea",
      },
    },
    error: {
      color: "#e74c3c",
      backgroundColor: "#fdeaea",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "20px",
      gridColumn: "1 / -1",
    },
    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      fontSize: "18px",
      color: "#7f8c8d",
    },
  };

  if (loading) return <div style={styles.loading}>Loading profile...</div>;
  if (!user) return <div style={styles.loading}>Error loading profile.</div>;

  return (
    <>
      <Header />
      <div style={styles.container}>
        <div style={styles.sidebar}>
          <UserSidebar />
        </div>
        
        <div style={styles.mainContent}>
          <div style={styles.header}>
            <h2 style={styles.title}>Profile Settings</h2>
            {!isEditing ? (
              <button 
                style={{ ...styles.button, ...styles.editButton }}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <button 
                style={{ ...styles.button, ...styles.cancelButton }}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            )}
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="fullName"
                style={styles.input}
                value={user.fullName || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                style={styles.input}
                value={user.email || ""}
                disabled
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="text"
                name="phone"
                style={styles.input}
                value={user.phone || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Date of Birth</label>
              <input
                type="date"
                name="dob"
                style={styles.input}
                value={user.dob || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Your Address</label>
              <textarea
                name="address"
                style={{ ...styles.input, ...styles.textarea }}
                value={user.address || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Country</label>
              <input
                type="text"
                name="country"
                style={styles.input}
                value={user.country || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>City</label>
              <input
                type="text"
                name="city"
                style={styles.input}
                value={user.city || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <div style={styles.buttonGroup}>
                <button
                  style={{ ...styles.button, ...styles.saveButton }}
                  onClick={handleSave}
                >
                  Save Changes
                </button>
                <button
                  style={{ ...styles.button, ...styles.cancelButton }}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfilePage;
