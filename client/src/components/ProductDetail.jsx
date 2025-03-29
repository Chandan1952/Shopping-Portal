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

        if (data.sizes && data.sizes.length > 0) {
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
    if (!product) return alert("❌ Product details not loaded yet.");
    if (!quantity || quantity < 1) return alert("❌ Please enter a valid quantity.");
    if (product.sizes && product.sizes.length > 0 && !selectedSize) return alert("❌ Please select a size.");

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

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const imageUrl = product.image
    ? (product.image.startsWith("/uploads/") ? `https://shopping-portal-backend.onrender.com${product.image}` : product.image)
    : "https://via.placeholder.com/240";

  const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const availableSizes = product?.sizes?.length ? product.sizes : allSizes;

  return (
    <>
      <Header />
      <div style={{ maxWidth: "1100px", margin: "auto", padding: "20px", display: "flex", gap: "20px" }}>
        {/* Left: Product Image */}
        <div style={{ flex: "1", display: "flex", justifyContent: "center" }}>
          <img
            src={imageUrl}
            alt={product.name}
            style={{ width: "100%", maxWidth: "400px", height: "400px", objectFit: "contain", borderRadius: "8px" }}
          />
        </div>

        {/* Right: Product Details */}
        <div style={{ flex: "1", textAlign: "left" }}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>

          {/* Price Display */}
          <div style={{ display: "flex", gap: "8px", marginTop: "5px", alignItems: "center" }}>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "green" }}>Rs. {product.price}</span>
            {product.originalPrice && (
              <span style={{ fontSize: "16px", color: "gray", textDecoration: "line-through" }}>
                Rs. {product.originalPrice}
              </span>
            )}
            {product.discount && (
              <span style={{ fontSize: "16px", color: "red", fontWeight: "bold" }}>({product.discount}% OFF)</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div style={{ marginTop: "10px" }}>
            <label style={{ fontWeight: "bold", marginRight: "10px" }}>Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: "50px", padding: "5px", borderRadius: "5px", border: "1px solid gray" }}
            />
          </div>

          {/* Size Selector */}
          {availableSizes.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <label style={{ fontWeight: "bold", marginRight: "10px" }}>Size:</label>
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: "8px 16px",
                    margin: "5px",
                    borderRadius: "5px",
                    border: selectedSize === size ? "2px solid #ff3f6c" : "1px solid gray",
                    backgroundColor: selectedSize === size ? "#ff3f6c" : "white",
                    color: selectedSize === size ? "white" : "black",
                    cursor: "pointer",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              style={{
                flex: "1",
                padding: "12px",
                backgroundColor: "#ff3f6c",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
              onClick={handleAddToCart}
            >
              <FaShoppingCart /> Add to Cart
            </button>

            <button
              style={{
                flex: "1",
                padding: "12px",
                backgroundColor: "#ff3f6c",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
              onClick={handleAddToWishlist}
            >
              <FaHeart size={18} /> Wishlist
            </button>
          </div>
        </div>

        {/* <h3 style={{ marginTop: "40px" }}>Recommended Products</h3>
        <div style={{ display: "flex", overflowX: "auto", gap: "15px", padding: "10px 0" }}>
          {recommended.map((item) => (
            <Link key={item.id} to={`/product/${item.id}`} style={{ textDecoration: "none", color: "black" }}>
              <div style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", textAlign: "center" }}>
                <img src={item.image} alt={item.name} style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                <p>{item.name}</p>
                <p style={{ fontWeight: "bold", color: "green" }}>Rs. {item.price}</p>
              </div>
            </Link>
          ))}
        </div> */}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
