import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  message: {
    textAlign: "center",
    marginTop: "10px",
    color: "green",
  },
  error: {
    textAlign: "center",
    marginTop: "10px",
    color: "red",
  },
};

export default function AdminCreateCategory() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [discount, setDiscount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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
  

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!title || !image || !discount) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("img", image);
    formData.append("discount", discount);

    try {
      const response = await axios.post("http://localhost:5000/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setMessage("Category added successfully!");
        setTitle("");
        setImage("");
        setDiscount("");
      }
    } catch (err) {
      setError("Error adding category. Please try again.");
    }
  };

  return (

    <div style={styles.container}>
            <AdminHeader />

    <AdminSidebar />


      <h2 style={styles.title}>Create New Category</h2>
      {message && <p style={styles.message}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category Title"
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          style={styles.input}
          onChange={handleImageChange}
        />
        <input
          type="text"
          placeholder="Discount (e.g., 50-80% OFF)"
          style={styles.input}
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
        <button type="submit" style={styles.button}>Create Category</button>
      </form>
    </div>
  );
}
