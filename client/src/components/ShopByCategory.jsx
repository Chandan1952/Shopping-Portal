import React, { useEffect, useState } from "react";
import axios from "axios";

const styles = {
  section: {
    margin: "30px auto",
    padding: "20px",
    backgroundColor: "#fff",
    textAlign: "center",
    maxWidth: "1200px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    justifyContent: "center",
    padding: "10px",
  },
  categoryCard: {
    position: "relative",
    textAlign: "center",
    borderRadius: "10px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
  },
  categoryImg: {
    width: "100%",
    height: "220px",
    borderRadius: "10px",
    objectFit: "cover",
    transition: "transform 0.3s ease-in-out",
  },
  overlay: {
    position: "absolute",
    bottom: "0",
    width: "100%",
    background: "rgba(255, 0, 0, 0.8)",
    color: "#fff",
    padding: "12px",
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
      .get("https://shopping-portal-backend.onrender.com/categories")
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
            onClick={() => console.log(`Navigate to ${category.title}`)}
          >
            <img
              src={`https://shopping-portal-backend.onrender.com${category.img}`}
              alt={category.title}
              loading="lazy"
              style={{
                ...styles.categoryImg,
                transform: hovered === category._id ? "scale(1.1)" : "scale(1)",
              }}
            />
            <div
              style={{
                ...styles.overlay,
                opacity: hovered === category._id ? 1 : 0.9,
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
