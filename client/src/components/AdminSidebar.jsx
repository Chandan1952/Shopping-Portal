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
} from "react-icons/fa";

const BASE_URL = "https://shopping-portal-backend.onrender.com";

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

  // ✅ Verify Admin Session
  useEffect(() => {
    const verifyAdminSession = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin-verify`, { withCredentials: true });

        if (!response.data.isAdmin) {
          navigate("/admin-login", { replace: true });
        }
      } catch {
        navigate("/admin-login", { replace: true });
      }
    };

    verifyAdminSession();
  }, [navigate]);

  // ✅ Logout Function
  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/admin-logout`, {}, { withCredentials: true });

      localStorage.removeItem("authToken");
      navigate("/admin-login");
    } catch {
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div style={styles.sidebar}>
      <NavLink to="/admin-dashboard" className="nav-link">
        <FaTachometerAlt /> Dashboard
      </NavLink>

      {/* Banner Dropdown */}
      <div style={styles.dropdown} onClick={() => toggleDropdown("banner")}>
        <span>
          <FaBook /> Banner
        </span>
        {dropdowns.banner ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {dropdowns.banner && (
        <div style={styles.dropdownMenu}>
          <NavLink to="/admin-Banner" className="dropdown-link">Create Banner</NavLink>
          <NavLink to="/admin-managebanner" className="dropdown-link">Manage Banner</NavLink>
        </div>
      )}

      {/* Brand Dropdown */}
      <div style={styles.dropdown} onClick={() => toggleDropdown("brand")}>
        <span>
          <FaQuestionCircle /> Brand
        </span>
        {dropdowns.brand ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {dropdowns.brand && (
        <div style={styles.dropdownMenu}>
          <NavLink to="/admin-brand" className="dropdown-link">Create Brand</NavLink>
          <NavLink to="/admin-managebrand" className="dropdown-link">Manage Brand</NavLink>
        </div>
      )}

      {/* Product Dropdown */}
      <div style={styles.dropdown} onClick={() => toggleDropdown("product")}>
        <span>
          <FaBox /> Product
        </span>
        {dropdowns.product ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {dropdowns.product && (
        <div style={styles.dropdownMenu}>
          <NavLink to="/admin-createproduct" className="dropdown-link">Create Product</NavLink>
          <NavLink to="/admin-manageproduct" className="dropdown-link">Manage Product</NavLink>
        </div>
      )}

      {/* Category Dropdown */}
      <div style={styles.dropdown} onClick={() => toggleDropdown("category")}>
        <span>
          <FaTags /> Category
        </span>
        {dropdowns.category ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {dropdowns.category && (
        <div style={styles.dropdownMenu}>
          <NavLink to="/admin-createcategory" className="dropdown-link">Create Category</NavLink>
          <NavLink to="/admin-managecategory" className="dropdown-link">Manage Category</NavLink>
        </div>
      )}

      {/* Other Links */}
      <NavLink to="/adminmanageusers" className="nav-link">
        <FaUsers /> Registered Users
      </NavLink>

      <NavLink to="/admin-manageorder" className="nav-link">
        <FaUsers /> Manage Order
      </NavLink>

      <NavLink to="/admin-updatedcontactinfo" className="nav-link">
        <FaCog /> Updated Contact Info
      </NavLink>

      <NavLink to="/admin-managequery" className="nav-link">
        <FaUsers /> Manage Contact Query
      </NavLink>

      <NavLink to="/admin-managegiftcard" className="nav-link">
        <FaUsers /> Manage Gift Cards
      </NavLink>

      {/* Bottom Links */}
      <div style={styles.bottomLinks}>
        <NavLink to="/admin-changepassword" className="nav-link">
          <FaKey /> Change Password
        </NavLink>
        <div style={styles.logout} onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </div>
      </div>
    </div>
  );
};

// ✅ Styles using CSS classes instead of inline styles for better maintainability
const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    backgroundColor: "#1E1E2F",
    color: "white",
    display: "flex",
    flexDirection: "column",
    paddingTop: "65px",
    position: "fixed",
    left: "0",
    top: "0",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  },
  dropdown: {
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    padding: "12px",
    color: "#fff",
    fontSize: "14px",
    transition: "background 0.3s",
  },
  dropdownMenu: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "15px",
    backgroundColor: "#2A2A3A",
    borderRadius: "6px",
    padding: "6px",
  },
  bottomLinks: {
    marginTop: "auto",
    borderTop: "2px solid #35354D",
    paddingTop: "15px",
  },
  logout: {
    cursor: "pointer",
    color: "red",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
};

export default AdminSidebar;
