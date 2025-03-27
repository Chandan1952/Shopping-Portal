import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaSignOutAlt, FaCar, FaComment } from "react-icons/fa";

const styles = {
  sidebar: {
    width: "250px",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },
  sidebarList: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  },
  sidebarItem: {
    padding: "12px 15px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "background 0.3s ease",
  },
  link: {
    textDecoration: "none",
    color: "#333",
    flex: 1,
  },
  sidebarItemHover: {
    background: "#f5f5f5",
  },
  signOut: {
    color: "red",
    fontWeight: "bold",
  },
};

export default function UserSidebar() {
  return (
    <aside style={styles.sidebar}>
      <ul style={styles.sidebarList}>
        <li style={styles.sidebarItem} onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          <FaUser />
          <Link to="/edit-profile" style={styles.link}>Profile Settings</Link>
        </li>
        <li style={styles.sidebarItem} onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          <FaLock />
          <Link to="/update-password" style={styles.link}>Update Password</Link>
        </li>
        <li style={styles.sidebarItem} onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          <FaCar />
          <Link to="/order-return" style={styles.link}>Orders & Returns</Link>
        </li>
        <li style={styles.sidebarItem} onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          <FaComment />
          <Link to="/post-testimonial" style={styles.link}>Myntra Credit</Link>
        </li>
        <li style={styles.sidebarItem} onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          <FaUser />
          <Link to="/my-testimonial" style={styles.link}>MynCash</Link>
        </li>
        <li style={{ ...styles.sidebarItem, ...styles.signOut }} onMouseEnter={(e) => e.currentTarget.style.background = "#ffe5e5"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          <FaSignOutAlt />
          <Link to="/logout" style={styles.link}>Sign Out</Link>
        </li>
      </ul>
    </aside>
  );
}
