import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminCreateProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        originalPrice: "",
        discount: "",
        description: "",
        category: "", // New Category Field
    });
    
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
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
      

    // Handle text input change
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Create preview URL
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("originalPrice", product.originalPrice);
        formData.append("discount", product.discount);
        formData.append("description", product.description);
        formData.append("category", product.category); // Append category
        if (image) {
            formData.append("image", image); // Append image file
        }

        try {
            const response = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                body: formData, // Send FormData to backend
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Product added successfully!");
                setProduct({ name: "", price: "", originalPrice: "", discount: "", description: "", category: "" });
                setImage(null);
                setPreview(null);
            } else {
                setMessage(data.message || "Failed to add product.");
            }
        } catch (error) {
            setMessage("Error adding product. Please try again.");
        }

        setLoading(false);
    };

    // Inline CSS styles
    const styles = {
        container: {
            display: "flex",
            minHeight: "100vh",
            backgroundColor: "#f4f4f4",
        },
        heading: {
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#333",
            textAlign: "center", // ✅ Centers the heading
            width: "100%", // ✅ Ensures it takes full width
          },
        mainContent: {
            flex: 1,
            padding: "20px",
        },
        formContainer: {
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            maxWidth: "500px",
            margin: "auto",
        },
        inputField: {
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginBottom: "10px",
        },
        selectField: {
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginBottom: "10px",
            backgroundColor: "white",
        },
        button: {
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
        },
        buttonDisabled: {
            backgroundColor: "#999",
            cursor: "not-allowed",
        },
        message: {
            marginBottom: "10px",
            color: "red",
            fontWeight: "bold",
        },
        imagePreview: {
            width: "100%",
            maxHeight: "200px",
            objectFit: "contain",
            borderRadius: "5px",
            marginBottom: "10px",
        },
    };

    return (
        <div style={styles.container}>
            <AdminSidebar />
            <div style={styles.mainContent}>
                <AdminHeader />
                <div style={styles.heading}>
  <h2>Admin - Manage Products</h2>
</div>
                {message && <p style={styles.message}>{message}</p>}

                <form onSubmit={handleSubmit} style={styles.formContainer} encType="multipart/form-data">
                    <label>Product Name</label>
                    <input type="text" name="name" value={product.name} onChange={handleChange} style={styles.inputField} required />

                    <label>Category</label>
                    <select name="category" value={product.category} onChange={handleChange} style={styles.selectField} required>
                        <option value="">Select Category</option>
                        <option value="Mens">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                        <option value="Home & Living">Home & Living</option>
                    </select>

                    <label>Price (Rs.)</label>
                    <input type="number" name="price" value={product.price} onChange={handleChange} style={styles.inputField} required />

                    <label>Original Price (Rs.)</label>
                    <input type="number" name="originalPrice" value={product.originalPrice} onChange={handleChange} style={styles.inputField} />

                    <label>Discount (%)</label>
                    <input type="text" name="discount" value={product.discount} onChange={handleChange} style={styles.inputField} />

                    <label>Description</label>
                    <textarea name="description" value={product.description} onChange={handleChange} style={styles.inputField} required />

                    <label>Product Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={styles.inputField} required />
                    
                    {/* Show Image Preview */}
                    {preview && <img src={preview} alt="Preview" style={styles.imagePreview} />}

                    <button type="submit" style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button} disabled={loading}>
                        {loading ? "Adding..." : "Add Product"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminCreateProduct;
