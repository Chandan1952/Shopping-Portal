import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState({ fullName: "", address: "", phone: "" });
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/api/user", {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Not authenticated");
                return res.json();
            })
            .then((data) => setUserInfo(data))
            .catch(() => navigate("/"))
            .finally(() => setLoading(false));
    }, [navigate]);

    useEffect(() => {
        fetch("http://localhost:5000/api/auth/check", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                setIsAuthenticated(data.isAuthenticated);
            })
            .catch(() => setIsAuthenticated(false));
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/cart", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                setCart(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setCart([]);
                setLoading(false);
            });
    }, []);

    const updateCart = async (id, change) => {
        try {
            await fetch(`http://localhost:5000/api/cart/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ change }),
                credentials: "include",
            });
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const increaseQty = async (id) => {
        setCart(cart.map((item) => (item._id === id ? { ...item, quantity: item.quantity + 1 } : item)));
        await updateCart(id, 1);
    };

    const decreaseQty = async (id) => {
        const item = cart.find((item) => item._id === id);
        if (item && item.quantity > 1) {
            setCart(cart.map((item) => (item._id === id ? { ...item, quantity: item.quantity - 1 } : item)));
            await updateCart(id, -1);
        }
    };

    const removeItem = async (id) => {
        setCart(cart.filter((item) => item._id !== id));
        try {
            await fetch(`http://localhost:5000/api/cart/${id}`, { method: "DELETE", credentials: "include" });
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);
        if (!isAuthenticated) {
            navigate("/register");
            return;
        }

        if (!userInfo.fullName || !userInfo.address || !userInfo.phone) {
            alert("⚠️ Please fill in all user details.");
            setIsPlacingOrder(false);
            return;
        }

        if (paymentMethod === "Cash on Delivery") {
            try {
                const response = await fetch("http://localhost:5000/api/orders/place", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        cart,
                        paymentMethod,
                        userInfo: {
                            name: userInfo.fullName,
                            address: userInfo.address,
                            phone: userInfo.phone,
                        },
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert("✅ Order placed successfully!");
                    setCart([]);
                    navigate(`/order-status/${data.orderId}`);
                } else {
                    alert("❌ Error placing order: " + data.message);
                }
            } catch (error) {
                console.error("Error placing order:", error);
                alert("❌ Error placing order. Please try again.");
            } finally {
                setIsPlacingOrder(false);
            }
        } else {
            const res = await loadRazorpayScript();
            if (!res) {
                alert("❌ Razorpay SDK failed to load.");
                setIsPlacingOrder(false);
                return;
            }

            try {
                const orderRes = await fetch("http://localhost:5000/api/payment/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ amount: finalAmount }),
                });

                const { order } = await orderRes.json();

                const options = {
                    key: "rzp_test_rv1bH6Okprpr7t",
                    amount: order.amount,
                    currency: "INR",
                    name: "My Shop",
                    description: "Order Payment",
                    order_id: order.id,
                    handler: async function (response) {
                        const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                cart,
                                userInfo,
                                paymentMethod,
                            }),
                        });

                        if (verifyRes.ok) {
                            alert("✅ Payment successful & order placed!");
                            setCart([]);
                            const { orderId } = await verifyRes.json();
                            navigate(`/order-status/${orderId}`);
                        } else {
                            alert("❌ Payment verification failed.");
                        }
                    },
                    prefill: {
                        name: userInfo.fullName,
                        email: "customer@example.com",
                        contact: userInfo.phone,
                    },
                    theme: {
                        color: "#ff3f6c",
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } catch (error) {
                console.error("Payment Error:", error);
                alert("❌ Error initiating payment.");
            } finally {
                setIsPlacingOrder(false);
            }
        }
    };

    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalMRP = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalDiscount = cart.reduce((acc, item) => acc + (item.discount || 0) * item.quantity, 0);
    const platformFee = 20;
    const finalAmount = totalMRP - totalDiscount + platformFee;

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#f8f9fa",
            display: "flex",
            flexDirection: "column"
        }}>
            <Header />
            
            <main style={{
                flex: 1,
                padding: "32px 16px",
                maxWidth: "1200px",
                margin: "0 auto",
                width: "100%"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px"
                }}>
                    {/* Left column - Cart items and user info */}
                    <div style={{
                        width: "100%"
                    }}>
                        {/* Cart header */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "24px"
                        }}>
                            <div style={{
                                fontSize: "24px",
                                color: "#4f46e5",
                                marginRight: "12px"
                            }}>🛒</div>
                            <h1 style={{
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#1f2937"
                            }}>Your Shopping Cart</h1>
                            <span style={{
                                marginLeft: "auto",
                                backgroundColor: "#eef2ff",
                                color: "#4f46e5",
                                padding: "4px 12px",
                                borderRadius: "9999px",
                                fontSize: "14px",
                                fontWeight: "500"
                            }}>
                                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                            </span>
                        </div>

                        {/* Cart items */}
                        {loading ? (
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "48px 0"
                            }}>
                                <div style={{
                                    animation: "spin 1s linear infinite",
                                    borderRadius: "9999px",
                                    height: "48px",
                                    width: "48px",
                                    borderTop: "2px solid #4f46e5",
                                    borderBottom: "2px solid #4f46e5",
                                    borderLeft: "2px solid #e0e7ff",
                                    borderRight: "2px solid #e0e7ff"
                                }}></div>
                            </div>
                        ) : cart.length > 0 ? (
                            <div style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "12px",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                                overflow: "hidden",
                                marginBottom: "32px"
                            }}>
                                {cart.map((item) => (
                                    <div key={item._id} style={{
                                        borderBottom: "1px solid #f3f4f6",
                                        padding: "16px",
                                        transition: "all 0.3s ease"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            padding: "16px"
                                        }}>
                                            <div style={{
                                                display: "flex",
                                                marginBottom: "16px"
                                            }}>
                                                <div style={{
                                                    flexShrink: 0,
                                                    marginRight: "24px"
                                                }}>
                                                    <img
                                                        src={item.image.startsWith("/uploads/") ? `http://localhost:5000${item.image}` : item.image || "https://via.placeholder.com/150"}
                                                        alt={item.name}
                                                        style={{
                                                            width: "96px",
                                                            height: "96px",
                                                            objectFit: "contain",
                                                            borderRadius: "8px"
                                                        }}
                                                        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                                                    />
                                                </div>
                                                
                                                <div style={{
                                                    flexGrow: 1
                                                }}>
                                                    <div style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        marginBottom: "16px"
                                                    }}>
                                                        <h3 style={{
                                                            fontSize: "18px",
                                                            fontWeight: "500",
                                                            color: "#1f2937",
                                                            marginBottom: "4px"
                                                        }}>{item.name}</h3>
                                                        <p style={{
                                                            fontSize: "14px",
                                                            color: "#6b7280"
                                                        }}>Size: {item.size || "N/A"}</p>
                                                    </div>
                                                    
                                                    <div style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between"
                                                    }}>
                                                        <div style={{
                                                            display: "flex",
                                                            alignItems: "center"
                                                        }}>
                                                            <button 
                                                                onClick={() => decreaseQty(item._id)} 
                                                                style={{
                                                                    padding: "8px",
                                                                    borderRadius: "9999px",
                                                                    backgroundColor: "#f3f4f6",
                                                                    color: "#4b5563",
                                                                    border: "none",
                                                                    cursor: "pointer",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    opacity: item.quantity <= 1 ? 0.5 : 1
                                                                }}
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                -
                                                            </button>
                                                            <span style={{
                                                                margin: "0 12px",
                                                                fontWeight: "500",
                                                                color: "#374151"
                                                            }}>{item.quantity}</span>
                                                            <button 
                                                                onClick={() => increaseQty(item._id)} 
                                                                style={{
                                                                    padding: "8px",
                                                                    borderRadius: "9999px",
                                                                    backgroundColor: "#f3f4f6",
                                                                    color: "#4b5563",
                                                                    border: "none",
                                                                    cursor: "pointer",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center"
                                                                }}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        
                                                        <div>
                                                            <span style={{
                                                                fontSize: "18px",
                                                                fontWeight: "600",
                                                                color: "#4f46e5"
                                                            }}>₹{(item.price - (item.discount || 0)).toFixed(2)}</span>
                                                            {item.discount > 0 && (
                                                                <span style={{
                                                                    marginLeft: "8px",
                                                                    fontSize: "14px",
                                                                    color: "#9ca3af",
                                                                    textDecoration: "line-through"
                                                                }}>₹{item.price.toFixed(2)}</span>
                                                            )}
                                                        </div>
                                                        
                                                        <button 
                                                            onClick={() => removeItem(item._id)}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                fontSize: "14px",
                                                                color: "#ef4444",
                                                                backgroundColor: "transparent",
                                                                border: "none",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            🗑️ Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "12px",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                                padding: "32px",
                                textAlign: "center"
                            }}>
                                <div style={{
                                    fontSize: "48px",
                                    color: "#d1d5db",
                                    marginBottom: "16px"
                                }}>🛒</div>
                                <h3 style={{
                                    fontSize: "20px",
                                    fontWeight: "500",
                                    color: "#374151",
                                    marginBottom: "8px"
                                }}>Your cart is empty</h3>
                                <p style={{
                                    color: "#6b7280",
                                    marginBottom: "24px"
                                }}>Looks like you haven't added anything to your cart yet</p>
                                <button 
                                    onClick={() => navigate("/")}
                                    style={{
                                        padding: "12px 24px",
                                        backgroundColor: "#4f46e5",
                                        color: "#ffffff",
                                        borderRadius: "8px",
                                        border: "none",
                                        cursor: "pointer",
                                        fontWeight: "500",
                                        transition: "background-color 0.2s"
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = "#4338ca"}
                                    onMouseOut={(e) => e.target.style.backgroundColor = "#4f46e5"}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}

                        {/* User Information Form */}
                        {cart.length > 0 && (
                            <div style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "12px",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                                padding: "24px",
                                marginBottom: "32px"
                            }}>
                                <h2 style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    marginBottom: "24px"
                                }}>Delivery Information</h2>
                                
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px"
                                }}>
                                    <div>
                                        <label style={{
                                            display: "block",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            color: "#374151",
                                            marginBottom: "8px"
                                        }}>Full Name</label>
                                        <input
                                            name="fullName"
                                            placeholder="Enter your full name"
                                            onChange={handleInputChange}
                                            value={userInfo.fullName}
                                            style={{
                                                width: "100%",
                                                padding: "12px 16px",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                outline: "none",
                                                transition: "all 0.2s"
                                            }}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label style={{
                                            display: "block",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            color: "#374151",
                                            marginBottom: "8px"
                                        }}>Address</label>
                                        <input
                                            name="address"
                                            placeholder="Enter your delivery address"
                                            onChange={handleInputChange}
                                            value={userInfo.address}
                                            style={{
                                                width: "100%",
                                                padding: "12px 16px",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                outline: "none",
                                                transition: "all 0.2s"
                                            }}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label style={{
                                            display: "block",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            color: "#374151",
                                            marginBottom: "8px"
                                        }}>Phone Number</label>
                                        <input
                                            name="phone"
                                            placeholder="Enter your phone number"
                                            onChange={handleInputChange}
                                            value={userInfo.phone}
                                            style={{
                                                width: "100%",
                                                padding: "12px 16px",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                outline: "none",
                                                transition: "all 0.2s"
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right column - Order summary */}
                    {cart.length > 0 && (
                        <div style={{
                            width: "100%"
                        }}>
                            <div style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "12px",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                                padding: "24px",
                                position: "sticky",
                                top: "24px"
                            }}>
                                <h2 style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    marginBottom: "24px"
                                }}>Order Summary</h2>
                                
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                    marginBottom: "24px"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}>
                                        <span style={{
                                            color: "#6b7280"
                                        }}>Total MRP</span>
                                        <span style={{
                                            fontWeight: "500"
                                        }}>₹{totalMRP.toFixed(2)}</span>
                                    </div>
                                    
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}>
                                        <span style={{
                                            color: "#6b7280"
                                        }}>Discount</span>
                                        <span style={{
                                            color: "#10b981"
                                        }}>-₹{totalDiscount.toFixed(2)}</span>
                                    </div>
                                    
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}>
                                        <span style={{
                                            color: "#6b7280"
                                        }}>Platform Fee</span>
                                        <span style={{
                                            fontWeight: "500"
                                        }}>₹{platformFee.toFixed(2)}</span>
                                    </div>
                                    
                                    <div style={{
                                        borderTop: "1px solid #e5e7eb",
                                        paddingTop: "12px",
                                        marginTop: "12px"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontWeight: "600",
                                            color: "#1f2937"
                                        }}>
                                            <span>Total Amount</span>
                                            <span>₹{finalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div style={{
                                    marginBottom: "24px"
                                }}>
                                    <h3 style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        color: "#374151",
                                        marginBottom: "12px"
                                    }}>Payment Method</h3>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px"
                                    }}>
                                        <div 
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                padding: "12px",
                                                border: `1px solid ${paymentMethod === "Cash on Delivery" ? "#4f46e5" : "#e5e7eb"}`,
                                                borderRadius: "8px",
                                                backgroundColor: paymentMethod === "Cash on Delivery" ? "#eef2ff" : "transparent",
                                                cursor: "pointer",
                                                transition: "all 0.2s"
                                            }}
                                            onClick={() => setPaymentMethod("Cash on Delivery")}
                                        >
                                            <div style={{
                                                fontSize: "20px",
                                                color: paymentMethod === "Cash on Delivery" ? "#4f46e5" : "#9ca3af",
                                                marginRight: "8px"
                                            }}>🚚</div>
                                            <span style={{
                                                fontWeight: paymentMethod === "Cash on Delivery" ? "500" : "400",
                                                color: paymentMethod === "Cash on Delivery" ? "#4f46e5" : "#6b7280"
                                            }}>Cash on Delivery</span>
                                        </div>
                                        
                                        <div 
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                padding: "12px",
                                                border: `1px solid ${paymentMethod === "Online Payment" ? "#4f46e5" : "#e5e7eb"}`,
                                                borderRadius: "8px",
                                                backgroundColor: paymentMethod === "Online Payment" ? "#eef2ff" : "transparent",
                                                cursor: "pointer",
                                                transition: "all 0.2s"
                                            }}
                                            onClick={() => setPaymentMethod("Online Payment")}
                                        >
                                            <div style={{
                                                fontSize: "20px",
                                                color: paymentMethod === "Online Payment" ? "#4f46e5" : "#9ca3af",
                                                marginRight: "8px"
                                            }}>💳</div>
                                            <span style={{
                                                fontWeight: paymentMethod === "Online Payment" ? "500" : "400",
                                                color: paymentMethod === "Online Payment" ? "#4f46e5" : "#6b7280"
                                            }}>Online Payment</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button 
                                    onClick={handlePlaceOrder}
                                    disabled={isPlacingOrder}
                                    style={{
                                        width: "100%",
                                        padding: "16px",
                                        borderRadius: "8px",
                                        fontWeight: "500",
                                        fontSize: "16px",
                                        color: "#ffffff",
                                        backgroundColor: isPlacingOrder ? "#a5b4fc" : "#4f46e5",
                                        border: "none",
                                        cursor: "pointer",
                                        transition: "background-color 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                    onMouseOver={(e) => !isPlacingOrder && (e.target.style.backgroundColor = "#4338ca")}
                                    onMouseOut={(e) => !isPlacingOrder && (e.target.style.backgroundColor = "#4f46e5")}
                                >
                                    {isPlacingOrder ? (
                                        <>
                                            <div style={{
                                                animation: "spin 1s linear infinite",
                                                borderRadius: "9999px",
                                                height: "20px",
                                                width: "20px",
                                                borderTop: "2px solid #ffffff",
                                                borderBottom: "2px solid #ffffff",
                                                borderLeft: "2px solid transparent",
                                                borderRight: "2px solid transparent",
                                                marginRight: "8px"
                                            }}></div>
                                            Processing...
                                        </>
                                    ) : isAuthenticated ? (
                                        `PLACE ORDER (₹${finalAmount.toFixed(2)})`
                                    ) : (
                                        "LOGIN TO PLACE ORDER"
                                    )}
                                </button>

                                {/* Secure payment info */}
                                {paymentMethod === "Online Payment" && (
                                    <div style={{
                                        marginTop: "16px",
                                        fontSize: "12px",
                                        color: "#6b7280",
                                        display: "flex",
                                        alignItems: "center"
                                    }}>
                                        <div style={{
                                            color: "#10b981",
                                            marginRight: "4px"
                                        }}>🔒</div>
                                        Secure payment processing
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default CartPage;