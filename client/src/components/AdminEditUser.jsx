import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSave, FiX, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiHome } from "react-icons/fi";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    country: "",
    city: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get-user/${id}`, { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/update-user/${id}`, user, { withCredentials: true });
      toast.success("User updated successfully!");
      setTimeout(() => navigate("/admin-manageusers"), 1500);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleCancel = () => {
    navigate("/admin-manageusers");
  };

  return (
    <div className="admin-edit-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <AdminHeader />
      
      <div className="admin-main-layout">
        <AdminSidebar />
        
        <div className="edit-user-content">
          <div className="edit-user-card">
            <h2 className="edit-user-title">
              <FiUser className="title-icon" /> Edit User Profile
            </h2>
            
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading user data...</p>
              </div>
            ) : (
              <form className="user-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <FiUser className="input-icon" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={user.fullName}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <FiMail className="input-icon" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <FiPhone className="input-icon" /> Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <FiCalendar className="input-icon" /> Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={user.dob}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label className="form-label">
                      <FiHome className="input-icon" /> Address
                    </label>
                    <textarea
                      name="address"
                      value={user.address}
                      onChange={handleChange}
                      className="form-textarea"
                      placeholder="Enter full address"
                      rows="3"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <FiMapPin className="input-icon" /> Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={user.country}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter country"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <FiMapPin className="input-icon" /> City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={user.city}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter city"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={handleCancel}>
                    <FiX /> Cancel
                  </button>
                  <button type="button" className="save-btn" onClick={handleSave}>
                    <FiSave /> Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-edit-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f8fafc;
        }
        
        .admin-main-layout {
          display: flex;
          flex: 1;
        }
        
        .edit-user-content {
          flex: 1;
          padding: 2rem;
          margin-left: 250px;
        }
        
        .edit-user-card {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }
        
        .edit-user-title {
          font-size: 1.5rem;
          color: #1e293b;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .title-icon {
          font-size: 1.75rem;
          color: #6366f1;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .full-width {
          grid-column: span 2;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .input-icon {
          color: #94a3b8;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
        
        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          resize: vertical;
          min-height: 100px;
          transition: all 0.2s ease;
        }
        
        .form-textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .save-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background-color: #6366f1;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .save-btn:hover {
          background-color: #4f46e5;
        }
        
        .cancel-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background-color: #f1f5f9;
          color: #64748b;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .cancel-btn:hover {
          background-color: #e2e8f0;
          color: #475569;
        }
        
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          gap: 1rem;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @media (max-width: 768px) {
          .edit-user-content {
            margin-left: 0;
            padding: 1rem;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .full-width {
            grid-column: span 1;
          }
          
          .form-actions {
            flex-direction: column-reverse;
          }
          
          .save-btn, .cancel-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminEditUser;