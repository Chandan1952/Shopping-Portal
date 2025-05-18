import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaKey,
  FaSignOutAlt,
  FaBox,
  FaTags,
  FaUsers,
  FaCog,
  FaShoppingBag,
  FaEnvelope,
  FaGift
} from "react-icons/fa";

const AdminSidebar = () => {
  const [dropdowns, setDropdowns] = useState({
    banner: false,
    brand: false,
    product: false,
    category: false,
  });

  const navigate = useNavigate();

  const toggleDropdown = (key) => {
    setDropdowns((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

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
    verifyAdminSession();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin-logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        navigate("/admin-login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div style={{
      width: "260px",
      minHeight: "100vh",
      backgroundColor: "#1a2035",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 900,
      paddingTop: "75px",
      boxShadow: "4px 0 15px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      overflowY: "auto",
      "::-webkit-scrollbar": {
        width: "5px"
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: "#4a5568",
        borderRadius: "10px"
      }
    }}>
      {/* Dashboard Section */}
      <div style={{ padding: "20px 15px" }}>
        <NavLink 
          to="/admin-dashboard" 
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 15px",
            borderRadius: "8px",
            color: "#fff",
            textDecoration: "none",
            transition: "all 0.2s ease",
            backgroundColor: isActive ? "#3182ce" : "transparent",
            marginBottom: "5px",
            fontSize: "15px",
            fontWeight: "500",
            ":hover": {
              backgroundColor: isActive ? "#3182ce" : "#2d3748"
            }
          })}
        >
          <FaTachometerAlt style={{ fontSize: "16px" }} />
          Dashboard
        </NavLink>

        {/* Banner Section */}
        <div style={{ marginBottom: "5px" }}>
          <div 
            onClick={() => toggleDropdown("banner")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 15px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: dropdowns.banner ? "#2d3748" : "transparent",
              ":hover": {
                backgroundColor: "#2d3748"
              }
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaBook style={{ fontSize: "16px" }} />
              <span style={{ fontSize: "15px", fontWeight: "500" }}>Banner</span>
            </div>
            {dropdowns.banner ? <FaChevronUp style={{ fontSize: "12px" }} /> : <FaChevronDown style={{ fontSize: "12px" }} />}
          </div>
          {dropdowns.banner && (
            <div style={{ 
              marginLeft: "30px",
              marginTop: "5px",
              display: "flex",
              flexDirection: "column",
              gap: "3px"
            }}>
              <NavLink 
                to="/admin-Banner"
                style={({ isActive }) => ({
                  padding: "10px 15px",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive ? "#3182ce" : "transparent",
                  ":hover": {
                    backgroundColor: isActive ? "#3182ce" : "#4a5568"
                  }
                })}
              >
                Create Banner
              </NavLink>
              <NavLink 
                to="/admin-managebanner"
                style={({ isActive }) => ({
                  padding: "10px 15px",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive ? "#3182ce" : "transparent",
                  ":hover": {
                    backgroundColor: isActive ? "#3182ce" : "#4a5568"
                  }
                })}
              >
                Manage Banner
              </NavLink>
            </div>
          )}
        </div>

        {/* Brand Section */}
        <div style={{ marginBottom: "5px" }}>
          <div 
            onClick={() => toggleDropdown("brand")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 15px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: dropdowns.brand ? "#2d3748" : "transparent",
              ":hover": {
                backgroundColor: "#2d3748"
              }
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaQuestionCircle style={{ fontSize: "16px" }} />
              <span style={{ fontSize: "15px", fontWeight: "500" }}>Brand</span>
            </div>
            {dropdowns.brand ? <FaChevronUp style={{ fontSize: "12px" }} /> : <FaChevronDown style={{ fontSize: "12px" }} />}
          </div>
          {dropdowns.brand && (
            <div style={{ 
              marginLeft: "30px",
              marginTop: "5px",
              display: "flex",
              flexDirection: "column",
              gap: "3px"
            }}>
              <NavLink 
                to="/admin-brand"
                style={({ isActive }) => ({
                  padding: "10px 15px",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive ? "#3182ce" : "transparent",
                  ":hover": {
                    backgroundColor: isActive ? "#3182ce" : "#4a5568"
                  }
                })}
              >
                Create Brand
              </NavLink>
              <NavLink 
                to="/admin-managebrand"
                style={({ isActive }) => ({
                  padding: "10px 15px",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive ? "#3182ce" : "transparent",
                  ":hover": {
                    backgroundColor: isActive ? "#3182ce" : "#4a5568"
                  }
                })}
              >
                Manage Brand
              </NavLink>
            </div>
          )}
        </div>

        {/* Product Section */}
        <div style={{ marginBottom: "5px" }}>
          <div 
            onClick={() => toggleDropdown("product")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 15px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: dropdowns.product ? "#2d3748" : "transparent",
              ":hover": {
                backgroundColor: "#2d3748"
              }
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaBox style={{ fontSize: "16px" }} />
              <span style={{ fontSize: "15px", fontWeight: "500" }}>Product</span>
            </div>
            {dropdowns.product ? <FaChevronUp style={{ fontSize: "12px" }} /> : <FaChevronDown style={{ fontSize: "12px" }} />}
          </div>
          {dropdowns.product && (
            <div style={{ 
              marginLeft: "30px",
              marginTop: "5px",
              display: "flex",
              flexDirection: "column",
              gap: "3px"
            }}>
              <NavLink 
                to="/admin-createproduct"
                style={({ isActive }) => ({
                  padding: "10px 15px",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive ? "#3182ce" : "transparent",
                  ":hover": {
                    backgroundColor: isActive ? "#3182ce" : "#4a5568"
                  }
                })}
              >
                Create Product
              </NavLink>
              <NavLink 
                to="/admin-manageproduct"
                style={({ isActive }) => ({
                  padding: "10px 15px",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive ? "#3182ce" : "transparent",
                  ":hover": {
                    backgroundColor: isActive ? "#3182ce" : "#4a5568"
                  }
                })}
              >
                Manage Product
              </NavLink>
            </div>
          )}
        </div>

        {/* Category Section */}
        <div style={{ marginBottom: "5px" }}>
          <div 
            onClick={() => toggleDropdown("category")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 15px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: dropdowns.category ? "#2d3748" : "transparent",
              ":hover": {
                backgroundColor: "#2d3748"
              }
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaTags style={{ fontSize: "16px" }} />
              <span style={{ fontSize: "15px", fontWeight: "500" }}>Category</span>
            </div>
            {dropdowns.category ? <FaChevronUp style={{ fontSize: "12px" }} /> : <FaChevronDown style={{ fontSize: "12px" }} />}
          </div>
          {dropdowns.category && (
            <div style={{ 
              marginLeft: "30px",
              marginTop: "5px",
              display: "flex",
              flexDirection: "column",
              gap: "3px"
            }}>
              <NavLink 
                to="/admin-createcategory"
                style={({ isActive }) => ({
                  padding: "10px 15px",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive ? "#3182ce" : "transparent",
                  ":hover": {
                    backgroundColor: isActive ? "#3182ce" : "#4a5568"
                  }
                })}
              >
                Create Category
              </NavLink>
              <NavLink 
                to="/admin-managecategory"
                style={({ isActive }) => ({
                  padding: "10px 15px",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive ? "#3182ce" : "transparent",
                  ":hover": {
                    backgroundColor: isActive ? "#3182ce" : "#4a5568"
                  }
                })}
              >
                Manage Category
              </NavLink>
            </div>
          )}
        </div>

        {/* Other Menu Items */}
        <NavLink 
          to="/adminmanageusers"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 15px",
            borderRadius: "8px",
            color: "#fff",
            textDecoration: "none",
            transition: "all 0.2s ease",
            backgroundColor: isActive ? "#3182ce" : "transparent",
            marginBottom: "5px",
            fontSize: "15px",
            fontWeight: "500",
            ":hover": {
              backgroundColor: isActive ? "#3182ce" : "#2d3748"
            }
          })}
        >
          <FaUsers style={{ fontSize: "16px" }} />
          Registered Users
        </NavLink>

        <NavLink 
          to="/admin-manageorder"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 15px",
            borderRadius: "8px",
            color: "#fff",
            textDecoration: "none",
            transition: "all 0.2s ease",
            backgroundColor: isActive ? "#3182ce" : "transparent",
            marginBottom: "5px",
            fontSize: "15px",
            fontWeight: "500",
            ":hover": {
              backgroundColor: isActive ? "#3182ce" : "#2d3748"
            }
          })}
        >
          <FaShoppingBag style={{ fontSize: "16px" }} />
          Manage Orders
        </NavLink>

        <NavLink 
          to="/admin-updatedcontactinfo"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 15px",
            borderRadius: "8px",
            color: "#fff",
            textDecoration: "none",
            transition: "all 0.2s ease",
            backgroundColor: isActive ? "#3182ce" : "transparent",
            marginBottom: "5px",
            fontSize: "15px",
            fontWeight: "500",
            ":hover": {
              backgroundColor: isActive ? "#3182ce" : "#2d3748"
            }
          })}
        >
          <FaCog style={{ fontSize: "16px" }} />
          Contact Info
        </NavLink>

        <NavLink 
          to="/admin-managequery"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 15px",
            borderRadius: "8px",
            color: "#fff",
            textDecoration: "none",
            transition: "all 0.2s ease",
            backgroundColor: isActive ? "#3182ce" : "transparent",
            marginBottom: "5px",
            fontSize: "15px",
            fontWeight: "500",
            ":hover": {
              backgroundColor: isActive ? "#3182ce" : "#2d3748"
            }
          })}
        >
          <FaEnvelope style={{ fontSize: "16px" }} />
          Contact Queries
        </NavLink>

        <NavLink 
          to="/admin-managegiftcard"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 15px",
            borderRadius: "8px",
            color: "#fff",
            textDecoration: "none",
            transition: "all 0.2s ease",
            backgroundColor: isActive ? "#3182ce" : "transparent",
            marginBottom: "5px",
            fontSize: "15px",
            fontWeight: "500",
            ":hover": {
              backgroundColor: isActive ? "#3182ce" : "#2d3748"
            }
          })}
        >
          <FaGift style={{ fontSize: "16px" }} />
          Gift Cards
        </NavLink>

        {/* Bottom Links */}
        <div style={{ 
          marginTop: "auto",
          padding: "15px",
          borderTop: "1px solid #2d3748"
        }}>
          <NavLink 
            to="/admin-changepassword"
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 15px",
              borderRadius: "8px",
              color: "#fff",
              textDecoration: "none",
              transition: "all 0.2s ease",
              backgroundColor: isActive ? "#3182ce" : "transparent",
              marginBottom: "10px",
              fontSize: "15px",
              fontWeight: "500",
              ":hover": {
                backgroundColor: isActive ? "#3182ce" : "#2d3748"
              }
            })}
          >
            <FaKey style={{ fontSize: "16px" }} />
            Change Password
          </NavLink>
          <div 
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 15px",
              borderRadius: "8px",
              color: "#fff",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: "transparent",
              fontSize: "15px",
              fontWeight: "500",
              ":hover": {
                backgroundColor: "#e53e3e"
              }
            }}
          >
            <FaSignOutAlt style={{ fontSize: "16px" }} />
            Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;