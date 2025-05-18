import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminManageBrand = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // Verify Admin Session
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
        verifyAdminSession();
    }, [navigate]);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://shopping-portal-backend.onrender.com/api/brands`);
            if (!response.ok) throw new Error("Failed to fetch brands");
            const data = await response.json();
            setBrands(data);
        } catch (error) {
            setMessage("Failed to fetch brands.");
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this brand?")) return;

        try {
            const response = await fetch(`https://shopping-portal-backend.onrender.com/api/brands/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setMessage("Brand deleted successfully.");
                fetchBrands();
            } else {
                setMessage("Failed to delete brand.");
            }
        } catch (error) {
            setMessage("Error deleting brand.");
        }
    };

    const filteredBrands = brands.filter(brand => {
        const matchesCategory = !selectedCategory || 
            brand.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = brand.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            brand.category?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="admin-container">
            <AdminSidebar />
            <div className="admin-content">
                <AdminHeader />
                <div className="admin-panel">
                    <div className="header-section">
                        <h2 className="title">Manage Brands</h2>
                        <button 
                            className="add-brand-btn"
                            onClick={() => navigate('/admin/add-brand')}
                        >
                            + Add New Brand
                        </button>
                    </div>

                    {message && (
                        <div className={`alert ${message.includes("success") ? "success" : "error"}`}>
                            {message}
                        </div>
                    )}

                    <div className="controls-container">
                        <div className="search-filter-container">
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Search brands..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="search-icon">🔍</span>
                            </div>
                            
                            <div className="filter-box">
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
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading brands...</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            {filteredBrands.length > 0 ? (
                                <table className="brands-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Brand</th>
                                            <th>Category</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBrands.map((brand) => (
                                            <tr key={brand._id}>
                                                <td>
                                                    <div className="image-container">
                                                        <img
                                                            src={brand.img ? `https://shopping-portal-backend.onrender.com${brand.img}` : "/placeholder.jpg"}
                                                            alt={brand.brand || "Brand Image"}
                                                            className="brand-image"
                                                        />
                                                    </div>
                                                </td>
                                                <td>{brand.brand || "N/A"}</td>
                                                <td>
                                                    <span className={`category-tag ${brand.category?.toLowerCase()}`}>
                                                        {brand.category}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button 
                                                            className="edit-btn"
                                                            onClick={() => navigate(`/admin/edit-brand/${brand._id}`)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            className="delete-btn" 
                                                            onClick={() => handleDelete(brand._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="no-results">
                                    <img src="/no-results.svg" alt="No brands found" />
                                    <p>No brands found matching your criteria</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Inline CSS */}
            <style>{`
                :root {
                    --primary-color: #4361ee;
                    --primary-hover: #3a56d4;
                    --danger-color: #f72585;
                    --danger-hover: #e5177b;
                    --success-color: #4cc9f0;
                    --text-color: #2b2d42;
                    --light-gray: #f8f9fa;
                    --medium-gray: #e9ecef;
                    --dark-gray: #adb5bd;
                    --border-radius: 8px;
                    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    --transition: all 0.3s ease;
                }

                .admin-container {
                    display: flex;
                    min-height: 100vh;
                    background-color: var(--light-gray);
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .admin-content {
                    flex: 1;
                    padding: 20px 30px;
                    margin-left: 250px;
                }

                .admin-panel {
                    background: white;
                    border-radius: var(--border-radius);
                    padding: 25px;
                    box-shadow: var(--box-shadow);
                }

                .header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                }

                .title {
                    font-size: 1.8rem;
                    font-weight: 600;
                    color: var(--text-color);
                    margin: 0;
                }

                .add-brand-btn {
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: var(--border-radius);
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .add-brand-btn:hover {
                    background-color: var(--primary-hover);
                    transform: translateY(-2px);
                }

                .alert {
                    padding: 12px 15px;
                    border-radius: var(--border-radius);
                    margin-bottom: 20px;
                    font-weight: 500;
                }

                .alert.success {
                    background-color: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }

                .alert.error {
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }

                .controls-container {
                    margin-bottom: 25px;
                }

                .search-filter-container {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .search-box {
                    position: relative;
                    flex: 1;
                }

                .search-box input {
                    width: 100%;
                    padding: 12px 15px 12px 40px;
                    border: 1px solid var(--medium-gray);
                    border-radius: var(--border-radius);
                    font-size: 14px;
                    transition: var(--transition);
                }

                .search-box input:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
                }

                .search-icon {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--dark-gray);
                }

                .filter-box {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .filter-box label {
                    font-weight: 500;
                    color: var(--text-color);
                }

                .category-select {
                    padding: 12px 15px;
                    border: 1px solid var(--medium-gray);
                    border-radius: var(--border-radius);
                    background-color: white;
                    font-size: 14px;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .category-select:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 0;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(67, 97, 238, 0.2);
                    border-radius: 50%;
                    border-top-color: var(--primary-color);
                    animation: spin 1s ease-in-out infinite;
                    margin-bottom: 15px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .table-container {
                    overflow-x: auto;
                }

                .brands-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    background-color: white;
                    border-radius: var(--border-radius);
                    overflow: hidden;
                    box-shadow: var(--box-shadow);
                }

                .brands-table th {
                    background-color: var(--primary-color);
                    color: white;
                    padding: 15px;
                    text-align: left;
                    font-weight: 600;
                }

                .brands-table td {
                    padding: 15px;
                    border-bottom: 1px solid var(--medium-gray);
                    vertical-align: middle;
                }

                .brands-table tr:last-child td {
                    border-bottom: none;
                }

                .brands-table tr:hover {
                    background-color: rgba(67, 97, 238, 0.05);
                }

                .image-container {
                    width: 80px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--light-gray);
                    border-radius: 4px;
                    overflow: hidden;
                }

                .brand-image {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }

                .category-tag {
                    display: inline-block;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .category-tag.men {
                    background-color: #d0f4de;
                    color: #1b4332;
                }

                .category-tag.women {
                    background-color: #ffd6ff;
                    color: #5a189a;
                }

                .category-tag.kids {
                    background-color: #ffddd2;
                    color: #78290f;
                }

                .action-buttons {
                    display: flex;
                    gap: 10px;
                }

                .edit-btn, .delete-btn {
                    padding: 8px 15px;
                    border: none;
                    border-radius: var(--border-radius);
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                    font-size: 14px;
                }

                .edit-btn {
                    background-color: var(--primary-color);
                    color: white;
                }

                .edit-btn:hover {
                    background-color: var(--primary-hover);
                    transform: translateY(-2px);
                }

                .delete-btn {
                    background-color: var(--danger-color);
                    color: white;
                }

                .delete-btn:hover {
                    background-color: var(--danger-hover);
                    transform: translateY(-2px);
                }

                .no-results {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 0;
                    text-align: center;
                }

                .no-results img {
                    width: 150px;
                    height: 150px;
                    margin-bottom: 20px;
                    opacity: 0.7;
                }

                .no-results p {
                    font-size: 16px;
                    color: var(--dark-gray);
                    font-weight: 500;
                }

                @media (max-width: 768px) {
                    .admin-content {
                        margin-left: 0;
                        padding: 15px;
                    }

                    .search-filter-container {
                        flex-direction: column;
                    }

                    .header-section {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 15px;
                    }

                    .action-buttons {
                        flex-direction: column;
                        gap: 8px;
                    }

                    .brands-table th, .brands-table td {
                        padding: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminManageBrand;
