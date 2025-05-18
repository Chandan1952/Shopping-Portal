import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FaUser, FaLock, FaSignOutAlt, FaBox, FaCreditCard, 
  FaWallet, FaQuestionCircle, FaStar, FaHeart 
} from "react-icons/fa";
import { RiCoupon3Line } from "react-icons/ri";
import { MdPayment, MdLocationOn } from "react-icons/md";

const UserSidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const menuItems = [
    { path: "/edit-profile", icon: <FaUser />, label: "Profile Settings" },
    { path: "/update-password", icon: <FaLock />, label: "Update Password" },
    { path: "/order-status/:orderId", icon: <FaBox />, label: "My Orders" },
    { path: "/returns", icon: <FaBox />, label: "Returns & Cancellations" },
    { path: "/wishlist", icon: <FaHeart />, label: "My Wishlist" },
    { path: "/myntra-credit", icon: <FaCreditCard />, label: "Myntra Credit" },
    { path: "/myncash", icon: <FaWallet />, label: "MynCash" },
    { path: "/coupons", icon: <RiCoupon3Line />, label: "Coupons" },
    { path: "/payments", icon: <MdPayment />, label: "Saved Cards & UPI" },
    { path: "/addresses", icon: <MdLocationOn />, label: "Saved Addresses" },
    { path: "/reviews", icon: <FaStar />, label: "My Reviews" },
    { path: "/help", icon: <FaQuestionCircle />, label: "Help Center" },
  ];

  return (
    <div className="user-sidebar">
      <div className="sidebar-header">
        <h3>My Account</h3>
      </div>
      
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li 
            key={item.path}
            className={`menu-item ${activeItem === item.path ? 'active' : ''}`}
            onClick={() => setActiveItem(item.path)}
          >
            <Link to={item.path} className="menu-link">
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              <span className="menu-arrow">›</span>
            </Link>
          </li>
        ))}
        
        <li className="menu-item sign-out">
          <Link to="/logout" className="menu-link">
            <span className="menu-icon"><FaSignOutAlt /></span>
            <span className="menu-label">Sign Out</span>
            <span className="menu-arrow">›</span>
          </Link>
        </li>
      </ul>
      
      <div className="sidebar-promo">
        <div className="promo-banner">
          <h4>Myntra Insider</h4>
          <p>Unlock exclusive benefits</p>
          <button className="promo-button">Explore Now</button>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;

// CSS Styles
const styles = `
  .user-sidebar {
    width: 280px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .sidebar-header {
    padding: 20px;
    background: linear-gradient(135deg, #ff3f6c, #ff6b81);
    color: white;
  }
  
  .sidebar-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
  
  .sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .menu-item {
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.2s ease;
  }
  
  .menu-item:hover {
    background-color: #f9f9f9;
  }
  
  .menu-item.active {
    background-color: #fff4f6;
    border-left: 4px solid #ff3f6c;
  }
  
  .menu-item.active .menu-link {
    color: #ff3f6c;
  }
  
  .menu-item.active .menu-icon {
    color: #ff3f6c;
  }
  
  .menu-link {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    text-decoration: none;
    color: #333;
    font-size: 14px;
    font-weight: 500;
  }
  
  .menu-icon {
    margin-right: 12px;
    color: #666;
    font-size: 16px;
    width: 20px;
    text-align: center;
  }
  
  .menu-label {
    flex: 1;
  }
  
  .menu-arrow {
    color: #999;
    font-size: 16px;
    font-weight: bold;
  }
  
  .menu-item.sign-out {
    border-top: 1px solid #ffebee;
    margin-top: 10px;
  }
  
  .menu-item.sign-out .menu-link {
    color: #ff3f6c;
  }
  
  .menu-item.sign-out .menu-icon {
    color: #ff3f6c;
  }
  
  .menu-item.sign-out:hover {
    background-color: #ffebee;
  }
  
  .sidebar-promo {
    padding: 20px;
    background-color: #f9f9f9;
  }
  
  .promo-banner {
    background: linear-gradient(135deg, #4a00e0, #8e2de2);
    color: white;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
  }
  
  .promo-banner h4 {
    margin: 0 0 5px 0;
    font-size: 16px;
  }
  
  .promo-banner p {
    margin: 0 0 15px 0;
    font-size: 13px;
    opacity: 0.9;
  }
  
  .promo-button {
    background: white;
    color: #4a00e0;
    border: none;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .promo-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    .user-sidebar {
      width: 100%;
      border-radius: 0;
    }
    
    .sidebar-menu {
      display: flex;
      flex-wrap: wrap;
    }
    
    .menu-item {
      width: 50%;
      border-right: 1px solid #f0f0f0;
    }
    
    .menu-item.active {
      border-left: none;
      border-bottom: 2px solid #ff3f6c;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
