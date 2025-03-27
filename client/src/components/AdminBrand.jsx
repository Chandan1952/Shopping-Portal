import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import AdminHeader from "./AdminHeader"; // Adjust the path if needed
import AdminSidebar from "./AdminSidebar"; // Adjust the path if needed

export default function UploadBrand() {
  const [category, setCategory] = useState("men");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
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
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category", category);
    formData.append("img", image); // Append image

    try {
      const response = await axios.post("http://localhost:5000/api/brands", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Brand image uploaded successfully!");
      console.log(response.data);
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("Error uploading brand image:", error);
    }
  };

  return (
    <div style={styles.layout}>
      <AdminHeader />
      <div style={styles.content}>
        <AdminSidebar />
        <div style={styles.main}>
          <h2 style={styles.title}>Upload Brand Image</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
            <input type="file" accept="image/*" onChange={handleImageChange} required style={styles.fileInput} />

            {preview && (
              <div style={styles.previewContainer}>
                <img src={preview} alt="Preview" style={styles.previewImage} />
              </div>
            )}

            <button type="submit" style={styles.button}>Upload</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  layout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  content: {
    display: "flex",
    flex: 1,
  },
  main: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  fileInput: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
  },
  previewContainer: {
    marginTop: "15px",
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    maxWidth: "200px",
    height: "auto",
    borderRadius: "8px",
    border: "1px solid #ddd",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};
