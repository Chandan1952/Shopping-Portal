import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaHeart, FaShoppingBag, FaBars } from "react-icons/fa";
import AuthModal from "./AuthModal";

export default function Header() {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Fetch User Data from Backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://shopping-portal-backend.onrender.com/api/user", {
          method: "GET",
          credentials: "include", // ✅ Ensures cookies are sent
        });

        if (!response.ok) throw new Error("User not authenticated");

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // ✅ Handle Logout
  const handleLogout = async () => {
    try {
      const response = await fetch("https://shopping-portal-backend.onrender.com/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        setUser(null);
        navigate("/", { replace: true });
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // ✅ Close profile dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.toLowerCase()}`);
  };

  return (
    <>
      <header className="header">
        {/* Logo */}
        <Link to="/" className="logo">Myntra</Link>

        {/* Mobile Menu Icon */}
        <FaBars className="menu-toggle" onClick={() => setMobileMenu(!mobileMenu)} />

        {/* Navigation Links */}
        <nav className={`nav-links ${mobileMenu ? "active" : ""}`}>
          <span onClick={() => handleCategoryClick("Men")}>Men</span>
          <span onClick={() => handleCategoryClick("Women")}>Women</span>
          <span onClick={() => handleCategoryClick("Kids")}>Kids</span>
          <span onClick={() => handleCategoryClick("Home & Living")}>Home & Living</span>
        </nav>

        {/* Search Bar */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search for products, brands, and more" className="search-input" />
        </div>

        {/* Icons */}
        <div className="icons-container">
          {/* Profile Dropdown */}
          <div
            className="icon profile-container"
            ref={dropdownRef}
            onMouseEnter={() => setProfileDropdown(true)}
            onMouseLeave={() => setProfileDropdown(false)}
          >
            <FaUser />
            {profileDropdown && (
              <div className="profile-dropdown">
                {user ? (
                  <>
                    <div className="dropdown-item bold">Welcome, {user.fullName || "Guest"}</div>
                    <hr />
                    <Link to="/edit-profile" className="dropdown-item">Profile</Link>
                    <Link to="/order-return" className="dropdown-item">Orders</Link>
                    <Link to="/wishlist" className="dropdown-item">Wishlist</Link>
                    <hr />
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                  </>
                ) : (
                  <button className="auth-button" onClick={() => setAuthOpen(true)}>LOGIN / REGISTER</button>
                )}
              </div>
            )}
          </div>
          <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} setUser={setUser} />

          {/* Wishlist & Cart */}
          <Link to="/wishlist" className="cart-link"><FaHeart className="icon" /></Link>
          <Link to="/cart-list" className="cart-link"><FaShoppingBag className="icon" /></Link>
        </div>
      </header>

      {/* Styles */}
      <style>
        {`
          .header {
            background-color: #ffffff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .logo {
            color: #ff3f6c;
            font-size: 24px;
            font-weight: bold;
            text-decoration: none;
          }

          .nav-links {
            display: flex;
            gap: 20px;
            color: #333;
            font-weight: bold;
            cursor: pointer;
          }

          .nav-links span:hover {
            color: #ff3f6c;
          }

          .menu-toggle {
            display: none;
            font-size: 24px;
            cursor: pointer;
          }

          .search-container {
            position: relative;
            width: 30%;
          }

          .search-input {
            width: 100%;
            padding: 8px 10px 8px 35px;
            border: 1px solid #ccc;
            border-radius: 5px;
            outline: none;
          }

          .icons-container {
            display: flex;
            gap: 20px;
            font-size: 22px;
          }

          .icon {
            cursor: pointer;
            transition: color 0.2s ease-in-out;
          }

          .icon:hover {
            color: #ff3f6c;
          }

          .profile-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background-color: #fff;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            min-width: 220px;
            padding: 10px 0;
            z-index: 100;
          }

          .logout-button {
            color: white;
            background: red;
            width: 100%;
            padding: 10px;
            border: none;
            cursor: pointer;
          }

          /* Mobile Styles */
          @media (max-width: 768px) {
            .nav-links {
              display: none;
              flex-direction: column;
              position: absolute;
              top: 60px;
              left: 0;
              background: white;
              width: 100%;
              padding: 10px;
            }

            .nav-links.active {
              display: flex;
            }

            .menu-toggle {
              display: block;
            }
          }
        `}
      </style>
    </>
  );
}
