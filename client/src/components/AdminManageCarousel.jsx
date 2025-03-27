import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminManageCarousel() {
  const [images, setImages] = useState([]);
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
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get("https://shopping-portal-backend.onrender.com/carousel-images");
      setImages(Array.isArray(res.data) ? res.data : res.data.images || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]); // Ensure it's an array
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://shopping-portal-backend.onrender.com/carousel-images/${id}`);
      fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9f9f9" }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        <AdminHeader />

        <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px", color: "#333" }}>
          Manage Banner Images
        </h2>

        {images.length > 0 ? (
          <div style={{ overflowX: "auto", display: "flex", justifyContent: "center",marginLeft:"90px" }}>
            <table style={{ width: "80%", borderCollapse: "collapse", background: "#fff", boxShadow: "0px 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px" }}>
              <thead>
                <tr style={{ background: "#007bff", color: "white", textAlign: "left" }}>
                  <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>Image</th>
                  <th style={{ padding: "12px", border: "1px solid #ddd",textAlign: "center" }}>URL</th>
                  <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {images.map((img) => (
                  <tr key={img._id} style={{ textAlign: "center" }}>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      <img 
                        src={img.url} 
                        alt="Carousel" 
                        style={{ width: "120px", height: "70px", borderRadius: "5px", objectFit: "cover" }} 
                      />
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd", wordBreak: "break-word" }}>
                      <a href={img.url} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>
                        {img.url}
                      </a>
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      <button 
                        onClick={() => handleDelete(img._id)} 
                        style={{ background: "#dc3545", color: "white", padding: "6px 12px", cursor: "pointer", borderRadius: "5px", border: "none" }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>No images found</p>
        )}
      </div>
    </div>
  );
}
