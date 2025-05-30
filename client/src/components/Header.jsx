import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaHeart, FaShoppingBag, FaChevronDown } from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { MdOutlineAccountCircle, MdCardGiftcard, MdContactSupport, MdCreditCard, MdLocalOffer } from "react-icons/md";
import { BsBoxSeam, BsBookmarkHeart, BsHouseDoor } from "react-icons/bs";
import AuthModal from "./AuthModal";

export default function Header() {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://myntra-clone-api.vercel.app/api/user", { credentials: "include" });
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

  const handleLogout = async () => {
    try {
      const response = await fetch("https://shopping-portal-backend.onrender.com/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    navigate(`/products?category=${category.toLowerCase()}`);
  };

  return (
    <>
      {/* Top Notification Bar */}
      <div className="top-notification">
        <p>Summer Sale Live! Get 50% OFF on selected items. <Link to="/summer-sale">Shop Now</Link></p>
      </div>
      
      <header className="header">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-main">Myntra</span>
          <span className="logo-sub">Fashion & Beyond</span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          {["Mens", "Women", "Kids", "Home & Living"].map((category) => (
            <div 
              key={category}
              className={`nav-item ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
              {category === "Home & Living" && <FaChevronDown className="dropdown-arrow" />}
            </div>
          ))}
        </nav>

        {/* Search Bar */}
        <div className={`search-container ${searchFocused ? 'focused' : ''}`}>
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search for products, brands and more" 
            className="search-input"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Icons - Profile, Wishlist, Cart */}
        <div className="icons-container">
          {/* Profile Dropdown */}
          <div
            className="icon-container profile-container"
            ref={dropdownRef}
            onMouseEnter={() => setProfileDropdown(true)}
            onMouseLeave={() => setProfileDropdown(false)}
          >
            <div className="icon-wrapper">
              <FaUser className="icon" />
              <span className="icon-label">Profile</span>
            </div>
            
            {profileDropdown && (
              <div className="profile-dropdown">
                {user ? (
                  <>
                    <div className="dropdown-header">
                      <div className="user-avatar">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <div className="user-name">Hello, {user.fullName}</div>
                        <div className="user-phone">{user.phone}</div>
                      </div>
                    </div>
                    
                    <div className="dropdown-section">
                      <Link to="/edit-profile" className="dropdown-item">
                        <MdOutlineAccountCircle className="item-icon" />
                        <span>Profile</span>
                      </Link>
                      <Link to="/order-status/:orderId" className="dropdown-item">
                        <BsBoxSeam className="item-icon" />
                        <span>Orders</span>
                      </Link>
                      <Link to="/wishlist" className="dropdown-item">
                        <BsBookmarkHeart className="item-icon" />
                        <span>Wishlist</span>
                      </Link>
                    </div>
                    
                    <div className="dropdown-section">
                      <Link to="/gift-cards" className="dropdown-item">
                        <MdCardGiftcard className="item-icon" />
                        <span>Gift Cards</span>
                      </Link>
                      <Link to="/contact" className="dropdown-item">
                        <MdContactSupport className="item-icon" />
                        <span>Contact Us</span>
                      </Link>
                      <Link to="/myntra-insider" className="dropdown-item highlight">
                        <BsHouseDoor className="item-icon" />
                        <span>Myntra Insider</span>
                      </Link>
                    </div>
                    
                    <div className="dropdown-section">
                      <Link to="/myntra-credit" className="dropdown-item">
                        <MdCreditCard className="item-icon" />
                        <span>Myntra Credit</span>
                      </Link>
                      <Link to="/coupons" className="dropdown-item">
                        <MdLocalOffer className="item-icon" />
                        <span>Coupons</span>
                      </Link>
                    </div>
                    
                    <div className="dropdown-footer">
                      <button onClick={handleLogout} className="logout-button">
                        <RiLogoutCircleRLine className="logout-icon" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="auth-section">
                    <p className="welcome-text">Welcome to Myntra</p>
                    <p className="auth-subtext">To access your account</p>
                    <button className="auth-button" onClick={() => setAuthOpen(true)}>
                      Login / Register
                    </button>
                    <div className="auth-benefits">
                      <div className="benefit-item">✓ Get exclusive rewards</div>
                      <div className="benefit-item">✓ Track your orders</div>
                      <div className="benefit-item">✓ Faster checkout</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />

          {/* Wishlist */}
          <Link to="/wishlist" className="icon-container">
            <div className="icon-wrapper">
              <FaHeart className="icon" />
              <span className="icon-label">Wishlist</span>
            </div>
          </Link>

          {/* Bag */}
          <Link to="/card-list" className="icon-container">
            <div className="icon-wrapper">
              <FaShoppingBag className="icon" />
              <span className="icon-label">Bag</span>
              <span className="cart-badge">0</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Styles */}
      <style>
        {`
          /* Top Notification Bar */
          .top-notification {
            background-color: #ff3f6c;
            color: white;
            text-align: center;
            padding: 8px 0;
            font-size: 14px;
          }
          
          .top-notification a {
            color: white;
            text-decoration: underline;
            font-weight: bold;
            margin-left: 5px;
          }

          /* Header */
          .header {
            background-color: #ffffff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            padding: 12px 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1000;
          }

          /* Logo */
          .logo {
            display: flex;
            flex-direction: column;
            text-decoration: none;
          }
          
          .logo-main {
            color: #ff3f6c;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
          }
          
          .logo-sub {
            color: #666;
            font-size: 10px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: -2px;
          }

          /* Navigation Links */
          .nav-links {
            display: flex;
            gap: 25px;
          }
          
          .nav-item {
            color: #333;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px 0;
            position: relative;
            transition: all 0.2s ease;
          }
          
          .nav-item:hover {
            color: #ff3f6c;
          }
          
          .nav-item.active {
            color: #ff3f6c;
          }
          
          .nav-item.active:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: #ff3f6c;
            border-radius: 3px 3px 0 0;
          }
          
          .dropdown-arrow {
            font-size: 10px;
            margin-left: 2px;
            transition: transform 0.2s ease;
          }
          
          .nav-item:hover .dropdown-arrow {
            transform: translateY(1px);
          }

          /* Search Bar */
          .search-container {
            position: relative;
            width: 30%;
            min-width: 300px;
            transition: all 0.3s ease;
          }
          
          .search-container.focused {
            box-shadow: 0 0 0 2px rgba(255, 63, 108, 0.2);
            border-radius: 4px;
          }
          
          .search-input {
            width: 100%;
            padding: 12px 15px 12px 40px;
            border: 1px solid #f5f5f6;
            border-radius: 4px;
            outline: none;
            font-size: 14px;
            background-color: #f5f5f6;
            transition: all 0.3s ease;
          }
          
          .search-input:focus {
            background-color: white;
            border-color: #ff3f6c;
          }
          
          .search-input::placeholder {
            color: #9c9c9c;
          }
          
          .search-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #9c9c9c;
            font-size: 14px;
          }
          
          .search-container.focused .search-icon {
            color: #ff3f6c;
          }

          /* Icons Container */
          .icons-container {
            display: flex;
            gap: 25px;
          }
          
          .icon-container {
            position: relative;
          }
          
          .icon-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
          }
          
          .icon {
            font-size: 18px;
            color: #282c3f;
            transition: color 0.2s ease;
          }
          
          .icon-label {
            font-size: 12px;
            font-weight: 500;
            color: #282c3f;
            margin-top: 2px;
          }
          
          .icon-container:hover .icon,
          .icon-container:hover .icon-label {
            color: #ff3f6c;
          }
          
          .cart-badge {
            position: absolute;
            top: -5px;
            right: 0;
            background-color: #ff3f6c;
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
          }

          /* Profile Dropdown */
          .profile-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background-color: #fff;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            border-radius: 6px;
            width: 280px;
            padding: 15px 0;
            display: flex;
            flex-direction: column;
            z-index: 1000;
            animation: fadeIn 0.2s ease-out;
          }
          
          .dropdown-header {
            display: flex;
            align-items: center;
            padding: 0 20px 15px;
            border-bottom: 1px solid #f0f0f0;
            margin-bottom: 10px;
          }
          
          .user-avatar {
            width: 40px;
            height: 40px;
            background-color: #ff3f6c;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 12px;
          }
          
          .user-info {
            display: flex;
            flex-direction: column;
          }
          
          .user-name {
            font-weight: 600;
            font-size: 14px;
          }
          
          .user-phone {
            font-size: 12px;
            color: #666;
          }
          
          .dropdown-section {
            padding: 5px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          
          .dropdown-item {
            display: flex;
            align-items: center;
            padding: 10px 20px;
            color: #282c3f;
            text-decoration: none;
            font-size: 13px;
            transition: background 0.2s;
          }
          
          .dropdown-item:hover {
            background-color: #f9f9f9;
          }
          
          .item-icon {
            margin-right: 12px;
            font-size: 16px;
            color: #666;
          }
          
          .dropdown-item:hover .item-icon {
            color: #ff3f6c;
          }
          
          .highlight {
            color: #ff3f6c;
            font-weight: 600;
          }
          
          .dropdown-footer {
            padding: 15px 20px 0;
          }
          
          .logout-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 10px;
            background-color: #ff3f6c;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: background 0.2s;
          }
          
          .logout-button:hover {
            background-color: #e7365f;
          }
          
          .logout-icon {
            margin-right: 8px;
            font-size: 14px;
          }
          
          /* Auth Section */
          .auth-section {
            padding: 15px 20px;
          }
          
          .welcome-text {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 5px;
          }
          
          .auth-subtext {
            font-size: 13px;
            color: #666;
            margin-bottom: 15px;
          }
          
          .auth-button {
            width: 100%;
            padding: 12px;
            background-color: #ff3f6c;
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
            margin-bottom: 15px;
          }
          
          .auth-button:hover {
            background-color: #e7365f;
          }
          
          .auth-benefits {
            font-size: 12px;
            color: #666;
          }
          
          .benefit-item {
            margin-bottom: 5px;
            display: flex;
            align-items: center;
          }
          
          .benefit-item:before {
            content: '✓';
            color: #ff3f6c;
            margin-right: 8px;
            font-weight: bold;
          }

          /* Animations */
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Responsive */
          @media (max-width: 1200px) {
            .search-container {
              min-width: 250px;
            }
            
            .nav-links {
              gap: 15px;
            }
            
            .icons-container {
              gap: 15px;
            }
          }
          
          @media (max-width: 992px) {
            .header {
              flex-wrap: wrap;
              padding-bottom: 15px;
            }
            
            .logo {
              order: 1;
            }
            
            .icons-container {
              order: 2;
              margin-left: auto;
            }
            
            .search-container {
              order: 4;
              width: 100%;
              margin-top: 15px;
              min-width: auto;
            }
            
            .nav-links {
              order: 3;
              width: 100%;
              justify-content: space-between;
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px solid #f0f0f0;
            }
          }
        `}
      </style>
    </>
  );
}
