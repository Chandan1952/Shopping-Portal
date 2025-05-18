import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminCreateCategory = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [discount, setDiscount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
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
        setImage(null);
        setPreviewImage(null);
        setDiscount("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error adding category. Please try again.");
    }
  };

  // Main container style
  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
  };

  // Content area style
  const contentStyle = {
    flex: 1,
    padding: '30px',
    marginLeft: '250px', // Sidebar width
  };

  // Form container style
  const formContainerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  };

  // Title style
  const titleStyle = {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e2e8f0',
  };

  // Input group style
  const inputGroupStyle = {
    marginBottom: '20px',
  };

  // Label style
  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4a5568',
    marginBottom: '8px',
  };

  // Input style
  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#4a5568',
    backgroundColor: '#f8fafc',
    transition: 'all 0.3s',
    boxSizing: 'border-box',
    ':focus': {
      borderColor: '#4299e1',
      backgroundColor: '#ffffff',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)',
      outline: 'none',
    },
  };

  // File input style
  const fileInputStyle = {
    display: 'none',
  };

  // File upload button style
  const fileUploadButtonStyle = {
    display: 'inline-block',
    padding: '12px 20px',
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    textAlign: 'center',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#e2e8f0',
    },
  };

  // Image preview style
  const imagePreviewStyle = {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'contain',
    marginTop: '15px',
    borderRadius: '8px',
    border: '1px dashed #cbd5e0',
    display: previewImage ? 'block' : 'none',
  };

  // Submit button style
  const submitButtonStyle = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4299e1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '10px',
    ':hover': {
      backgroundColor: '#3182ce',
      transform: 'translateY(-2px)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
  };

  // Message style
  const messageStyle = {
    textAlign: 'center',
    margin: '15px 0',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
  };

  // Success message style
  const successMessageStyle = {
    ...messageStyle,
    backgroundColor: '#f0fff4',
    color: '#38a169',
    border: '1px solid #c6f6d5',
  };

  // Error message style
  const errorMessageStyle = {
    ...messageStyle,
    backgroundColor: '#fff5f5',
    color: '#e53e3e',
    border: '1px solid #fed7d7',
  };

  return (
    <div style={containerStyle}>
      <AdminSidebar />
      
      <div style={contentStyle}>
        <AdminHeader />
        
        <div style={formContainerStyle}>
          <h2 style={titleStyle}>Create New Category</h2>
          
          {message && (
            <div style={successMessageStyle}>
              {message}
            </div>
          )}
          
          {error && (
            <div style={errorMessageStyle}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Category Title</label>
              <input
                type="text"
                placeholder="e.g. Electronics, Fashion, Home Decor"
                style={inputStyle}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Category Image</label>
              <label style={fileUploadButtonStyle}>
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  style={fileInputStyle}
                  onChange={handleImageChange}
                />
              </label>
              {previewImage && (
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  style={imagePreviewStyle} 
                />
              )}
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Discount Offer</label>
              <input
                type="text"
                placeholder="e.g. 50-80% OFF"
                style={inputStyle}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            
            <button type="submit" style={submitButtonStyle}>
              Create Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateCategory;