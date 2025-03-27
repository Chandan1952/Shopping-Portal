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
  


  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin-logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        alert("Logged out successfully!");
        localStorage.removeItem("authToken");
        navigate("/admin-login"); // Change if needed
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      alert("Error logging out.");
    }
  };

  return (
    <div style={styles.sidebar}>

      {/* Dashboard */}
      <NavLink to="/admin-dashboard" style={styles.link} activeStyle={styles.activeLink}>
        <FaTachometerAlt /> Dashboard
      </NavLink>

      {/* Banner Dropdown */}
      <div style={styles.dropdown} onClick={() => toggleDropdown("banner")}>
        <span style={styles.dropdownLabel}>
          <FaBook /> Banner
        </span>
        {dropdowns.banner ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {dropdowns.banner && (
        <div style={styles.dropdownMenu}>
          <NavLink to="/admin-Banner" style={styles.dropdownLink}>
            Create Banner
          </NavLink>
          <NavLink to="/admin-managebanner" style={styles.dropdownLink}>
            Manage Banner
          </NavLink>
        </div>
      )}

      {/* Brand Dropdown */}
      <div style={styles.dropdown} onClick={() => toggleDropdown("brand")}>
        <span style={styles.dropdownLabel}>
          <FaQuestionCircle /> Brand
        </span>
        {dropdowns.brand ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {dropdowns.brand && (
        <div style={styles.dropdownMenu}>
          <NavLink to="/admin-brand" style={styles.dropdownLink}>
            Create Brand
          </NavLink>
          <NavLink to="/admin-managebrand" style={styles.dropdownLink}>
            Manage Brand
          </NavLink>
         
        </div>
      )}

      {/* Product Dropdown */}
      <div style={styles.dropdown} onClick={() => toggleDropdown("product")}>
        <span style={styles.dropdownLabel}>
          <FaBox /> Product
        </span>
        {dropdowns.product ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {dropdowns.product && (
        <div style={styles.dropdownMenu}>
          <NavLink to="/admin-createproduct" style={styles.dropdownLink}>
            Create Product
          </NavLink>
          <NavLink to="/admin-manageproduct" style={styles.dropdownLink}>
            Manage Product
          </NavLink>
        </div>
      )}

      {/* Category Dropdown */}
      <div style={styles.dropdown} onClick={() => toggleDropdown("category")}>
        <span style={styles.dropdownLabel}>
          <FaTags /> Category
        </span>
        {dropdowns.category ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {dropdowns.category && (
        <div style={styles.dropdownMenu}>
          <NavLink to="/admin-createcategory" style={styles.dropdownLink}>
            Create Category
          </NavLink>
          <NavLink to="/admin-managecategory" style={styles.dropdownLink}>
            Manage Category
          </NavLink>
        </div>
      )}

<NavLink to="/adminmanageusers" style={styles.link}>
        <FaUsers /> Registered Users
      </NavLink>

      <NavLink to="/admin-manageorder" style={styles.link}>
        <FaUsers /> Manage Order
      </NavLink>

      <NavLink to="/admin-updatedcontactinfo" style={styles.link}>
        <FaCog /> Updated Contact Info
      </NavLink>

      <NavLink to="/admin-managequery" style={styles.link}>
        <FaUsers /> Manage Contact Query
      </NavLink>

      <NavLink to="/admin-managegiftcard" style={styles.link}>
        <FaUsers /> Manage Gift Cards
      </NavLink>


      {/* Change Password & Logout */}
      <div style={styles.bottomLinks}>
        <NavLink to="/admin-changepassword" style={styles.link} activeStyle={styles.activeLink}>
          <FaKey /> Change Password
        </NavLink>
        <div style={styles.link} onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </div>



      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    height: "90vh",
    backgroundColor: "#1E1E2F",
    color: "white",
    display: "flex",
    flexDirection: "column",
    paddingTop:"65px",
    position: "fixed",
    left: "0",
    top: "0",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    transition: "0.3s",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    padding: "15px 10px",
    textAlign: "center",
    borderBottom: "2px solid #35354D",
  },
  link: {
    textDecoration: "none",
    color: "white",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "background 0.3s, padding-left 0.3s",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize:"15px"
  },
  activeLink: {
    backgroundColor: "#35354D",
    paddingLeft: "20px",
    borderRadius: "6px",
  },
  dropdown: {
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    padding: "12px",
    borderRadius: "6px",
    transition: "background 0.3s",
    color: "#fff",
    fontSize:"13px"

  },
  dropdownLabel: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  dropdownMenu: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "15px",
    backgroundColor: "#2A2A3A",
    borderRadius: "6px",
    padding: "6px",
    transition: "height 0.3s ease-in-out",
  },
  dropdownLink: {
    textDecoration: "none",
    color: "#ddd",
    padding: "10px",
    transition: "background 0.3s, padding-left 0.3s",
    borderRadius: "6px",
  },
  dropdownLinkHover: {
    backgroundColor: "#404050",
    paddingLeft: "15px",
  },
  bottomLinks: {
    marginTop: "auto",
    borderTop: "2px solid #35354D",
    paddingTop: "15px",
  },
};

export default AdminSidebar;
