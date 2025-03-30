import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from "react-icons/fa";
import AuthModal from "./AuthModal";

export default function Header() {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://shopping-portal-backend.onrender.com/api/user", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          console.error("Error fetching user:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  // Logout Function
  const handleLogout = async () => {
    try {
      const response = await fetch("https://shopping-portal-backend.onrender.com/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        setUser(null);
        navigate("/");
        window.location.reload(); // Ensure UI refresh
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Category Navigation
  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.toLowerCase()}`);
    setMobileMenuOpen(false); // Close mobile menu on selection
  };

  return (
    <>
      <header className="header">
        {/* Logo */}
        <Link to="/" className="logo">Myntra</Link>

        {/* Mobile Menu Button */}
        <div className="menu-toggle" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          ☰
        </div>

        {/* Navigation Links */}
        <nav className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          <span onClick={() => handleCategoryClick("Mens")}>Men</span>
          <span onClick={() => handleCategoryClick("Women")}>Women</span>
          <span onClick={() => handleCategoryClick("Kids")}>Kids</span>
          <span onClick={() => handleCategoryClick("Home & Living")}>Home & Living</span>
        </nav>

        {/* Search Bar */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search for products, brands, and more" className="search-input" />
        </div>

        {/* Icons - Profile, Wishlist, Cart */}
        <div className="icons-container">
          {/* Profile Dropdown */}
          <div className="icon profile-container" ref={dropdownRef} onClick={() => setProfileDropdown(!profileDropdown)}>
            <FaUser />
            {profileDropdown && (
              <div className="profile-dropdown">
                {user ? (
                  <>
                    <div className="dropdown-item bold">Welcome, {user.fullName}</div>
                    <div className="dropdown-item">📞 {user.phone}</div>
                    <hr />
                    <Link to="/edit-profile" className="dropdown-item">Profile</Link>
                    <Link to="/order-return" className="dropdown-item">Orders</Link>
                    <Link to="/wishlist" className="dropdown-item">Wishlist</Link>
                    <Link to="/gift-cards" className="dropdown-item">Gift Cards</Link>
                    <Link to="/contact" className="dropdown-item">Contact Us</Link>
                    <Link to="/myntra-insider" className="dropdown-item highlight">Myntra Insider</Link>
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

          {/* Wishlist and Cart */}
          <Link to="/wishlist" className="cart-link">
            <FaHeart className="icon" />
          </Link>

          <Link to="/card-list" className="cart-link">
            <FaShoppingBag className="icon" />
          </Link>
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

          .menu-toggle {
            display: none;
            font-size: 24px;
            cursor: pointer;
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

          .search-container {
            position: relative;
            width: 30%;
          }

          .search-input {
            width: 100%;
            padding: 8px 10px 8px 35px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }

          .search-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #777;
            font-size: 16px;
          }

          .icons-container {
            display: flex;
            gap: 20px;
            font-size: 22px;
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
            display: flex;
            flex-direction: column;
            z-index: 100;
          }

          .logout-button {
            color: white;
            background: red;
            width: 100%;
            padding: 10px;
            cursor: pointer;
          }

          @media (max-width: 768px) {
            .menu-toggle {
              display: block;
            }

            .nav-links {
              display: none;
              flex-direction: column;
              width: 100%;
              text-align: center;
            }

            .nav-links.active {
              display: flex;
            }
          }
        `}
      </style>
    </>
  );
}
