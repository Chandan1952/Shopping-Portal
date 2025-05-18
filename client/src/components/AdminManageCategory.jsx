import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminManageCategory() {
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDiscount, setEditedDiscount] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/categories");
      setCategories(res.data);
      setMessage("");
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessage("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
      setMessage("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      setMessage("Failed to delete category");
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category._id);
    setEditedTitle(category.title);
    setEditedDiscount(category.discount);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/categories/${id}`, {
        title: editedTitle,
        discount: editedDiscount,
      });

      setCategories(
        categories.map((cat) =>
          cat._id === id ? { ...cat, title: editedTitle, discount: editedDiscount } : cat
        )
      );

      setEditingCategoryId(null);
      setMessage("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      setMessage("Failed to update category");
    }
  };

  const filteredCategories = categories.filter(category => 
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.discount.toString().includes(searchTerm)
  );

  return (
    <div style={styles.adminContainer}>
      <AdminSidebar />
      <div style={styles.adminContent}>
        <AdminHeader />
        <div style={styles.adminPanel}>
          <div style={styles.headerSection}>
            <h2 style={styles.title}>Manage Categories</h2>
            <button 
              style={styles.addButton}
              onClick={() => navigate('/admin/add-category')}
            >
              + Add New Category
            </button>
          </div>

          {message && (
            <div style={{
              ...styles.alert,
              ...(message.includes("success") ? styles.alertSuccess : styles.alertError
           ) }}>
              {message}
            </div>
          )}

          <div style={styles.controlsContainer}>
            <div style={styles.searchBox}>
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              <span style={styles.searchIcon}>🔍</span>
            </div>
          </div>

          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p>Loading categories...</p>
            </div>
          ) : filteredCategories.length > 0 ? (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.tableTh}>Image</th>
                    <th style={styles.tableTh}>Title</th>
                    <th style={styles.tableTh}>Discount</th>
                    <th style={styles.tableTh}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category._id} style={styles.tableRow}>
                      <td style={styles.tableTd}>
                        <div style={styles.imageContainer}>
                          <img 
                            src={category.img ? `http://localhost:5000${category.img}` : '/placeholder-category.jpg'} 
                            alt={category.title} 
                            style={styles.categoryImage}
                            onError={(e) => {
                              e.target.src = '/placeholder-category.jpg';
                            }}
                          />
                        </div>
                      </td>

                      {editingCategoryId === category._id ? (
                        <>
                          <td style={styles.tableTd}>
                            <input
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              placeholder="Category Title"
                              style={styles.editInput}
                            />
                          </td>
                          <td style={styles.tableTd}>
                            <input
                              type="text"
                              value={editedDiscount}
                              onChange={(e) => setEditedDiscount(e.target.value)}
                              placeholder="Discount %"
                              style={styles.editInput}
                            />
                          </td>
                          <td style={styles.tableTd}>
                            <div style={styles.actionButtons}>
                              <button 
                                onClick={() => handleUpdate(category._id)} 
                                style={styles.saveButton}
                              >
                                Save
                              </button>
                              <button 
                                onClick={() => setEditingCategoryId(null)} 
                                style={styles.cancelButton}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={styles.tableTd}>
                            <span style={styles.categoryTitle}>{category.title}</span>
                          </td>
                          <td style={styles.tableTd}>
                            <span style={styles.discountBadge}>
                              {category.discount}%
                            </span>
                          </td>
                          <td style={styles.tableTd}>
                            <div style={styles.actionButtons}>
                              <button 
                                onClick={() => handleEdit(category)} 
                                style={styles.editButton}
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(category._id)} 
                                style={styles.deleteButton}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIllustration}>
                <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
                  <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"></path>
                  <path d="M9 9h6v6H9z"></path>
                </svg>
              </div>
              <p style={styles.emptyText}>No categories found</p>
              <button 
                style={styles.addButton}
                onClick={() => navigate('/admin/add-category')}
              >
                + Add Your First Category
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
  controlsContainer: {
    marginBottom: "20px"
  },
  searchBox: {
    position: "relative",
    width: "300px",
    maxWidth: "100%"
  },
  searchInput: {
    width: "100%",
    padding: "12px 15px 12px 40px",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.3s ease"
  },
  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#adb5bd"
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
    transition: "all 0.2s ease",
    ':hover': {
      backgroundColor: "rgba(67, 97, 238, 0.05)"
    }
  },
  tableTd: {
    padding: "15px",
    borderBottom: "1px solid #e9ecef",
    verticalAlign: "middle"
  },
  imageContainer: {
    width: "80px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    overflow: "hidden"
  },
  categoryImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "cover"
  },
  categoryTitle: {
    fontWeight: "500",
    color: "#2b2d42"
  },
  discountBadge: {
    display: "inline-block",
    padding: "4px 10px",
    backgroundColor: "#4cc9f0",
    color: "white",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600"
  },
  actionButtons: {
    display: "flex",
    gap: "10px"
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
  saveButton: {
    backgroundColor: "#4cc9f0",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontWeight: "500",
    fontSize: "14px"
  },
  cancelButton: {
    backgroundColor: "#adb5bd",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontWeight: "500",
    fontSize: "14px"
  },
  editInput: {
    padding: "8px 12px",
    border: "1px solid #e9ecef",
    borderRadius: "6px",
    width: "100%",
    maxWidth: "150px",
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