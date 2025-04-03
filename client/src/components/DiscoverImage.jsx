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
    const formattedCategory = category.toLowerCase().replace(/ & /g, "%26").replace(/\s/g, "%20");
    navigate(`/products?category=${formattedCategory}`);
  };

  if (loading) return <p>Loading brands...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const menBrands = brands.filter((brand) => brand.category === "men");
  const womenBrands = brands.filter((brand) => brand.category === "women");
  const kidsBrands = brands.filter((brand) => brand.category === "kids");

  return (
    <div>
      <BrandSection title="Men Fashion" brands={menBrands} onTitleClick={() => handleCategoryClick("Men")} />
      <BrandSection title="Women Fashion" brands={womenBrands} onTitleClick={() => handleCategoryClick("Women")} />
      <BrandSection title="Kids Fashion" brands={kidsBrands} onTitleClick={() => handleCategoryClick("Kids")} />
    </div>
  );
}

function BrandSection({ title, brands, onTitleClick }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.title} onClick={onTitleClick}>{title}</h2>
      <div style={styles.brandList}>
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  );
}

function BrandCard({ brand }) {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!brand?.category || !brand?.brand) {
      console.error("Brand data is missing:", brand);
      return;
    }
    navigate(`/products?category=${brand.category.toLowerCase()}&brand=${brand.brand.toLowerCase()}`);
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
      onClick={handleClick} // ✅ Click anywhere on the div to navigate
    >
      {brand?.img ? (
        <img
          src={`https://shopping-portal-backend.onrender.com${brand.img}`}
          alt={brand?.brand || "Brand"}
          style={styles.brandImg}
        />
      ) : (
        <p style={{ textAlign: "center", padding: "10px" }}>No Image</p>
      )}
    </div>
  );
}

const styles = {
  section: {
    margin: "30px 0",
    padding: "20px",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
    cursor: "pointer",
  },
  brandList: {
    display: "flex",
    gap: "15px",
    overflowX: "auto",
    paddingBottom: "10px",
  },
  brandCard: {
    minWidth: "200px",
    textAlign: "center",
    padding: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
  },
  brandImg: {
    width: "100%",
    borderRadius: "5px",
    objectFit: "contain",
  },
}; proper adjust css
