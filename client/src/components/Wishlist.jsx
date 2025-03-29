import React, { useState, useEffect } from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await fetch("https://shopping-portal-backend.onrender.com/api/wishlist");
                if (!response.ok) throw new Error("Failed to fetch wishlist");
                const data = await response.json();
                setWishlist(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            const response = await fetch(`https://shopping-portal-backend.onrender.com/api/wishlist/${productId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to remove item");
            setWishlist(wishlist.filter(item => item.productId !== productId));
            alert("❌ Removed from Wishlist!");
        } catch (error) {
            alert(error.message);
        }
    };

    const handleMoveToCart = async (item) => {
        try {
            const response = await fetch("https://shopping-portal-backend.onrender.com/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: item.productId,
                    name: item.name,
                    brand: item.brand || "Unknown",
                    price: item.price,
                    quantity: 1,
                    size: item.size || "M",
                    discount: item.discount || 0,
                    image: item.image,
                }),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                alert("✅ Product moved to cart!");
                await handleRemove(item.productId);
            } else {
                alert(`❌ Failed to add: ${data.message || "Unknown error"}`);
            }
        } catch (error) {
            alert("❌ Error adding to cart. Try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading wishlist...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <>
            <Header />
            <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "20px" }}>
                <h2 style={{ marginBottom: "20px", textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>My Wishlist ({wishlist.length} items)</h2>
                {wishlist.length === 0 ? (
                    <p style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>Your wishlist is empty.</p>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "20px" }}>
                        {wishlist.map(item => (
                            <div 
                                key={item.productId} 
                                style={{ 
                                    border: "1px solid #ddd", 
                                    padding: "20px", 
                                    borderRadius: "12px", 
                                    textAlign: "center", 
                                    transition: "all 0.3s ease", 
                                    boxShadow: hoveredItem === item.productId ? "0 10px 20px rgba(0,0,0,0.2)" : "0 4px 8px rgba(0,0,0,0.1)",
                                    transform: hoveredItem === item.productId ? "scale(1.05)" : "scale(1)",
                                    background: "#f9f9f9",
                                    overflow: "hidden"
                                }}
                                onMouseEnter={() => setHoveredItem(item.productId)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <img
                                    src={item.image.startsWith("/uploads/") ? `https://shopping-portal-backend.onrender.com${item.image}` : item.image || "https://via.placeholder.com/150"}
                                    alt={item.name}
                                    style={{
                                        width: "100%",
                                        height: "200px",
                                        objectFit: "contain",
                                        borderRadius: "12px",
                                        marginBottom: "15px"
                                    }}
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                                />

                                <h3 style={{
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    marginBottom: "8px",
                                    color: "#333",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}>{item.name}</h3>
                                <p style={{ color: "green", fontWeight: "bold", marginBottom: "15px", fontSize: "16px" }}>Rs. {item.price}</p>

                                <button onClick={() => handleMoveToCart(item)} style={{ background: "#ff3f6c", color: "white", padding: "8px 8px", borderRadius: "8px", cursor: "pointer", marginRight: "2px", border: "none", fontSize: "14px", fontWeight: "bold" }}>
                                    <FaShoppingCart /> Move to Bag
                                </button>

                                <button onClick={() => handleRemove(item.productId)} style={{ background: "gray", color: "white", padding: "8px 8px", borderRadius: "8px", cursor: "pointer", border: "none", fontSize: "14px", fontWeight: "bold" }}>
                                    <FaTrash /> Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Wishlist;
