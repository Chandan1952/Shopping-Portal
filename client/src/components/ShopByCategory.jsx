import React, { useEffect, useState } from "react";
import axios from "axios";

const styles = {
  section: {
    margin: "30px 0",
    padding: "20px",
    backgroundColor: "#f8f8f8",
    textAlign: "center",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    padding: "20px",
  },
  categoryCard: {
    position: "relative",
    textAlign: "center",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease-in-out",
    transform: "scale(1)",
  },
  categoryImg: {
    width: "100%",
    height: "100%",  // Ensure the image takes up the entire card height
    objectFit: "cover", // Makes the image cover the whole area of the card without distortion
    transition: "transform 0.3s ease-in-out",
  },
  overlay: {
    position: "absolute",
    bottom: "0",
    width: "100%",
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(255, 0, 0, 0.8) 100%)",
    color: "#fff",
    padding: "15px",
    fontSize: "18px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transition: "opacity 0.3s ease-in-out",
    opacity: 0.85,
  },
  categoryTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  categoryDiscount: {
    fontSize: "16px",
    fontWeight: "500",
  },
};

export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    axios
      .get("https://shopping-portal-backend.onrender.com/categories") // Fetch categories from backend
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div style={styles.section}>
      <h2 style={styles.title}>Shop by Category</h2>
      <div style={styles.categoryGrid}>
        {categories.map((category) => (
          <div
            key={category._id}
            style={{
              ...styles.categoryCard,
              transform: hovered === category._id ? "scale(1.05)" : "scale(1)",
            }}
            onMouseEnter={() => setHovered(category._id)}
            onMouseLeave={() => setHovered(null)}
          >
            <img
              src={`https://shopping-portal-backend.onrender.com${category.img}`}
              alt={category.title}
              style={{
                ...styles.categoryImg,
                transform: hovered === category._id ? "scale(1.1)" : "scale(1)",
              }}
            />
            <div
              style={{
                ...styles.overlay,
                opacity: hovered === category._id ? 1 : 0.85,
              }}
            >
              <div style={styles.categoryTitle}>{category.title}</div>
              <div style={styles.categoryDiscount}>{category.discount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
