import React, { useEffect, useState } from "react";
import axios from "axios";

const styles = {
  section: {
    margin: "30px 0",
    padding: "20px",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    padding: "20px",
  },
  categoryCard: {
    position: "relative",
    textAlign: "center",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out",
  },
  categoryImg: {
    width: "100%",
    borderRadius: "8px",
    transition: "transform 0.3s ease-in-out",
  },
  overlay: {
    position: "absolute",
    bottom: "0",
    width: "100%",
    background: "rgba(255, 0, 0, 0.8)",
    color: "#fff",
    padding: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "opacity 0.3s ease-in-out",
  },
};

export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    axios
      .get("https://shopping-portal-backend.onrender.com/categories") // Fetch from backend
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div style={styles.section}>
      <h2 style={styles.title}>SHOP BY CATEGORY</h2>
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
                opacity: hovered === category._id ? 1 : 0.8,
              }}
            >
              {category.title} <br /> {category.discount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
