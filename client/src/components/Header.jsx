import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from "react-icons/fa";
import AuthModal from "./AuthModal";

export default function Header() {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();


useEffect(() => {
const fetchUser = async () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("Loaded from storage:", JSON.parse(storedUser));
      setUser(JSON.parse(storedUser));
      return;
    }

    const response = await fetch("https://shopping-portal-backend.onrender.com/api/user", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched user from API:", data);

    if (data) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    }
  } catch (error) {
    console.error("Failed to fetch user:", error.message);
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
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      setUser(null);
      navigate("/", { replace: true });
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
    navigate(`/products?category=${category.toLowerCase()}`); // ✅ Ensure lowercase query
  };


  return (
    <>
      <header className="header">
        {/* Logo */}
        <Link to="/" className="logo">Myntra</Link>


        {/* Navigation Links */}
{/*         <nav className="nav-links">
          <span onClick={() => handleCategoryClick("Mens")}>Men</span>
          <span onClick={() => handleCategoryClick("Women")}>Women</span>
          <span onClick={() => handleCategoryClick("Kids")}>Kids</span>
          <span onClick={() => handleCategoryClick("Home & Living")}>Home & Living</span>
        </nav> */}

          <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
  <span onClick={() => handleCategoryClick("Mens")}>Men</span>
  <span onClick={() => handleCategoryClick("Women")}>Women</span>
  <span onClick={() => handleCategoryClick("Kids")}>Kids</span>
  <span onClick={() => handleCategoryClick("Home & Living")}>Home & Living</span>
</nav>
<button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>


        {/* Search Bar */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search for products, brands, and more" className="search-input" />
        </div>

        {/* Icons - Profile, Wishlist, Cart */}
        {/* Icons */}
        <div className="icons-container">
          {/* Profile Dropdown with Hover Effect */}
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
                   <div className="dropdown-item">📞 {user.phone || "N/A"}</div>
                    <hr />
                    <Link to="/edit-profile" className="dropdown-item">Profile</Link>
                    <Link to="/order-return" className="dropdown-item">Orders</Link>
                    <Link to="/wishlist" className="dropdown-item">Wishlist</Link>
                    <Link to="/gift-cards" className="dropdown-item">Gift Cards</Link>
                    <Link to="/contact" className="dropdown-item">Contact Us</Link>
                    <Link to="/myntra-insider" className="dropdown-item highlight">Myntra Insider</Link>
                    <hr />
                    <Link to="/myntra-credit" className="dropdown-item">Myntra Credit</Link>
                    <Link to="/coupons" className="dropdown-item">Coupons</Link>
                    <Link to="/saved-cards" className="dropdown-item">Saved Cards</Link>
                    <Link to="/saved-vpa" className="dropdown-item">Saved VPA</Link>
                    <Link to="/saved-addresses" className="dropdown-item">Saved Addresses</Link>
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

          {/* Wishlist and Cart Icons */}
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

          .nav-links {
            display: flex;
            gap: 20px;
            color: #333;
            font-weight: bold;
            transition: color 0.3s ease;
            cursor: pointer;
          }
           .nav-links span:hover {
            color: #ff3f6c;
          }

       /* Mobile Navigation Styles */
@media (max-width: 768px) {
  .nav-links {
    display: none; /* Hide by default */
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    padding: 10px 0;
    z-index: 1000;
    text-align: center;
  }

 .nav-links.active {
    display: flex; /* Show when menu is open */
  }

  .nav-links span {
    padding: 12px;
    font-size: 18px;
    border-bottom: 1px solid #ddd;
  }

  .menu-toggle {
    display: block;
    font-size: 24px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 10px;
    color: #333;
  }

  .menu-toggle:hover {
    color: #ff3f6c;
  }
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
            position: relative;
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
            display: flex;
            flex-direction: column;
            z-index: 100;
            animation: fadeIn 0.2s ease-in-out;
          }

          .dropdown-item {
            padding: 5px 15px;
            color: #555;
            text-decoration: none;
            transition: background 0.2s;
            font-size: 12px;
          }

          .dropdown-item:hover {
            background-color: #f2f2f2;
          }

          .bold {
            font-weight: bold;
            text-align: center;
          }

          .highlight {
            color: red;
            font-weight: bold;
          }

          .logout-button {
            color: white;
            text-align: center;
            border: none;
            background: red;
            width: 100%;
            padding: 10px;
            cursor: pointer;
          }
          .logout-button:hover{
            color: black;

            } 
          .auth-button {
            width: 100%;
            padding: 10px;
            background-color: #ff3f6c;
            color: white;
            border: none;
            cursor: pointer;
            text-align: center;
            transition: background 0.2s ease-in-out;
          }

          .auth-button:hover {
            background-color: #e7365f;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* General Mobile Styles */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }

  .logo {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .nav-links {
    display: none; /* Hide navigation links by default on mobile */
    flex-direction: column;
    width: 100%;
    text-align: center;
    position: absolute;
    top: 60px;
    left: 0;
    background: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    padding: 10px 0;
  }

  .nav-links.active {
    display: flex; /* Show navigation when active */
  }

  .nav-links span {
    padding: 10px;
    font-size: 18px;
  }

  .menu-toggle {
    display: block;
    font-size: 24px;
    cursor: pointer;
  }

  .search-container {
    width: 90%;
    margin-bottom: 10px;
  }

  .icons-container {
    gap: 10px;
    font-size: 18px;
  }

  .profile-dropdown {
    min-width: 180px;
    right: 50%;
    transform: translateX(50%);
  }
}

/* Tablet View Adjustments */
@media (max-width: 1024px) {
  .search-container {
    width: 60%;
  }
}

          }
        `}
      </style>
    </>
  );
}
