import React, { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AddToCartModal from "./AddToCartModal";

const styles = {
    container: {
        width: "80%",
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
    }
};

const ProductCard = ({ product, wishlist, onToggleWishlist, onAddToCart }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const imageUrl = product.image
        ? (product.image.startsWith("/uploads/") ? `http://localhost:5000${product.image}` : product.image)
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
            onClick={() => navigate(`/product/${product._id}`)}
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

            <img src={imageUrl} alt={product.name} style={styles.productImage} />

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
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const url = category
                    ? `http://localhost:5000/api/products?category=${category}`
                    : "http://localhost:5000/api/products";

                const response = await fetch(url);
                if (!response.ok) throw new Error(`Server Error: ${response.statusText}`);

                const data = await response.json();
                console.log("API Response:", data);

                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (data.products && Array.isArray(data.products)) {
                    setProducts(data.products);
                } else {
                    throw new Error("Unexpected API response format");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);


    

    const toggleWishlist = async (product) => {
        try {
            const isAlreadyWishlisted = wishlist.includes(product._id);
            const method = isAlreadyWishlisted ? "DELETE" : "POST";

            const response = await fetch("http://localhost:5000/api/wishlist", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    productId: product._id,
                    name: product.name,

                    price: product.price,
                    originalPrice: product.originalPrice || null,
                    discount: product.discount || 0,
                    image: product.image,
                 }),
            });

            if (!response.ok) throw new Error("Failed to update wishlist");
            alert("❤️ Added to Wishlist!");


            setWishlist((prevWishlist) =>
                isAlreadyWishlisted
                    ? prevWishlist.filter((id) => id !== product._id)
                    : [...prevWishlist, product._id]
            );
        } catch (error) {
            alert(error.message);
        }
    };


    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = Array.isArray(products) ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];
    const totalPages = Math.ceil(products.length / productsPerPage);

    return (
        <>
            <Header />
            <div style={styles.container}>
                {loading && <p>Loading products...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!loading && !error && products.length === 0 && <p>No products found in this category.</p>}
                {!loading &&
                    !error &&
                    currentProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            wishlist={wishlist}
                            onToggleWishlist={toggleWishlist}
                            onAddToCart={setSelectedProduct}
                        />
                    ))}
            </div>
      {/* Pagination Controls */}
      <div style={styles.pagination}>
                <button
                    style={{ ...styles.paginationButton, ...(currentPage === 1 && styles.disabledButton) }}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    style={{ ...styles.paginationButton, ...(currentPage === totalPages && styles.disabledButton) }}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
            <Footer />

            {selectedProduct && (
                <AddToCartModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
};

export default ProductList;
