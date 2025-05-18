import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f4f4f4" },
  mainContent: { flex: 1, padding: "20px" },
  innerContainer: { marginLeft: "240px" },
  message: { color: "red", fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 0 10px rgba(0,0,0,0.1)" },
  th: { padding: "12px", borderBottom: "2px solid #ddd", backgroundColor: "#007bff", color: "white", textAlign: "left" },
  td: { padding: "12px", borderBottom: "1px solid #ddd", textAlign: "left" },
  img: { width: "100px", height: "100px", objectFit: "contain", borderRadius: "5px" },
  input: { padding: "8px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" },
  buttonEdit: { backgroundColor: "#007bff", color: "white", padding: "6px 12px", border: "none", borderRadius: "5px", cursor: "pointer" },
  buttonSave: { backgroundColor: "green", color: "white", padding: "6px 12px", border: "none", borderRadius: "5px", cursor: "pointer" },
  buttonDelete: { backgroundColor: "#dc3545", color: "white", padding: "6px 12px", border: "none", borderRadius: "5px", marginLeft: "5px", cursor: "pointer" },
  select: { marginBottom: "10px", padding: "5px", borderRadius: "5px", border: "1px solid #ddd" },
};

const AdminManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setMessage("Failed to fetch products.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
        if (response.ok) {
          setMessage("Product deleted successfully.");
          fetchProducts();
        } else {
          setMessage("Failed to delete product.");
        }
      } catch (error) {
        setMessage("Error deleting product.");
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
  };

  const handleChange = (e, id, field) => {
    setProducts(products.map((product) => (product._id === id ? { ...product, [field]: e.target.value } : product)));
  };

  const handleSave = async (product) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        setMessage("Product updated successfully.");
        setEditingProduct(null);
      } else {
        setMessage("Failed to update product.");
      }
    } catch (error) {
      setMessage("Error updating product.");
    }
  };

  return (
    <div style={styles.container}>
      <AdminSidebar />
      <div style={styles.mainContent}>
        <AdminHeader />
        <div style={styles.innerContainer}>
        <div className="flex justify-center">
  <h2 className="text-2xl font-bold mb-4">Admin - Manage Products</h2>
</div>

          {message && <p style={styles.message}>{message}</p>}

          <label>Filter by Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={styles.select}>
            <option value="">All Categories</option>
            <option value="Mens">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Home & Living">Home & Living</option>
          </select>

          {loading ? (
            <p>Loading products...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Image</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Discount</th>

                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((product) => !selectedCategory || product.category === selectedCategory)
                  .map((product) => (
                    <tr key={product._id}>
                      <td style={styles.td}>
                        <img
                          src={
                            product.image
                              ? product.image.startsWith("/uploads/")
                                ? `http://localhost:5000${product.image}`
                                : product.image
                              : "https://via.placeholder.com/240"
                          }
                          onError={(e) => (e.target.src = "https://via.placeholder.com/240")}
                          alt={product.name}
                          style={styles.img}
                        />
                      </td>
                      <td style={styles.td}>
                        {editingProduct === product._id ? (
                          <input type="text" value={product.name} onChange={(e) => handleChange(e, product._id, "name")} style={styles.input} />
                        ) : (
                          product.name
                        )}
                      </td>
                      <td style={styles.td}>
                        {editingProduct === product._id ? (
                          <input type="number" value={product.price} onChange={(e) => handleChange(e, product._id, "price")} style={styles.input} />
                        ) : (
                          `Rs. ${product.price}`
                        )}
                      </td>
                      <td style={styles.td}>
                        {editingProduct === product._id ? (
                          <input type="text" value={product.discount} onChange={(e) => handleChange(e, product._id, "discount")} style={styles.input} />
                        ) : (
                          product.discount
                        )}
                      </td>
                      <td style={styles.td}>
                        {editingProduct === product._id ? (
                          <input type="text" value={product.category} onChange={(e) => handleChange(e, product._id, "category")} style={styles.input} />
                        ) : (
                          product.category
                        )}
                      </td>
                      <td style={styles.td}>
                        {editingProduct === product._id ? (
                          <button onClick={() => handleSave(product)} style={styles.buttonSave}>
                            Save
                          </button>
                        ) : (
                          <button onClick={() => handleEdit(product)} style={styles.buttonEdit}>
                            Edit
                          </button>
                        )}
                        <button onClick={() => handleDelete(product._id)} style={styles.buttonDelete}>
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
    </div>
  );
};

export default AdminManageProduct;
