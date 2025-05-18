import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminManageCarousel() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
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
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/carousel-images");
      setImages(Array.isArray(res.data) ? res.data : res.data.images || []);
      setMessage("");
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
      setMessage("Failed to load carousel images");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/carousel-images/${id}`);
      setMessage("Image deleted successfully");
      fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      setMessage("Failed to delete image");
    }
  };

  return (
    <div style={styles.adminContainer}>
      <AdminSidebar />

      <div style={styles.adminContent}>
        <AdminHeader />

        <div style={styles.adminPanel}>
          <div style={styles.headerSection}>
            <h2 style={styles.title}>Manage Banner Images</h2>
            <button 
              style={styles.addButton}
              onClick={() => navigate('/admin/add-carousel')}
            >
              + Add New Banner
            </button>
          </div>

          {message && (
            <div style={{
              ...styles.alert,
              ...(message.includes("success") ? styles.alertSuccess : styles.alertError)
            }}>
              {message}
            </div>
          )}

          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p>Loading carousel images...</p>
            </div>
          ) : images.length > 0 ? (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.tableTh}>Preview</th>
                    <th style={styles.tableTh}>Image URL</th>
                    <th style={styles.tableTh}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((img) => (
                    <tr key={img._id} style={styles.tableRow}>
                      <td style={styles.tableTd}>
                        <div style={styles.imageContainer}>
                          <img 
                            src={img.url} 
                            alt="Carousel" 
                            style={styles.image}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150x80?text=Image+Not+Found";
                            }}
                          />
                        </div>
                      </td>
                      <td style={styles.tableTd}>
                        <a 
                          href={img.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={styles.urlLink}
                        >
                          {img.url.length > 50 ? `${img.url.substring(0, 50)}...` : img.url}
                        </a>
                      </td>
                      <td style={styles.tableTd}>
                        <div style={styles.actionButtons}>
                          <button 
                            style={styles.editButton}
                            onClick={() => navigate(`/admin/edit-carousel/${img._id}`)}
                          >
                            Edit
                          </button>
                          <button 
                            style={styles.deleteButton}
                            onClick={() => handleDelete(img._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIllustration}>
                <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
                  <path d="M3 19V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <path d="M8 15l4-4 4 4"></path>
                  <path d="M12 11v8"></path>
                </svg>
              </div>
              <p style={styles.emptyText}>No banner images found</p>
              <button 
                style={styles.addButton}
                onClick={() => navigate('/admin/add-carousel')}
              >
                + Add Your First Banner
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Styles object
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
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
  },
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    flexWrap: "wrap",
    gap: "15px"
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#2b2d42",
    margin: "0"
  },
  addButton: {
    backgroundColor: "#4361ee",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px"
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
  tableContainer: {
    overflowX: "auto",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden"
  },
  tableHeader: {
    backgroundColor: "#4361ee",
    color: "white"
  },
  tableTh: {
    padding: "15px",
    textAlign: "left",
    fontWeight: "600",
    borderBottom: "1px solid #e9ecef"
  },
  tableRow: {
    transition: "all 0.2s ease"
  },
  tableRowHover: {
    backgroundColor: "rgba(67, 97, 238, 0.05)"
  },
  tableTd: {
    padding: "15px",
    borderBottom: "1px solid #e9ecef",
    verticalAlign: "middle"
  },
  imageContainer: {
    width: "120px",
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    overflow: "hidden",
    margin: "0 auto"
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "cover"
  },
  urlLink: {
    color: "#4361ee",
    textDecoration: "none",
    transition: "all 0.2s ease",
    wordBreak: "break-all"
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
    justifyContent: "center"
  },
  editButton: {
    backgroundColor: "#4361ee",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontWeight: "500",
    fontSize: "14px"
  },
  deleteButton: {
    backgroundColor: "#f72585",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontWeight: "500",
    fontSize: "14px"
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    textAlign: "center"
  },
  emptyIllustration: {
    width: "150px",
    height: "150px",
    marginBottom: "20px",
    opacity: "0.7"
  },
  emptyText: {
    fontSize: "18px",
    color: "#6c757d",
    marginBottom: "20px",
    fontWeight: "500"
  },
  '@keyframes spin': {
    to: {
      transform: "rotate(360deg)"
    }
  }
};