import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const AddToCartModal = ({ product, onClose }) => {
  const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const availableSizes = product?.sizes?.length ? product.sizes : allSizes;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const imageUrl = product.image
    ? product.image.startsWith("/uploads/")
      ? `https://shopping-portal-backend.onrender.com${product.image}`
      : product.image
    : "https://via.placeholder.com/300";

  const increaseQuantity = () => setQuantity((prev) => Math.min(prev + 1, 10));
  const decreaseQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://shopping-portal-backend.onrender.com/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id || product.id,
          name: product.name,
          brand: product.brand || "Unknown",
          price: product.price,
          quantity,
          size: selectedSize,
          discount: product.discount || 0,
          image: product.image,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Product added to cart!");
        onClose();
      } else {
        alert(`❌ Failed to add: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      alert("❌ Error adding to cart. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <button style={styles.closeButton} onClick={onClose}>
            <span style={styles.closeIcon}>×</span>
          </button>
          
          <div style={styles.imageContainer}>
            <img 
              src={imageUrl} 
              alt={product.name} 
              style={styles.productImage} 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://via.placeholder.com/300";
              }}
            />
          </div>
          
          <div style={styles.content}>
            <h3 style={styles.productName}>{product.name}</h3>
            <div style={styles.priceContainer}>
              <span style={styles.price}>₹{product.price.toLocaleString()}</span>
              {product.discount > 0 && (
                <span style={styles.originalPrice}>₹{(product.price / (1 - product.discount/100)).toFixed(0)}</span>
              )}
              {product.discount > 0 && (
                <span style={styles.discountTag}>{product.discount}% OFF</span>
              )}
            </div>
            
            <div style={styles.sizeContainer}>
              <h4 style={styles.sectionTitle}>SELECT SIZE</h4>
              <div style={styles.sizeGrid}>
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    style={{
                      ...styles.sizeButton,
                      ...(selectedSize === size ? styles.sizeButtonActive : {})
                    }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.quantityContainer}>
              <h4 style={styles.sectionTitle}>QUANTITY</h4>
              <div style={styles.quantityControls}>
                <button 
                  style={styles.quantityButton} 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span style={styles.quantity}>{quantity}</span>
                <button 
                  style={styles.quantityButton} 
                  onClick={increaseQuantity}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button 
                style={styles.addToCartButton} 
                onClick={handleAddToCart} 
                disabled={loading}
              >
                {loading ? (
                  <span style={styles.buttonLoading}>
                    <span style={styles.spinner}></span> Adding...
                  </span>
                ) : (
                  "🛒 ADD TO CART"
                )}
              </button>
              <button 
                style={styles.wishlistButton} 
                onClick={onClose}
              >
                ♡ WISHLIST
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Enhanced inline styles with modern UI/UX
const styles = {
  overlay: { 
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%", 
    background: "rgba(0,0,0,0.7)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    zIndex: 1000,
    backdropFilter: "blur(5px)",
  },
  modal: { 
    background: "#fff", 
    borderRadius: "16px", 
    width: "420px", 
    maxWidth: "90vw",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative", 
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  closeButton: { 
    position: "absolute", 
    top: "16px", 
    right: "16px", 
    background: "transparent", 
    border: "none", 
    fontSize: "24px", 
    fontWeight: "bold", 
    cursor: "pointer", 
    color: "#666",
    zIndex: 10,
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.2s",
    ':hover': {
      background: "#f5f5f5",
      color: "#333",
    }
  },
  closeIcon: {
    lineHeight: 1,
    marginBottom: "4px",
  },
  imageContainer: {
    width: "100%",
    height: "280px",
    overflow: "hidden",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    position: "relative",
    background: "#f8f8f8",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s",
    ':hover': {
      transform: "scale(1.05)",
    }
  },
  content: {
    padding: "24px",
  },
  productName: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#333",
    margin: "0 0 8px 0",
    textAlign: "left",
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },
  price: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#2e8b57",
  },
  originalPrice: {
    fontSize: "16px",
    color: "#999",
    textDecoration: "line-through",
  },
  discountTag: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#ff3f6c",
    background: "#ffecef",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#666",
    margin: "0 0 12px 0",
    textAlign: "left",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  sizeContainer: {
    margin: "24px 0",
  },
  sizeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
  },
  sizeButton: {
    padding: "10px",
    border: "1px solid #ddd",
    background: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s",
    ':hover': {
      borderColor: "#999",
    }
  },
  sizeButtonActive: {
    border: "2px solid #2e8b57",
    background: "#f0fff4",
    color: "#2e8b57",
    fontWeight: "bold",
  },
  quantityContainer: {
    margin: "24px 0",
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  quantityButton: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    ':hover': {
      background: "#f5f5f5",
    },
    ':disabled': {
      opacity: 0.5,
      cursor: "not-allowed",
    }
  },
  quantity: {
    fontSize: "18px",
    fontWeight: "bold",
    minWidth: "30px",
    textAlign: "center",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "30px",
  },
  addToCartButton: {
    background: "#2e8b57",
    color: "white",
    padding: "14px",
    border: "none",
    cursor: "pointer",
    width: "100%",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "all 0.2s",
    ':hover': {
      background: "#3cb371",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(46, 139, 87, 0.3)",
    },
    ':disabled': {
      background: "#cccccc",
      transform: "none",
      boxShadow: "none",
    }
  },
  wishlistButton: {
    background: "transparent",
    color: "#666",
    padding: "14px",
    border: "1px solid #ddd",
    cursor: "pointer",
    width: "100%",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "all 0.2s",
    ':hover': {
      background: "#f5f5f5",
      borderColor: "#999",
    }
  },
  buttonLoading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderRadius: "50%",
    borderTopColor: "#fff",
    animation: "spin 1s ease-in-out infinite",
  },
  '@keyframes spin': {
    to: { transform: "rotate(360deg)" }
  }
};

export default AddToCartModal;
