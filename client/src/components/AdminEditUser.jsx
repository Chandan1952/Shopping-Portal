import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    country: "",
    city: "",
  });


   // ✅ Verify Admin Session
      useEffect(() => {
        const verifyAdminSession = async () => {
          try {
            const response = await axios.get("http://localhost:5000/admin-verify", { withCredentials: true });
            if (!response.data.isAdmin) {
              navigate("/admin-login", { replace: true });
            }
          } catch {
            navigate("/admin-login", { replace: true });
          }
        };
    
        verifyAdminSession(); // ✅ Call the function inside useEffect
      }, [navigate]); // ✅ Add navigate as a dependency
    

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get-user/${id}`, { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/update-user/${id}`, user, { withCredentials: true });
      alert("User updated successfully!");
      navigate("/admin-manageusers");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const handleCancel = () => {
    navigate("/admin-manageusers");
  };

  // Inline CSS Styles
  const styles = {
    container: {
      marginLeft: "250px",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
    },
    content: {
      backgroundColor: "#ffffff",
      padding: "20px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      width: "60%",
      margin: "20px auto",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "16px",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "16px",
      height: "80px",
      resize: "none",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "10px",
    },
    saveBtn: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "10px 15px",
      border: "none",
      borderRadius: "5px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "0.3s",
      width: "48%",
    },
    saveBtnHover: {
      backgroundColor: "#0056b3",
    },
    cancelBtn: {
      backgroundColor: "#dc3545",
      color: "white",
      padding: "10px 15px",
      border: "none",
      borderRadius: "5px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "0.3s",
      width: "48%",
    },
    cancelBtnHover: {
      backgroundColor: "#b02a37",
    },
  };

  return (
    <div style={styles.container}>
      <AdminHeader />
      <div className="main-container">
        <AdminSidebar />
        <div style={styles.content}>
          <h2>Edit User</h2>

          <label style={styles.label}>Full Name</label>
          <input type="text" name="fullName" value={user.fullName} onChange={handleChange} style={styles.input} />

          <label style={styles.label}>Email Address</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} style={styles.input} />

          <label style={styles.label}>Phone</label>
          <input type="text" name="phone" value={user.phone} onChange={handleChange} style={styles.input} />

          <label style={styles.label}>Date of Birth</label>
          <input type="date" name="dob" value={user.dob} onChange={handleChange} style={styles.input} />

          <label style={styles.label}>Address</label>
          <textarea name="address" value={user.address} onChange={handleChange} style={styles.textarea}></textarea>

          <label style={styles.label}>Country</label>
          <input type="text" name="country" value={user.country} onChange={handleChange} style={styles.input} />

          <label style={styles.label}>City</label>
          <input type="text" name="city" value={user.city} onChange={handleChange} style={styles.input} />

          <div style={styles.buttonContainer}>
            <button
              style={styles.saveBtn}
              onMouseOver={(e) => (e.target.style.backgroundColor = styles.saveBtnHover.backgroundColor)}
              onMouseOut={(e) => (e.target.style.backgroundColor = styles.saveBtn.backgroundColor)}
              onClick={handleSave}
            >
              Save Changes
            </button>

            <button
              style={styles.cancelBtn}
              onMouseOver={(e) => (e.target.style.backgroundColor = styles.cancelBtnHover.backgroundColor)}
              onMouseOut={(e) => (e.target.style.backgroundColor = styles.cancelBtn.backgroundColor)}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditUser;
