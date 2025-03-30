import React, { useState, useEffect, useCallback } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AddToCartModal from "./AddToCartModal";

const styles = {
    container: {
        width: "90%",
        margin: "auto",
        padding: "16px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
    },
    productCard: {
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
        padding: "16px",
        textAlign: "center",
        cursor: "pointer",
        position: "relative",
        transition: "transform 0.3s, box-shadow 0.3s",
    },
    productImage: {
        width: "100%",
        height: "240px",
        objectFit: "contain",
        borderRadius: "8px",
    },
    wishlistButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "#fff",
        padding: "6px",
        borderRadius: "50%",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
        cursor: "pointer",
    },
    cartButton: {
        width: "100%",
        backgroundColor: "#ff3f6c",
        color: "#fff",
        border: "none",
        padding: "10px",
        borderRadius: "6px",
        fontSize: "16px",
        fontWeight: "bold",
        marginTop: "10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "background 0.3s",
    },
    pagination: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        gap: "10px",
    },
    paginationButton: {
        backgroundColor: "#ff3f6c",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "6px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background 0.3s",
    },
    disabledButton: {
        backgroundColor: "gray",
        cursor: "not-allowed",
    },
};

const ProductCard = ({ product, wishlist, onToggleWishlist, onAddToCart }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const imageUrl = product.image
        ? (product.image.startsWith("/uploads/") ? `https://shopping-portal-backend.onrender.com${product.image}` : product.image)
        : "https://via.placeholder.com/240";

    const isWishlisted = wishlist.includes(product._id);

    return (
        <div
            style={{
                ...styles.productCard,
                transform: isHovered ? "scale(1.05)" : "scale(1)",
                boxShadow: isHovered ? "0px 6px 12px rgba(0,0,0,0.2)" : "0px 4px 8px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                style={styles.wishlistButton}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                }}
            >
                <FaHeart color={isWishlisted ? "#ff3f6c" : "gray"} size={18} />
            </div>

            <img src={imageUrl} alt={product.name} style={styles.productImage} onClick={() => navigate(`/product/${product._id}`)} />

            <h3
                style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginTop: "10px",
                    color: "#333",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxHeight: "48px",
                }}
            >
                {product.name}
            </h3>

            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "5px" }}>
                <span style={{ fontSize: "16px", fontWeight: "bold", color: "green" }}>Rs. {product.price}</span>
                {product.originalPrice && <span style={{ fontSize: "14px", color: "gray", textDecoration: "line-through" }}>Rs. {product.originalPrice}</span>}
                {product.discount && <span style={{ fontSize: "14px", color: "red", fontWeight: "bold" }}>({product.discount}% OFF)</span>}
            </div>

            <button
                style={{
                    ...styles.cartButton,
                    backgroundColor: isHovered ? "#e6325a" : "#ff3f6c",
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                }}
            >
                <FaShoppingCart /> Add to Cart
            </button>
        </div>
    );
};

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");

    useEffect(() => {
        setLoading(true);
        fetch(`https://shopping-portal-backend.onrender.com/api/products${category ? `?category=${category}` : ""}`)
            .then((res) => res.json())
            .then((data) => setProducts(Array.isArray(data) ? data : data.products || []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [category]);

    const toggleWishlist = useCallback((product) => {
        setWishlist((prev) => (prev.includes(product._id) ? prev.filter((id) => id !== product._id) : [...prev, product._id]));
    }, []);

    return (
        <>
            <Header />
            <div style={styles.container}>
                {loading && <p>Loading products...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!loading && !error && products.length === 0 && <p>No products found.</p>}
                {products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage).map((product) => (
                    <ProductCard key={product._id} product={product} wishlist={wishlist} onToggleWishlist={toggleWishlist} onAddToCart={setSelectedProduct} />
                ))}
            </div>

            <Footer />

            {selectedProduct && <AddToCartModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        </>
    );
};

export default ProductList;
