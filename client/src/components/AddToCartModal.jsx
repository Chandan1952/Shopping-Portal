import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const AddToCartModal = ({ product, onClose }) => {
  // ✅ Move hooks before the return
  const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const availableSizes = product?.sizes?.length ? product.sizes : allSizes;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
  const [loading, setLoading] = useState(false);

  // ✅ Return null only after hooks
  if (!product) return null;

  const imageUrl = product.image
    ? product.image.startsWith("/uploads/")
      ? `https://shopping-portal-backend.onrender.com${product.image}`
      : product.image
    : "https://via.placeholder.com/150";

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
          <button style={styles.closeButton} onClick={onClose}>×</button>
          <div style={styles.body}>
            <img src={imageUrl} alt={product.name} style={styles.productImage} />
            <h3 style={styles.productName}>{product.name}</h3>
            <p style={styles.price}>₹{product.price}</p>

            <div style={styles.sizeContainer}>
              <label style={styles.sizeLabel}>Size:</label>
              <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} style={styles.sizeSelect}>
                {availableSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div style={styles.quantityContainer}>
              <button style={styles.quantityButton} onClick={decreaseQuantity}>-</button>
              <span style={styles.quantity}>{quantity}</span>
              <button style={styles.quantityButton} onClick={increaseQuantity}>+</button>
            </div>

            <button style={styles.addToCartButton} onClick={handleAddToCart} disabled={loading}>
              {loading ? "Adding..." : "🛒 Add to Cart"}
            </button>
            <button style={styles.cancelButton} onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
// Inline Styles
const styles = {
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", padding: "25px", borderRadius: "12px", width: "380px", textAlign: "center", position: "relative", boxShadow: "0px 6px 12px rgba(0,0,0,0.15)" },
  closeButton: { position: "absolute", top: "12px", right: "12px", background: "transparent", border: "none", fontSize: "24px", fontWeight: "bold", cursor: "pointer", color: "#555" },
  body: { display: "flex", flexDirection: "column", alignItems: "center" },
  productImage: { width: "150px", height: "150px", objectFit: "cover", borderRadius: "10px" },
  productName: { fontSize: "20px", fontWeight: "bold", color: "#333", marginTop: "12px" },
  price: { fontSize: "18px", fontWeight: "bold", color: "green", marginTop: "8px" },
  sizeContainer: { display: "flex", alignItems: "center", justifyContent: "center", marginTop: "12px" },
  sizeLabel: { marginRight: "10px", fontSize: "16px", fontWeight: "bold" },
  sizeSelect: { padding: "6px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" },
  quantityContainer: { display: "flex", alignItems: "center", justifyContent: "center", marginTop: "12px" },
  quantityButton: { background: "#ddd", border: "none", padding: "8px 12px", cursor: "pointer", fontSize: "18px", borderRadius: "5px", margin: "0 8px", fontWeight: "bold" },
  quantity: { fontSize: "18px", fontWeight: "bold", minWidth: "30px", textAlign: "center" },
  addToCartButton: { background: "#ff3f6c", color: "white", padding: "12px", border: "none", cursor: "pointer", width: "100%", marginTop: "15px", borderRadius: "6px", fontSize: "16px", fontWeight: "bold" },
  cancelButton: { background: "#777", color: "white", padding: "10px", border: "none", cursor: "pointer", width: "100%", marginTop: "10px", borderRadius: "6px", fontSize: "16px", fontWeight: "bold" },
};

export default AddToCartModal;
