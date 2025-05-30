import React, { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart, FaFilter, FaStar, FaRegStar } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AddToCartModal from "./AddToCartModal";

const ProductList = () => {
    const styles = {
        mainContainer: {
            backgroundColor: "#f5f5f7",
            minHeight: "100vh",
            paddingBottom: "40px"
        },
        contentContainer: {
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "20px",
            display: "flex",
            gap: "30px",
            position: "relative"
        },
        filterContainer: {
            width: "280px",
            padding: "25px",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
            height: "fit-content",
            position: "sticky",
            top: "100px",
            transition: "all 0.3s ease"
        },
        filterHeader: {
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "25px",
            color: "#2c3e50",
            display: "flex",
            alignItems: "center",
            gap: "10px"
        },
        filterGroup: {
            marginBottom: "25px",
            paddingBottom: "20px",
            borderBottom: "1px dashed #e0e0e0"
        },
        filterLabel: {
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "15px",
            color: "#34495e",
            display: "flex",
            alignItems: "center",
            gap: "8px"
        },
        productGrid: {
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "25px",
            alignContent: "start"
        },
        productCard: {
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.05)"
        },
        productImageContainer: {
            width: "100%",
            height: "240px",
            position: "relative",
            marginBottom: "15px",
            overflow: "hidden",
            borderRadius: "10px",
            backgroundColor: "#f8f9fa"
        },
        productImage: {
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transition: "transform 0.5s ease"
        },
        wishlistButton: {
            position: "absolute",
            top: "15px",
            right: "15px",
            backgroundColor: "rgba(255,255,255,0.9)",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            cursor: "pointer",
            zIndex: 2,
            transition: "all 0.2s ease",
            border: "none",
            outline: "none"
        },
        discountBadge: {
            position: "absolute",
            top: "15px",
            left: "15px",
            backgroundColor: "#ff4757",
            color: "#fff",
            fontSize: "12px",
            padding: "5px 10px",
            borderRadius: "20px",
            fontWeight: "700",
            zIndex: 2
        },
        cartButton: {
            width: "100%",
            background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
            color: "#fff",
            border: "none",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            marginTop: "15px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 8px rgba(255, 65, 108, 0.3)"
        },
        priceContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
            flexWrap: "wrap"
        },
        currentPrice: {
            fontSize: "18px",
            fontWeight: "700",
            color: "#2ecc71"
        },
        originalPrice: {
            fontSize: "14px",
            color: "#95a5a6",
            textDecoration: "line-through"
        },
        ratingContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            marginTop: "10px"
        },
        pagination: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "50px 0 30px",
            gap: "15px"
        },
        paginationButton: {
            backgroundColor: "#ff4757",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        },
        disabledButton: {
            backgroundColor: "#bdc3c7",
            cursor: "not-allowed",
            boxShadow: "none"
        },
        pageIndicator: {
            fontSize: "16px",
            fontWeight: "600",
            color: "#34495e",
            padding: "0 15px"
        },
        loadingContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            gridColumn: "1 / -1"
        },
        errorContainer: {
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#fff8f8",
            borderRadius: "10px",
            border: "1px solid #ffdddd"
        },
        noProductsContainer: {
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "50px",
            backgroundColor: "#f8f9fa",
            borderRadius: "10px"
        },
        filterSelect: {
            width: "100%",
            padding: "12px 15px",
            borderRadius: "8px",
            border: "1px solid #dfe6e9",
            backgroundColor: "#f8f9fa",
            fontSize: "14px",
            color: "#2d3436",
            cursor: "pointer",
            appearance: "none",
            outline: "none",
            transition: "all 0.3s ease"
        },
        rangeInput: {
            width: "100%",
            margin: "10px 0",
            WebkitAppearance: "none",
            height: "6px",
            borderRadius: "3px",
            background: "#dfe6e9",
            outline: "none"
        },
        rangeInputThumb: {
            WebkitAppearance: "none",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "#ff4757",
            cursor: "pointer"
        },
        rangeValues: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            color: "#7f8c8d"
        },
        mobileFilterButton: {
            display: "none",
            position: "fixed",
            bottom: "30px",
            right: "30px",
            backgroundColor: "#ff4757",
            color: "white",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(255, 71, 87, 0.4)",
            zIndex: 100,
            border: "none",
            fontSize: "24px",
            cursor: "pointer"
        },
        filterContainerMobile: {
            display: "none"
        },
        "@media (max-width: 1024px)": {
            filterContainer: {
                display: "none"
            },
            filterContainerMobile: {
                display: "block",
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1000,
                overflowY: "auto",
                padding: "20px",
                boxSizing: "border-box",
                transform: "translateX(-100%)",
                transition: "transform 0.3s ease"
            },
            filterContainerMobileActive: {
                transform: "translateX(0)"
            },
            mobileFilterButton: {
                display: "flex"
            },
            contentContainer: {
                flexDirection: "column",
                padding: "15px"
            },
            productGrid: {
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
            }
        },
        "@media (max-width: 600px)": {
            productGrid: {
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "15px"
            },
            productCard: {
                padding: "15px"
            },
            productImageContainer: {
                height: "160px"
            },
            cartButton: {
                fontSize: "14px",
                padding: "10px"
            }
        }
    };

    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState("");
    const [filters, setFilters] = useState({
        category: "",
        priceRange: [0, 10000],
        discount: 0,
    });
    const [showMobileFilters, setShowMobileFilters] = useState(false);

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
                body: JSON.stringify(product),
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
                    ? `https://shopping-portal-backend.onrender.com?category=${category}`
                    : "https://shopping-portal-backend.onrender.com/api/products";

                const response = await fetch(url);
                if (!response.ok) throw new Error(`Server Error: ${response.statusText}`);

                const data = await response.json();
                setProducts(Array.isArray(data) ? data : data.products || []);
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
            const inPriceRange = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
            const hasDiscount = product.discount >= filters.discount;
            return inCategory && inPriceRange && hasDiscount;
        });
    };

    const sortProducts = (list) => {
        switch (sortOption) {
            case "priceLowToHigh":
                return [...list].sort((a, b) => a.price - b.price);
            case "priceHighToLow":
                return [...list].sort((a, b) => b.price - a.price);
            case "nameAZ":
                return [...list].sort((a, b) => a.name.localeCompare(b.name));
            case "nameZA":
                return [...list].sort((a, b) => b.name.localeCompare(a.name));
            case "discount":
                return [...list].sort((a, b) => b.discount - a.discount);
            default:
                return list;
        }
    };

    const filteredProducts = sortProducts(filterProducts());
    const indexOfLastProduct = currentPage * productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfLastProduct - productsPerPage, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const ProductCard = ({ product }) => {
        const [isHovered, setIsHovered] = useState(false);
        const imageUrl = product.image?.startsWith("/uploads/")
            ? `https://myntra-clone-api.vercel.app${product.image}`
            : product.image || "https://via.placeholder.com/240";
        const isWishlisted = wishlist.includes(product._id);

        // Generate star ratings (1-5)
        const rating = product.rating || Math.floor(Math.random() * 3) + 3; // Random rating for demo
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? <FaStar key={i} color="#f39c12" /> : <FaRegStar key={i} color="#f39c12" />);
        }

        return (
            <div
                style={{
                    ...styles.productCard,
                    transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                    boxShadow: isHovered ? "0 10px 20px rgba(0,0,0,0.12)" : styles.productCard.boxShadow,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => navigate(`/product/${product._id}`)}
            >
                {product.discount > 0 && (
                    <div style={styles.discountBadge}>{product.discount}% OFF</div>
                )}
                <button
                    style={{
                        ...styles.wishlistButton,
                        backgroundColor: isWishlisted ? "rgba(255, 71, 87, 0.1)" : "rgba(255,255,255,0.9)",
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                    }}
                >
                    <FaHeart color={isWishlisted ? "#ff4757" : "#bdc3c7"} size={16} />
                </button>
                <div style={styles.productImageContainer}>
                    <img 
                        src={imageUrl} 
                        alt={product.name} 
                        style={{
                            ...styles.productImage,
                            transform: isHovered ? "scale(1.05)" : "scale(1)"
                        }} 
                    />
                </div>
                <h3 style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    margin: "10px 0",
                    color: "#2c3e50",
                    minHeight: "40px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }}>
                    {product.name}
                </h3>
                <div style={styles.ratingContainer}>
                    {stars}
                    <span style={{ fontSize: "12px", marginLeft: "5px", color: "#7f8c8d" }}>
                        ({Math.floor(Math.random() * 100) + 1}) {/* Random review count */}
                    </span>
                </div>
                <div style={styles.priceContainer}>
                    <span style={styles.currentPrice}>Rs. {product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                        <span style={styles.originalPrice}>Rs. {product.originalPrice.toLocaleString()}</span>
                    )}
                </div>
                <button
                    style={{
                        ...styles.cartButton,
                        transform: isHovered ? "scale(1.02)" : "scale(1)",
                        boxShadow: isHovered ? "0 6px 12px rgba(255, 65, 108, 0.4)" : styles.cartButton.boxShadow
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                    }}
                >
                    <FaShoppingCart /> Add to Cart
                </button>
            </div>
        );
    };

    return (
        <div style={styles.mainContainer}>
            <Header />
            <div style={styles.contentContainer}>
                {/* Desktop Filters */}
                <div style={styles.filterContainer}>
                    <div style={styles.filterHeader}>
                        <FaFilter /> Filters
                    </div>

                    <div style={styles.filterGroup}>
                        <div style={styles.filterLabel}>Category</div>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            style={styles.filterSelect}
                        >
                            <option value="">All Categories</option>
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="home">Home & Kitchen</option>
                            <option value="beauty">Beauty</option>
                            <option value="sports">Sports</option>
                        </select>
                    </div>

                    <div style={styles.filterGroup}>
                        <div style={styles.filterLabel}>Price Range</div>
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            step="100"
                            value={filters.priceRange[0]}
                            onChange={(e) =>
                                setFilters({ ...filters, priceRange: [parseInt(e.target.value), filters.priceRange[1]] })
                            }
                            style={styles.rangeInput}
                        />
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            step="100"
                            value={filters.priceRange[1]}
                            onChange={(e) =>
                                setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })
                            }
                            style={styles.rangeInput}
                        />
                        <div style={styles.rangeValues}>
                            <span>Rs. {filters.priceRange[0].toLocaleString()}</span>
                            <span>Rs. {filters.priceRange[1].toLocaleString()}</span>
                        </div>
                    </div>

                    <div style={styles.filterGroup}>
                        <div style={styles.filterLabel}>Minimum Discount</div>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={filters.discount}
                            onChange={(e) => setFilters({ ...filters, discount: parseInt(e.target.value) || 0 })}
                            style={styles.filterSelect}
                            placeholder="0%"
                        />
                    </div>

                    <div style={styles.filterGroup}>
                        <div style={styles.filterLabel}>Sort By</div>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            style={styles.filterSelect}
                        >
                            <option value="">Recommended</option>
                            <option value="priceLowToHigh">Price: Low to High</option>
                            <option value="priceHighToLow">Price: High to Low</option>
                            <option value="nameAZ">Name: A-Z</option>
                            <option value="nameZA">Name: Z-A</option>
                            <option value="discount">Discount: High to Low</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>
                </div>

                {/* Mobile Filter Button */}
                <button 
                    style={styles.mobileFilterButton}
                    onClick={() => setShowMobileFilters(true)}
                >
                    <FaFilter />
                </button>

                {/* Mobile Filters */}
                <div style={{
                    ...styles.filterContainerMobile,
                    ...(showMobileFilters && styles.filterContainerMobileActive)
                }}>
                    <div style={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        padding: "25px",
                        maxWidth: "500px",
                        margin: "0 auto",
                        position: "relative"
                    }}>
                        <button 
                            style={{
                                position: "absolute",
                                top: "15px",
                                right: "15px",
                                background: "none",
                                border: "none",
                                fontSize: "20px",
                                cursor: "pointer",
                                color: "#7f8c8d"
                            }}
                            onClick={() => setShowMobileFilters(false)}
                        >
                            ×
                        </button>
                        <div style={styles.filterHeader}>
                            <FaFilter /> Filters
                        </div>

                        <div style={styles.filterGroup}>
                            <div style={styles.filterLabel}>Category</div>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                style={styles.filterSelect}
                            >
                                <option value="">All Categories</option>
                                <option value="electronics">Electronics</option>
                                <option value="fashion">Fashion</option>
                                <option value="home">Home & Kitchen</option>
                            </select>
                        </div>

                        <div style={styles.filterGroup}>
                            <div style={styles.filterLabel}>Price Range</div>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="100"
                                value={filters.priceRange[0]}
                                onChange={(e) =>
                                    setFilters({ ...filters, priceRange: [parseInt(e.target.value), filters.priceRange[1]] })
                                }
                                style={styles.rangeInput}
                            />
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="100"
                                value={filters.priceRange[1]}
                                onChange={(e) =>
                                    setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })
                                }
                                style={styles.rangeInput}
                            />
                            <div style={styles.rangeValues}>
                                <span>Rs. {filters.priceRange[0].toLocaleString()}</span>
                                <span>Rs. {filters.priceRange[1].toLocaleString()}</span>
                            </div>
                        </div>

                        <div style={styles.filterGroup}>
                            <div style={styles.filterLabel}>Minimum Discount</div>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={filters.discount}
                                onChange={(e) => setFilters({ ...filters, discount: parseInt(e.target.value) || 0 })}
                                style={styles.filterSelect}
                                placeholder="0%"
                            />
                        </div>

                        <div style={styles.filterGroup}>
                            <div style={styles.filterLabel}>Sort By</div>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                style={styles.filterSelect}
                            >
                                <option value="">Recommended</option>
                                <option value="priceLowToHigh">Price: Low to High</option>
                                <option value="priceHighToLow">Price: High to Low</option>
                                <option value="nameAZ">Name: A-Z</option>
                                <option value="nameZA">Name: Z-A</option>
                                <option value="discount">Discount: High to Low</option>
                            </select>
                        </div>

                        <button
                            style={{
                                ...styles.cartButton,
                                marginTop: "20px",
                                background: "linear-gradient(135deg, #2ecc71, #27ae60)"
                            }}
                            onClick={() => setShowMobileFilters(false)}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                <div style={styles.productGrid}>
                    {loading && (
                        <div style={styles.loadingContainer}>
                            <div style={{ fontSize: "18px", color: "#7f8c8d" }}>Loading products...</div>
                        </div>
                    )}
                    {error && (
                        <div style={styles.errorContainer}>
                            <h3 style={{ color: "#e74c3c", marginBottom: "15px" }}>Error Loading Products</h3>
                            <p style={{ color: "#7f8c8d" }}>{error}</p>
                            <button
                                style={{
                                    ...styles.cartButton,
                                    marginTop: "20px",
                                    background: "linear-gradient(135deg, #3498db, #2980b9)"
                                }}
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                    {!loading && !error && filteredProducts.length === 0 && (
                        <div style={styles.noProductsContainer}>
                            <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>No Products Found</h3>
                            <p style={{ color: "#7f8c8d", marginBottom: "20px" }}>
                                We couldn't find any products matching your filters.
                            </p>
                            <button
                                style={{
                                    ...styles.cartButton,
                                    background: "linear-gradient(135deg, #9b59b6, #8e44ad)"
                                }}
                                onClick={() => {
                                    setFilters({
                                        category: "",
                                        priceRange: [0, 10000],
                                        discount: 0,
                                    });
                                    setSortOption("");
                                }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                    {!loading && !error && currentProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
                <div style={styles.pagination}>
                    <button
                        style={{
                            ...styles.paginationButton,
                            ...(currentPage === 1 && styles.disabledButton)
                        }}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <IoIosArrowBack /> Previous
                    </button>
                    <span style={styles.pageIndicator}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        style={{
                            ...styles.paginationButton,
                            ...(currentPage === totalPages && styles.disabledButton)
                        }}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next <IoIosArrowForward />
                    </button>
                </div>
            )}

            <Footer />
            {selectedProduct && (
                <AddToCartModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}
        </div>
    );
};

export default ProductList;
