import React, { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AddToCartModal from "./AddToCartModal";

const ProductList = () => {
    const styles = {
        container: {
            width: "90%",
            margin: "40px auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
        },
        filterContainer: {
            width: "250px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        },
        filterHeader: {
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "20px",
        },
        filterGroup: {
            marginBottom: "20px",
        },
        filterLabel: {
            fontSize: "16px",
            fontWeight: "500",
            marginBottom: "10px",
        },
        filterCheckbox: {
            marginRight: "10px",
        },
        productCard: {
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.1)",
            padding: "18px",
            textAlign: "center",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.3s ease-in-out",
        },
        productImage: {
            width: "100%",
            height: "260px",
            objectFit: "contain",
            borderRadius: "10px",
            backgroundColor: "#f8f8f8",
        },
        wishlistButton: {
            position: "absolute",
            top: "12px",
            right: "12px",
            backgroundColor: "#ffffff",
            padding: "8px",
            borderRadius: "50%",
            boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
            cursor: "pointer",
            zIndex: 2,
            transition: "transform 0.2s ease-in-out",
        },
        discountBadge: {
            position: "absolute",
            top: "12px",
            left: "12px",
            backgroundColor: "#ff3f6c",
            color: "#fff",
            fontSize: "12px",
            padding: "4px 8px",
            borderRadius: "4px",
            fontWeight: "bold",
        },
        cartButton: {
            width: "100%",
            background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
            color: "#fff",
            border: "none",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            marginTop: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transition: "background 0.3s ease",
        },
        pagination: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "40px 0 20px",
            gap: "16px",
        },
        paginationButton: {
            backgroundColor: "#ff416c",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.3s ease",
        },
        disabledButton: {
            backgroundColor: "#ccc",
            cursor: "not-allowed",
        },
    };

    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        category: "",
        priceRange: [0, 10000],
        discount: 0,
    });

    const productsPerPage = 12;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");
    const navigate = useNavigate();

    const toggleWishlist = async (product) => {
        try {
            const isAlreadyWishlisted = wishlist.includes(product._id);
            const method = isAlreadyWishlisted ? "DELETE" : "POST";

            const response = await fetch("https://shopping-portal-backend.onrender.com/api/wishlist", {
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

            alert(isAlreadyWishlisted ? "💔 Removed from Wishlist" : "❤️ Added to Wishlist!");

            setWishlist((prevWishlist) =>
                isAlreadyWishlisted
                    ? prevWishlist.filter((id) => id !== product._id)
                    : [...prevWishlist, product._id]
            );
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const url = category
                    ? `https://shopping-portal-backend.onrender.com/api/products?category=${category}`
                    : "https://shopping-portal-backend.onrender.com/api/products";

                const response = await fetch(url);
                if (!response.ok) throw new Error(`Server Error: ${response.statusText}`);

                const data = await response.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (data.products && Array.isArray(data.products)) {
                    setProducts(data.products);
                } else {
                    throw new Error("Unexpected API response format");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    const filterProducts = () => {
        return products.filter((product) => {
            const inCategory = filters.category ? product.category === filters.category : true;
            const inPriceRange =
                product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
            const hasDiscount = product.discount >= filters.discount;

            return inCategory && inPriceRange && hasDiscount;
        });
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const filteredProducts = filterProducts();
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const ProductCard = ({ product, wishlist, onToggleWishlist, onAddToCart }) => {
        const [isHovered, setIsHovered] = useState(false);
        const imageUrl = product.image
            ? (product.image.startsWith("/uploads/") ? `https://shopping-portal-backend.onrender.com${product.image}` : product.image)
            : "https://via.placeholder.com/240";
        const isWishlisted = wishlist.includes(product._id);

        return (
            <div
                style={{
                    ...styles.productCard,
                    transform: isHovered ? "scale(1.03)" : "scale(1)",
                    boxShadow: isHovered ? "0px 8px 16px rgba(0,0,0,0.15)" : styles.productCard.boxShadow,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => navigate(`/product/${product._id}`)}
            >
                {product.discount > 0 && (
                    <div style={styles.discountBadge}>{product.discount}% OFF</div>
                )}
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
                        marginTop: "12px",
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

                <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "16px", fontWeight: "bold", color: "green" }}>Rs. {product.price}</span>
                    {product.originalPrice && (
                        <span style={{ fontSize: "14px", color: "gray", textDecoration: "line-through" }}>
                            Rs. {product.originalPrice}
                        </span>
                    )}
                </div>

                <button
                    style={styles.cartButton}
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

    return (
        <>
            <Header />
            <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
                <div style={styles.filterContainer}>
                    <div style={styles.filterHeader}>Filter Products</div>

                    <div style={styles.filterGroup}>
                        <div style={styles.filterLabel}>Category</div>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                        >
                            <option value="">All</option>
                            <option value="electronics"></option>
                            <option value="fashion">Fashion</option>
                            <option value="home"></option>
                        </select>
                    </div>

                    <div style={styles.filterGroup}>
                        <div style={styles.filterLabel}>Price Range</div>
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            step="500"
                            value={filters.priceRange[0]}
                            onChange={(e) => setFilters({ ...filters, priceRange: [parseInt(e.target.value), filters.priceRange[1]] })}
                            style={{ width: "100%" }}
                        />
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            step="500"
                            value={filters.priceRange[1]}
                            onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
                            style={{ width: "100%" }}
                        />
                        <div>Rs. {filters.priceRange[0]} - Rs. {filters.priceRange[1]}</div>
                    </div>

                    <div style={styles.filterGroup}>
                        <div style={styles.filterLabel}>Minimum Discount (%)</div>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={filters.discount}
                            onChange={(e) => setFilters({ ...filters, discount: parseInt(e.target.value) })}
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                            }}
                        />
                    </div>
                </div>

                <div style={styles.container}>
                    {loading && <p>Loading products...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {!loading && !error && filteredProducts.length === 0 && (
                        <div style={{ textAlign: "center", fontSize: "18px", padding: "40px" }}>
                            <p>😕 Oops! No products found.</p>
                        </div>
                    )}
                    {!loading && !error && currentProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            wishlist={wishlist}
                            onToggleWishlist={toggleWishlist}
                            onAddToCart={setSelectedProduct}
                        />
                    ))}
                </div>
            </div>

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
