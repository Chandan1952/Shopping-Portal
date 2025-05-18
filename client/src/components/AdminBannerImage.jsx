import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminBannerImage() {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Verify Admin Session
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

    verifyAdminSession();
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setMessage("Please select an image to upload");
      return;
    }
  
    setIsLoading(true);
    setMessage("");
    
    const formData = new FormData();
    formData.append("image", image);
  
    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setMessage("Image uploaded successfully!");
      setImage(null);
      setPreviewImage(null);
  
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setMessage("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <AdminSidebar />

      <div style={styles.mainContent}>
        {/* Header */}
        <AdminHeader />

        <div style={styles.uploadContainer}>
          <h2 style={styles.title}>Upload Banner Image</h2>
          
          <div style={styles.uploadBox}>
            <div 
              style={styles.dropZone}
              onClick={() => fileInputRef.current.click()}
            >
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  style={styles.previewImage}
                />
              ) : (
                <>
                  <svg style={styles.uploadIcon} viewBox="0 0 24 24">
                    <path fill="currentColor" d="M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" />
                  </svg>
                  <p style={styles.dropText}>Click to browse or drag & drop</p>
                  <p style={styles.dropSubtext}>Supports: JPG, PNG, JPEG (Max 5MB)</p>
                </>
              )}
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: "none" }}
            />

            <div style={styles.buttonGroup}>
              {previewImage && (
                <button 
                  onClick={() => {
                    setPreviewImage(null);
                    setImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              )}
              
              <button 
                onClick={handleUpload} 
                disabled={!image || isLoading}
                style={{
                  ...styles.uploadButton,
                  opacity: !image ? 0.6 : 1,
                  cursor: !image ? "not-allowed" : "pointer"
                }}
              >
                {isLoading ? (
                  <span style={styles.spinner}></span>
                ) : "Upload Image"}
              </button>
            </div>

            {message && (
              <p style={{
                ...styles.message,
                color: message.includes("failed") ? "#e74c3c" : "#2ecc71"
              }}>
                {message}
              </p>
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
    minHeight: "100vh",
    background: "#f5f7fa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  mainContent: {
    flex: 1,
    padding: "30px 40px",
    display: "flex",
    flexDirection: "column"
  },
  uploadContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px"
  },
  title: {
    marginBottom: "30px",
    fontSize: "28px",
    color: "#2c3e50",
    fontWeight: "600",
    textAlign: "center"
  },
  uploadBox: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    width: "500px",
    maxWidth: "100%",
    textAlign: "center",
    transition: "all 0.3s ease"
  },
  dropZone: {
    border: "2px dashed #d1d5db",
    borderRadius: "8px",
    padding: "40px 20px",
    marginBottom: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
    ':hover': {
      borderColor: "#3b82f6",
      backgroundColor: "#f0f7ff"
    }
  },
  uploadIcon: {
    width: "60px",
    height: "60px",
    color: "#9ca3af",
    marginBottom: "15px"
  },
  dropText: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#4b5563",
    margin: "5px 0"
  },
  dropSubtext: {
    fontSize: "14px",
    color: "#9ca3af",
    margin: "5px 0"
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "300px",
    borderRadius: "6px",
    objectFit: "contain"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px"
  },
  uploadButton: {
    background: "#3b82f6",
    color: "white",
    padding: "12px 25px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "180px",
    ':hover': {
      background: "#2563eb",
      transform: "translateY(-2px)"
    },
    ':active': {
      transform: "translateY(0)"
    }
  },
  cancelButton: {
    background: "transparent",
    color: "#6b7280",
    padding: "12px 25px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    ':hover': {
      background: "#f3f4f6",
      borderColor: "#9ca3af"
    }
  },
  message: {
    marginTop: "20px",
    fontSize: "15px",
    fontWeight: "500",
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "rgba(46, 204, 113, 0.1)"
  },
  spinner: {
    display: "inline-block",
    width: "20px",
    height: "20px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderRadius: "50%",
    borderTopColor: "#fff",
    animation: "spin 1s ease-in-out infinite",
    marginRight: "10px"
  },
  '@keyframes spin': {
    to: { transform: "rotate(360deg)" }
  }
};