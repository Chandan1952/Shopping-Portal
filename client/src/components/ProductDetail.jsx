import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaStar, FaRegStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { RiExchangeLine } from "react-icons/ri";
import Header from "./Header";
import Footer from "./Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
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

      const response = await fetch("http://localhost:5000/api/cart", {
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
      const response = await fetch("http://localhost:5000/api/wishlist", {
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

  const handleImageHover = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.5)',
      transition: 'transform 0.3s ease'
    });
  };

  const handleImageLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transition: 'transform 0.3s ease'
    });
  };

  if (loading) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <div style={{
        padding: '40px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '20px'
        }}>Loading product details...</div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#f0f0f0',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: '60%',
            background: 'linear-gradient(90deg, #ff3f6c, #ff6b8b)',
            borderRadius: '10px',
            animation: 'loading 1.5s infinite ease-in-out'
          }}></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      background: '#fff0f0',
      borderRadius: '10px',
      maxWidth: '600px',
      margin: '40px auto',
      boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        fontSize: '24px',
        color: '#ff3f6c',
        marginBottom: '20px'
      }}>Error Loading Product</div>
      <p style={{ color: '#666' }}>{error}</p>
      <button style={{
        marginTop: '20px',
        padding: '12px 24px',
        background: '#ff3f6c',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
      onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  );

  const imageUrl = product.image?.startsWith("/uploads/")
    ? `http://localhost:5000${product.image}`
    : product.image || "https://via.placeholder.com/240";

  const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const availableSizes = product?.sizes?.length ? product.sizes : allSizes;

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} style={{ color: '#FFD700' }} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} style={{ color: '#FFD700' }} />);
      } else {
        stars.push(<FaRegStar key={i} style={{ color: '#FFD700' }} />);
      }
    }
    return stars;
  };

  return (
    <>
      <Header />
      <div style={{ 
        maxWidth: "1200px", 
        margin: "40px auto", 
        padding: "0 20px",
      }}>
        {/* Breadcrumb */}
        <div style={{ 
          marginBottom: "30px", 
          fontSize: "14px", 
          color: "#666",
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ color: '#ff3f6c', cursor: 'pointer' }}>Home</span>
          <span>/</span>
          <span style={{ color: '#ff3f6c', cursor: 'pointer' }}>{product.category || 'Products'}</span>
          <span>/</span>
          <span style={{ color: '#333' }}>{product.name}</span>
        </div>

        <div style={{ 
          display: "flex", 
          gap: "60px", 
          flexWrap: "wrap",
          background: '#fff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          {/* Product Image Gallery */}
          <div style={{ 
            flex: "1", 
            minWidth: "300px", 
            maxWidth: "500px",
            position: 'relative'
          }}>
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '12px',
              border: '1px solid #f0f0f0'
            }}>
              <img
                src={imageUrl}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  cursor: 'zoom-in',
                  ...zoomStyle
                }}
                onMouseMove={handleImageHover}
                onMouseLeave={handleImageLeave}
              />
              {product.discount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  background: '#ff3f6c',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
                }}>
                  {product.discount}% OFF
                </div>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            <div style={{
              display: 'flex',
              gap: '10px',
              marginTop: '20px',
              justifyContent: 'center'
            }}>
              <button 
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
              >
                <FaChevronLeft />
              </button>
              
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                overflow: 'hidden',
                cursor: 'pointer'
              }}>
                <img 
                  src={imageUrl} 
                  alt="Thumbnail" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              
              <button 
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => setCurrentImageIndex(prev => prev + 1)}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div style={{ 
            flex: "1", 
            minWidth: "300px",
            position: 'relative'
          }}>
            <h1 style={{ 
              fontSize: "28px", 
              fontWeight: "700", 
              marginBottom: "10px",
              color: '#333'
            }}>
              {product.name}
            </h1>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex' }}>
                {renderStars(product.rating || 4.5)}
              </div>
              <span style={{ 
                color: '#666', 
                fontSize: '14px'
              }}>
                {product.reviews || 124} reviews
              </span>
            </div>
            
            <div style={{ 
              marginBottom: "25px", 
              color: "#555",
              lineHeight: '1.6',
              fontSize: '15px'
            }}>
              {product.description || "Premium quality product with excellent craftsmanship."}
            </div>

            {/* Brand */}
            {product.brand && (
              <div style={{ 
                marginBottom: "15px",
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ 
                  fontWeight: "600", 
                  color: '#444'
                }}>Brand:</span>
                <span style={{
                  background: '#f0f0f0',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}>{product.brand}</span>
              </div>
            )}

            {/* Price Section */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "15px", 
              marginBottom: "25px",
              padding: '15px 0',
              borderTop: '1px solid #f0f0f0',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <span style={{ 
                fontSize: "28px", 
                fontWeight: "bold", 
                color: "#ff3f6c" 
              }}>
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span style={{ 
                  textDecoration: "line-through", 
                  color: "#888",
                  fontSize: '18px'
                }}>
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.discount > 0 && (
                <span style={{ 
                  color: "white", 
                  fontWeight: "600",
                  background: '#ff3f6c',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: "10px" 
                }}>
                  <label style={{ 
                    fontWeight: "600", 
                    color: '#444',
                    fontSize: '16px'
                  }}>Select Size:</label>
                  <span style={{
                    fontSize: '14px',
                    color: '#ff3f6c',
                    cursor: 'pointer'
                  }}>Size Guide</span>
                </div>
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  gap: "10px" 
                }}>
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: "12px 20px",
                        borderRadius: "8px",
                        border: selectedSize === size ? "none" : "1px solid #ddd",
                        backgroundColor: selectedSize === size ? "#ff3f6c" : "#fff",
                        color: selectedSize === size ? "#fff" : "#333",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: selectedSize === size ? '0 4px 10px rgba(255, 63, 108, 0.3)' : 'none',
                        minWidth: '60px',
                        textAlign: 'center'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div style={{ 
              marginBottom: "30px",
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div>
                <label style={{ 
                  fontWeight: "600", 
                  display: 'block',
                  marginBottom: "10px",
                  color: '#444',
                  fontSize: '16px'
                }}>Quantity:</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: 'fit-content'
                }}>
                  <button 
                    style={{
                      padding: '10px 15px',
                      background: '#f5f5f5',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#333'
                    }}
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    style={{ 
                      width: "50px", 
                      padding: "10px", 
                      border: 'none',
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: '600',
                      outline: 'none'
                    }}
                  />
                  <button 
                    style={{
                      padding: '10px 15px',
                      background: '#f5f5f5',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#333'
                    }}
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Stock Availability */}
              <div style={{
                background: '#f0f8ff',
                padding: '12px 20px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#4CAF50'
                }}></div>
                <span style={{ 
                  fontSize: '14px',
                  color: '#333'
                }}>In Stock ({product.stock || 15} available)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: "flex", 
              gap: "15px", 
              marginBottom: "30px",
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: "16px",
                  background: "linear-gradient(135deg, #ff3f6c, #ff6b8b)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 15px rgba(255, 63, 108, 0.3)"
                }}
                onMouseEnter={(e) => e.target.style.opacity = 0.9}
                onMouseLeave={(e) => e.target.style.opacity = 1}
              >
                <FaShoppingCart /> Add to Cart
              </button>

              <button
                onClick={handleAddToWishlist}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: "16px",
                  background: "#fff",
                  color: "#ff3f6c",
                  fontSize: "16px",
                  fontWeight: "600",
                  border: "2px solid #ff3f6c",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => {
                  e.target.background = "#fff5f7";
                  e.target.color = "#ff1a4b";
                }}
                onMouseLeave={(e) => {
                  e.target.background = "#fff";
                  e.target.color = "#ff3f6c";
                }}
              >
                <FaHeart /> Add to Wishlist
              </button>
            </div>

            {/* Product Policies */}
            <div style={{
              border: '1px solid #f0f0f0',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px'
              }}>
                <IoShieldCheckmarkOutline style={{ color: '#4CAF50', fontSize: '20px' }} />
                <span style={{ fontWeight: '600' }}>Secure Payment</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <RiExchangeLine style={{ color: '#2196F3', fontSize: '20px' }} />
                <span style={{ fontWeight: '600' }}>Easy Returns & Exchanges</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div style={{
              background: '#f9f9f9',
              borderRadius: '10px',
              padding: '15px',
              fontSize: '14px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <span style={{ 
                  width: '20px',
                  height: '20px',
                  background: '#ff3f6c',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>i</span>
                <span style={{ fontWeight: '600' }}>Delivery Information</span>
              </div>
              <p style={{ margin: 0, color: '#666' }}>
                Free standard delivery on orders over Rs. 1000. Expected delivery in 3-5 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;