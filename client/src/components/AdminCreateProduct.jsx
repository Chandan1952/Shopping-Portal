import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        category: "",
    });
    
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'error'
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

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setMessageType("");

        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("originalPrice", product.originalPrice);
        formData.append("discount", product.discount);
        formData.append("description", product.description);
        formData.append("category", product.category);
        if (image) formData.append("image", image);

        try {
            const response = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setMessageType("success");
                setMessage("Product added successfully!");
                setProduct({ 
                    name: "", 
                    price: "", 
                    originalPrice: "", 
                    discount: "", 
                    description: "", 
                    category: "" 
                });
                setImage(null);
                setPreview(null);
            } else {
                setMessageType("error");
                setMessage(data.message || "Failed to add product.");
            }
        } catch (error) {
            setMessageType("error");
            setMessage("Error adding product. Please try again.");
        }
        setLoading(false);
    };

    // Inline CSS styles
    const styles = {
        container: {
            display: "flex",
            minHeight: "100vh",
            backgroundColor: "#f8fafc",
            fontFamily: "'Inter', sans-serif",
        },
        mainContent: {
            flex: 1,
            padding: "2rem",
            marginLeft: "250px", // Account for sidebar width
        },
        heading: {
            fontSize: "1.75rem",
            fontWeight: "600",
            marginBottom: "1.5rem",
            color: "#1e293b",
            textAlign: "center",
            position: "relative",
            paddingBottom: "0.5rem",
        },
        headingUnderline: {
            content: '""',
            position: "absolute",
            bottom: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80px",
            height: "4px",
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
            borderRadius: "2px",
        },
        formContainer: {
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            maxWidth: "600px",
            margin: "0 auto",
        },
        formGroup: {
            marginBottom: "1.25rem",
        },
        label: {
            display: "block",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#475569",
        },
        inputField: {
            width: "100%",
            padding: "0.75rem 1rem",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "0.875rem",
            transition: "all 0.2s",
            outline: "none",
        },
        inputFieldFocus: {
            borderColor: "#3b82f6",
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
        },
        selectField: {
            ...this.inputField,
            appearance: "none",
            backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1em",
        },
        textarea: {
            ...this.inputField,
            minHeight: "100px",
            resize: "vertical",
        },
        fileInput: {
            width: "0.1px",
            height: "0.1px",
            opacity: 0,
            overflow: "hidden",
            position: "absolute",
            zIndex: -1,
        },
        fileInputLabel: {
            display: "block",
            width: "100%",
            padding: "0.75rem 1rem",
            border: "1px dashed #cbd5e1",
            borderRadius: "8px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            backgroundColor: "#f8fafc",
            color: "#64748b",
        },
        fileInputLabelHover: {
            borderColor: "#3b82f6",
            backgroundColor: "#f0f9ff",
        },
        imagePreview: {
            width: "100%",
            maxHeight: "250px",
            objectFit: "contain",
            borderRadius: "8px",
            marginTop: "1rem",
            border: "1px solid #e2e8f0",
        },
        button: {
            width: "100%",
            padding: "0.75rem 1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
            marginTop: "0.5rem",
        },
        buttonHover: {
            backgroundColor: "#2563eb",
        },
        buttonDisabled: {
            backgroundColor: "#94a3b8",
            cursor: "not-allowed",
        },
        successMessage: {
            padding: "0.75rem 1rem",
            backgroundColor: "#dcfce7",
            color: "#166534",
            borderRadius: "8px",
            marginBottom: "1.25rem",
            fontSize: "0.875rem",
            fontWeight: "500",
        },
        errorMessage: {
            padding: "0.75rem 1rem",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
            marginBottom: "1.25rem",
            fontSize: "0.875rem",
            fontWeight: "500",
        },
        priceContainer: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
        },
    };

    return (
        <div style={styles.container}>
            <AdminSidebar />
            <div style={styles.mainContent}>
                <AdminHeader />
                <h2 style={styles.heading}>
                    Add New Product
                    <span style={styles.headingUnderline}></span>
                </h2>

                {message && (
                    <div style={messageType === "success" ? styles.successMessage : styles.errorMessage}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.formContainer} encType="multipart/form-data">
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            style={styles.inputField}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Category</label>
                        <select
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            style={styles.selectField}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Mens">Men</option>
                            <option value="Women">Women</option>
                            <option value="Kids">Kids</option>
                            <option value="Home & Living">Home & Living</option>
                        </select>
                    </div>

                    <div style={styles.priceContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Price (Rs.)</label>
                            <input
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                style={styles.inputField}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Original Price (Rs.)</label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={product.originalPrice}
                                onChange={handleChange}
                                style={styles.inputField}
                            />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Discount (%)</label>
                        <input
                            type="text"
                            name="discount"
                            value={product.discount}
                            onChange={handleChange}
                            style={styles.inputField}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            style={styles.textarea}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Product Image</label>
                        <input
                            type="file"
                            id="productImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={styles.fileInput}
                            required
                        />
                        <label 
                            htmlFor="productImage" 
                            style={styles.fileInputLabel}
                        >
                            {preview ? "Change Image" : "Choose an image..."}
                        </label>
                        {preview && (
                            <img src={preview} alt="Preview" style={styles.imagePreview} />
                        )}
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {}),
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <span>Adding Product...</span>
                        ) : (
                            <span>Add Product</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminCreateProduct;