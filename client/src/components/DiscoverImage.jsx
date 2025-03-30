import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function BrandsSection() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("https://shopping-portal-backend.onrender.com/api/brands");
        setBrands(response.data);
      } catch (err) {
        setError("Failed to load brands");
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  if (loading) return <p>Loading brands...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <BrandSection title="Men Fashion" brands={brands.filter((b) => b.category === "men")} onTitleClick={() => handleCategoryClick("Men")} />
      <BrandSection title="Women Fashion" brands={brands.filter((b) => b.category === "women")} onTitleClick={() => handleCategoryClick("Women")} />
      <BrandSection title="Kids Fashion" brands={brands.filter((b) => b.category === "kids")} onTitleClick={() => handleCategoryClick("Kids")} />
    </div>
  );
}

function BrandSection({ title, brands, onTitleClick }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.title} onClick={onTitleClick}>{title}</h2>
      <div style={styles.brandList}>
        {brands.length > 0 ? brands.map((brand) => <BrandCard key={brand.id} brand={brand} />) : <p style={styles.noBrands}>No brands available</p>}
      </div>
    </div>
  );
}

function BrandCard({ brand }) {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products?category=${encodeURIComponent(brand.category)}&brand=${encodeURIComponent(brand.brand)}`);
  };

  return (
    <div
      style={{
        ...styles.brandCard,
        transform: hover ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.3s ease-in-out",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClick}
    >
      {brand?.img ? (
        <img
          src={`https://shopping-portal-backend.onrender.com${brand.img}`}
          alt={brand?.brand || "Brand"}
          style={styles.brandImg}
          loading="lazy"
        />
      ) : (
        <p style={styles.noImage}>No Image</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
    cursor: "pointer",
    textAlign: "left",
    color: "#333",
    transition: "color 0.3s ease",
  },
  brandList: {
    display: "flex",
    gap: "15px",
    overflowX: "auto",
    paddingBottom: "10px",
    scrollbarWidth: "none",
    WebkitOverflowScrolling: "touch",
  },
  brandCard: {
    minWidth: "180px",
    height: "120px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#fff",
    transition: "transform 0.3s ease-in-out",
    flexShrink: 0, // Prevents flex items from shrinking on small screens
  },
  brandImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: "5px",
  },
  noImage: {
    textAlign: "center",
    padding: "10px",
    fontSize: "14px",
    color: "#888",
  },
  noBrands: {
    fontSize: "16px",
    color: "#888",
    padding: "10px",
  },
};

export default BrandsSection;
