import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminManageBrand = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const navigate = useNavigate();



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
        fetchBrands();
    }, []);

    // Fetch brands from backend
    const fetchBrands = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/brands`);
            if (!response.ok) throw new Error("Failed to fetch brands");
            const data = await response.json();
            setBrands(data);
        } catch (error) {
            setMessage("Failed to fetch brands.");
        }
        setLoading(false);
    };

    // Delete brand
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this brand?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/brands/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setMessage("Brand deleted successfully.");
                fetchBrands(); // Refresh the list after deletion
            } else {
                setMessage("Failed to delete brand.");
            }
        } catch (error) {
            setMessage("Error deleting brand.");
        }
    };

    return (
        <div className="admin-container">
            <AdminSidebar />
            <div className="admin-content">
                <AdminHeader />
                <div className="admin-panel">
                    <h2 className="title">Admin - Manage Brands</h2>

                    {message && <p className="error-message">{message}</p>}

                    <div className="filter-container">
                        <label>Filter by Category:</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="category-select"
                        >
                            <option value="">All Categories</option>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Kids">Kids</option>
                        </select>
                    </div>

                    {loading ? (
                        <p>Loading brands...</p>
                    ) : (
                        <table className="brands-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brands
                                    .filter(
                                        (brand) =>
                                            !selectedCategory ||
                                            brand.category.toLowerCase() === selectedCategory.toLowerCase()
                                    )
                                    .map((brand) => (
                                        <tr key={brand._id}>
                                            <td>
                                                <img
                                                    src={brand.img ? `http://localhost:5000${brand.img}` : "/placeholder.jpg"}
                                                    alt={brand.brand || "Brand Image"}
                                                    className="brand-image"
                                                />
                                            </td>
                                            <td>{brand.category}</td>
                                            <td>
                                                <button className="edit-btn">Edit</button>
                                                <button className="delete-btn" onClick={() => handleDelete(brand._id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Inline CSS */}
            <style>{`
                .admin-container {
                    display: flex;
                    min-height: 100vh;
                    background-color: #f4f4f4;
                }

                .admin-content {
                    flex: 1;
                    padding: 20px;
                }

                .admin-panel {
                    margin-left: 240px;
                }

                .title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 20px;
                }

                .error-message {
                    color: red;
                    font-weight: bold;
                }

                .filter-container {
                    margin-bottom: 10px;
                }

                .category-select {
                    padding: 5px;
                    margin-left: 10px;
                }

                .brands-table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: #fff;
                    border-radius: 8px;
                    overflow: hidden;
                }

                .brands-table th, .brands-table td {
                    padding: 10px;
                    border: 1px solid #ccc;
                    text-align: left;
                }

                .brands-table th {
                    background-color: #ddd;
                }

                .brand-image {
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                    border-radius: 5px;
                }

                .edit-btn, .delete-btn {
                    padding: 5px 10px;
                    border: none;
                    color: white;
                    margin-right: 5px;
                    cursor: pointer;
                }

                .edit-btn {
                    background-color: #007bff;
                }

                .delete-btn {
                    background-color: #dc3545;
                }

                .delete-btn:hover {
                    background-color: #b02a37;
                }
            `}</style>
        </div>
    );
};

export default AdminManageBrand;
