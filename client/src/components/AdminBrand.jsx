import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function UploadBrand() {
  const [category, setCategory] = useState("men");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  // Verify Admin Session
  useEffect(() => {
    const verifyAdminSession = async () => {
      try {
        const response = await axios.get("https://shopping-portal-backend.onrender.com/admin-verify", { 
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
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setMessage({ text: "Please select an image", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("category", category);
    formData.append("img", image);

    try {
      const response = await axios.post("https://shopping-portal-backend.onrender.com/api/brands", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setMessage({ 
        text: "Brand image uploaded successfully!", 
        type: "success" 
      });
      setImage(null);
      setPreview(null);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || "Error uploading brand image", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Main container styles
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  };

  // Content area styles
  const contentStyle = {
    display: 'flex',
    flex: 1,
  };

  // Main content styles
  const mainStyle = {
    flex: 1,
    padding: '32px',
    marginLeft: '250px', // Sidebar width
  };

  // Form container styles
  const formContainerStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '32px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  };

  // Title styles
  const titleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '24px',
    textAlign: 'center',
  };

  // Form group styles
  const formGroupStyle = {
    marginBottom: '20px',
  };

  // Label styles
  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    marginBottom: '8px',
  };

  // Select input styles
  const selectStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#334155',
    transition: 'all 0.2s',
    outline: 'none',
    ':focus': {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
    },
  };

  // File input wrapper styles
  const fileInputWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    border: '2px dashed #cbd5e1',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      borderColor: '#94a3b8',
      backgroundColor: '#f1f5f9',
    },
  };

  // File input styles
  const fileInputStyle = {
    display: 'none',
  };

  // File input label styles
  const fileInputLabelStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    color: '#64748b',
    cursor: 'pointer',
  };

  // Upload icon styles
  const uploadIconStyle = {
    fontSize: '40px',
    color: '#94a3b8',
  };

  // Preview container styles
  const previewContainerStyle = {
    marginTop: '20px',
    textAlign: 'center',
  };

  // Preview image styles
  const previewImageStyle = {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  };

  // Submit button styles
  const submitButtonStyle = {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#6366f1',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    ':hover': {
      backgroundColor: '#4f46e5',
      transform: 'translateY(-1px)',
    },
    ':disabled': {
      backgroundColor: '#cbd5e1',
      cursor: 'not-allowed',
      transform: 'none',
    },
  };

  // Message styles
  const messageStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
  };

  // Success message styles
  const successMessageStyle = {
    ...messageStyle,
    backgroundColor: '#ecfdf5',
    color: '#059669',
    border: '1px solid #a7f3d0',
  };

  // Error message styles
  const errorMessageStyle = {
    ...messageStyle,
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
  };

  return (
    <div style={containerStyle}>
      <AdminHeader />
      
      <div style={contentStyle}>
        <AdminSidebar />
        
        <div style={mainStyle}>
          <div style={formContainerStyle}>
            <h2 style={titleStyle}>Upload Brand Image</h2>
            
            {message.text && (
              <div style={message.type === "success" ? successMessageStyle : errorMessageStyle}>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  style={selectStyle}
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Brand Image</label>
                <div style={fileInputWrapperStyle}>
                  <label style={fileInputLabelStyle}>
                    <span style={uploadIconStyle}>📁</span>
                    <span>{preview ? "Change Image" : "Click to Upload"}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      style={fileInputStyle} 
                      required 
                    />
                  </label>
                </div>
                
                {preview && (
                  <div style={previewContainerStyle}>
                    <img src={preview} alt="Preview" style={previewImageStyle} />
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                style={submitButtonStyle}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Uploading...
                  </>
                ) : (
                  "Upload Brand"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
