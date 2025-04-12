import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://shopping-portal-backend.onrender.com/api/products/${id}`);
        if (!response.ok) throw new Error("Product not found");

        const data = await response.json();
        setProduct(data);
        if (data.sizes?.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || quantity < 1 || (product.sizes?.length > 0 && !selectedSize)) {
      return alert("❌ Please complete all required selections.");
    }

    try {
      const cartItem = {
        productId: product._id || product.id,
        name: product.name,
        brand: product.brand || "Unknown",
        price: product.price,
        originalPrice: product.originalPrice || null,
        discount: product.discount || 0,
        quantity,
        size: selectedSize || "N/A",
        image: product.image,
      };

      const response = await fetch("https://shopping-portal-backend.onrender.com/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) alert("✅ Product added to cart!");
      else alert(`❌ Failed to add: ${data.message || "Unknown error"}`);
    } catch (error) {
      alert("❌ Error adding to cart. Try again.");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await fetch("https://shopping-portal-backend.onrender.com/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || null,
          discount: product.discount || 0,
          image: product.image,
          size: selectedSize,
        }),
      });

      if (!response.ok) throw new Error("Failed to add to wishlist");
      alert("❤️ Added to Wishlist!");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading product details...</p>;
  if (error) return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

  const imageUrl = product.image?.startsWith("/uploads/")
    ? `https://shopping-portal-backend.onrender.com${product.image}`
    : product.image || "https://via.placeholder.com/240";

  const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const availableSizes = product?.sizes?.length ? product.sizes : allSizes;

  return (
    <>
      <Header />
      <div style={{ maxWidth: "1200px", margin: "auto", padding: "40px 20px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
        {/* Product Image */}
        <div style={{ flex: "1", minWidth: "300px", display: "flex", justifyContent: "center" }}>
          <img
            src={imageUrl}
            alt={product.name}
            style={{
              width: "100%",
              maxWidth: "450px",
              height: "auto",
              borderRadius: "10px",
              objectFit: "contain",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          />
        </div>

        {/* Product Info */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "10px" }}>{product.name}</h2>
          <p style={{ marginBottom: "20px", color: "#444" }}>{product.description}</p>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{ fontSize: "22px", fontWeight: "bold", color: "#28a745" }}>Rs. {product.price}</span>
            {product.originalPrice && (
              <span style={{ textDecoration: "line-through", color: "#888" }}>Rs. {product.originalPrice}</span>
            )}
            {product.discount > 0 && (
              <span style={{ color: "red", fontWeight: "600" }}>({product.discount}% OFF)</span>
            )}
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", marginRight: "10px" }}>Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: "60px", padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>

          {/* Size */}
          {availableSizes.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Select Size:</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: selectedSize === size ? "2px solid #ff3f6c" : "1px solid #ccc",
                      backgroundColor: selectedSize === size ? "#ff3f6c" : "#fff",
                      color: selectedSize === size ? "#fff" : "#333",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out"
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                padding: "14px",
                backgroundColor: "#ff3f6c",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background-color 0.3s"
              }}
            >
              <FaShoppingCart /> Add to Cart
            </button>

            <button
              onClick={handleAddToWishlist}
              style={{
                flex: 1,
                padding: "14px",
                backgroundColor: "#fff",
                color: "#ff3f6c",
                fontSize: "16px",
                fontWeight: "bold",
                border: "2px solid #ff3f6c",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.3s"
              }}
            >
              <FaHeart /> Wishlist
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
