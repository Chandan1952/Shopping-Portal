import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import AdminSidebar from "./AdminSidebar";


const UpdateContactInfo = () => {
  const [contactInfo, setContactInfo] = useState({
    address: "",
    email: "",
    contactNumber: "",
  });
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
  


  useEffect(() => {
    // Fetch current contact details
    fetch("https://shopping-portal-backend.onrender.com/contact-details")
      .then((response) => response.json())
      .then((data) => setContactInfo(data))
      .catch((error) => console.error("Error fetching contact info:", error));
  }, []);

  const handleChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    fetch("https://shopping-portal-backend.onrender.com/update-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactInfo),
    })
      .then((response) => response.json())
      .then((data) => alert("Contact info updated successfully!"))
      .catch((error) => console.error("Error updating contact info:", error));
  };

  return (
    <div style={styles.container}>
      <AdminSidebar />
      <div style={styles.content}>
        <AdminHeader />
        <h2 style={styles.heading}>Update Contact Info</h2>

        <label style={styles.label}>Address</label>
        <input type="text" name="address" value={contactInfo.address} onChange={handleChange} style={styles.input} />

        <label style={styles.label}>Email ID</label>
        <input type="email" name="email" value={contactInfo.email} onChange={handleChange} style={styles.input} />

        <label style={styles.label}>Contact Number</label>
        <input type="text" name="contactNumber" value={contactInfo.phone} onChange={handleChange} style={styles.input} />

        <button style={styles.button} onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
};


const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
    },
    content: {
      flex: 1,
      padding: "20px",
      maxWidth: "600px",
      margin: "auto",
      backgroundColor: "#fff",
      boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      borderRadius: "8px",
      textAlign: "left",
    },
    label: {
      fontWeight: "bold",
      marginBottom: "5px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    button: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "10px 15px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      width: "100%",
    },
    heading: {
      textAlign: "center",
      marginBottom: "20px",
    },
  };

export default UpdateContactInfo;
