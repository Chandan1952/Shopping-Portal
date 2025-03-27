import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminBannerImage() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // ✅ Initialize useNavigate

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

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      setMessage("❌ Please select an image to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", image);
  
    try {
      await axios.post("http://localhost:5000/upload", formData, { // ✅ Removed unused `res`
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setMessage("✅ Image uploaded successfully!");
      setImage("");
  
      // ✅ Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setMessage("❌ Upload failed. Please try again.");
    }
  };
  

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Sidebar */}
      <AdminSidebar />

      <div style={{ flex: 1, padding: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Header */}
        <AdminHeader />

        <h2 style={{ marginBottom: "20px", fontSize: "24px", color: "#333" }}>Upload Banner Image</h2>

        <div style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center",
        }}>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: "block", marginBottom: "15px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", width: "100%" }}
          />

          <button 
            onClick={handleUpload} 
            style={{ 
              background: "#007bff", 
              color: "white", 
              padding: "10px 20px", 
              cursor: "pointer", 
              borderRadius: "5px", 
              border: "none",
              width: "100%",
              fontSize: "16px",
              transition: "0.3s"
            }}
            onMouseOver={(e) => e.target.style.background = "#0056b3"}
            onMouseOut={(e) => e.target.style.background = "#007bff"}
          >
            Upload
          </button>

          {message && (
            <p style={{ marginTop: "15px", fontSize: "14px", color: message.includes("failed") ? "red" : "green" }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
