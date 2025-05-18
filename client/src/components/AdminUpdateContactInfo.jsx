import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

const UpdateContactInfo = () => {
  const [contactInfo, setContactInfo] = useState({
    address: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Verify Admin Session
  useEffect(() => {
    const verifyAdminSession = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin-verify", { 
          withCredentials: true 
        });
        if (!response.data.isAdmin) {
          navigate("/admin-login", { replace: true });
        }
      } catch {
        navigate("/admin-login", { replace: true });
      }
    };
    verifyAdminSession();
  }, [navigate]);

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const fetchContactDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/contact-details");
      const data = await response.json();
      setContactInfo(data);
      setMessage({ text: "", type: "" });
    } catch (error) {
      console.error("Error fetching contact info:", error);
      setMessage({ text: "Failed to load contact details", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch("http://localhost:5000/update-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactInfo),
      });
      
      if (response.ok) {
        setMessage({ text: "Contact info updated successfully!", type: "success" });
        setIsEditing(false);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating contact info:", error);
      setMessage({ text: "Failed to update contact info", type: "error" });
    }
  };

  return (
    <div style={styles.adminContainer}>
      <AdminSidebar />
      <div style={styles.adminContent}>
        <AdminHeader />
        <div style={styles.adminPanel}>
          <div style={styles.headerSection}>
            <h2 style={styles.title}>Update Contact Information</h2>
          </div>

          {message.text && (
            <div style={{
              ...styles.alert,
              ...(message.type === "success" ? styles.alertSuccess : styles.alertError)
            }}>
              {message.text}
            </div>
          )}

          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p>Loading contact details...</p>
            </div>
          ) : (
            <div style={styles.formContainer}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelText}>Address</span>
                  <textarea
                    name="address"
                    value={contactInfo.address}
                    onChange={handleChange}
                    style={styles.textarea}
                    rows="3"
                    placeholder="Enter your business address"
                  />
                </label>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelText}>Email Address</span>
                  <input
                    type="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="contact@yourbusiness.com"
                  />
                </label>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelText}>Phone Number</span>
                  <input
                    type="tel"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="+1 (123) 456-7890"
                  />
                </label>
              </div>

              <div style={styles.buttonGroup}>
                <button 
                  style={styles.cancelButton}
                  onClick={() => {
                    fetchContactDetails();
                    setIsEditing(false);
                  }}
                  disabled={!isEditing}
                >
                  Cancel
                </button>
                <button 
                  style={styles.submitButton}
                  onClick={handleUpdate}
                  disabled={!isEditing}
                >
                  Update Contact Info
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  adminContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  adminContent: {
    flex: 1,
    padding: "20px 30px",
    marginLeft: "250px"
  },
  adminPanel: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    maxWidth: "800px",
    margin: "0 auto"
  },
  headerSection: {
    marginBottom: "25px",
    borderBottom: "1px solid #e9ecef",
    paddingBottom: "15px"
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#2b2d42",
    margin: "0"
  },
  alert: {
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontWeight: "500"
  },
  alertSuccess: {
    backgroundColor: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb"
  },
  alertError: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 0"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(67, 97, 238, 0.2)",
    borderRadius: "50%",
    borderTopColor: "#4361ee",
    animation: "spin 1s ease-in-out infinite",
    marginBottom: "15px"
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  labelText: {
    fontWeight: "500",
    color: "#495057",
    fontSize: "14px"
  },
  input: {
    padding: "12px 15px",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "15px",
    transition: "all 0.3s ease",
    ":focus": {
      outline: "none",
      borderColor: "#4361ee",
      boxShadow: "0 0 0 2px rgba(67, 97, 238, 0.2)"
    }
  },
  textarea: {
    padding: "12px 15px",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "15px",
    transition: "all 0.3s ease",
    resize: "vertical",
    minHeight: "100px",
    ":focus": {
      outline: "none",
      borderColor: "#4361ee",
      boxShadow: "0 0 0 2px rgba(67, 97, 238, 0.2)"
    }
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    justifyContent: "flex-end",
    marginTop: "20px"
  },
  submitButton: {
    backgroundColor: "#4361ee",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "15px",
    ":hover": {
      backgroundColor: "#3a56d4",
      transform: "translateY(-2px)"
    },
    ":disabled": {
      backgroundColor: "#adb5bd",
      cursor: "not-allowed",
      transform: "none"
    }
  },
  cancelButton: {
    backgroundColor: "transparent",
    color: "#6c757d",
    border: "1px solid #6c757d",
    padding: "12px 25px",
    borderRadius: "8px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "15px",
    ":hover": {
      backgroundColor: "#f8f9fa"
    },
    ":disabled": {
      opacity: "0.5",
      cursor: "not-allowed"
    }
  },
  '@keyframes spin': {
    to: {
      transform: "rotate(360deg)"
    }
  }
};

export default UpdateContactInfo;