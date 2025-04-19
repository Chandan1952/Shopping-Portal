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

    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://shopping-portal-backend.onrender.com/api/user", {
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
        fetch("https://shopping-portal-backend.onrender.com/api/auth/check", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                setIsAuthenticated(data.isAuthenticated);
            })
            .catch(() => setIsAuthenticated(false));
    }, []);

    useEffect(() => {
        fetch("https://shopping-portal-backend.onrender.com/api/cart", { credentials: "include" })
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
            await fetch(`https://shopping-portal-backend.onrender.com/api/cart/${id}`, {
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
            await fetch(`https://shopping-portal-backend.onrender.com/api/cart/${id}`, { method: "DELETE", credentials: "include" });
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
        if (!isAuthenticated) {
            navigate("/register");
            return;
        }

        if (!userInfo.fullName || !userInfo.address || !userInfo.phone) {
            alert("⚠️ Please fill in all user details.");
            return;
        }

        if (paymentMethod === "Cash on Delivery") {
            // COD flow
            try {
                const response = await fetch("https://shopping-portal-backend.onrender.com/api/orders/place", {
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
                    navigate(`/order-status/${data.orderId}`); // Redirect to the order status page
                } else {
                    alert("❌ Error placing order: " + data.message);
                }
            } catch (error) {
                console.error("Error placing order:", error);
                alert("❌ Error placing order. Please try again.");
            }
        } else {
            // Online payment with Razorpay
            const res = await loadRazorpayScript();
            if (!res) {
                alert("❌ Razorpay SDK failed to load.");
                return;
            }

            try {
                const orderRes = await fetch("https://shopping-portal-backend.onrender.com/api/payment/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ amount: finalAmount }),
                });

                const { order } = await orderRes.json();

                const options = {
                    key: "rzp_test_rv1bH6Okprpr7t", // replace with your Razorpay public key
                    amount: order.amount,
                    currency: "INR",
                    name: "My Shop",
                    description: "Order Payment",
                    order_id: order.id,
                    handler: async function (response) {
                        const verifyRes = await fetch("https://shopping-portal-backend.onrender.com/api/payment/verify", {
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
                            navigate(`/order-status/${orderId}`); // Redirect to the order status page
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
            }
        }
    };


    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalMRP = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalDiscount = cart.reduce((acc, item) => acc + (item.discount || 0) * item.quantity, 0);
    const platformFee = 20;
    const finalAmount = totalMRP - totalDiscount + platformFee;

    return (
        <div style={styles.page}>
            <Header />
            <div style={styles.container}>
                <h2 style={styles.heading}>🛒 Shopping Cart</h2>

                {loading ? (
                    <p style={styles.loadingText}>Loading cart...</p>
                ) : cart.length > 0 ? (
                    cart.map((item) => (
                        <div key={item._id} style={styles.cartItem}>
                            <img
                                src={item.image.startsWith("/uploads/") ? `https://shopping-portal-backend.onrender.com${item.image}` : item.image || "https://via.placeholder.com/100"}
                                alt={item.name}
                                style={styles.image}
                                onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                            />
                            <div style={styles.details}>
                                <h3>{item.name}</h3>
                                <p style={styles.sizeText}>Size: {item.size || "N/A"}</p>
                                <div style={styles.quantityContainer}>
                                    <button onClick={() => decreaseQty(item._id)} style={styles.qtyBtn}>-</button>
                                    <span style={styles.qtyText}>{item.quantity}</span>
                                    <button onClick={() => increaseQty(item._id)} style={styles.qtyBtn}>+</button>
                                </div>
                            </div>
                            <div style={styles.priceSection}>
                                <p style={styles.price}>₹{item.price}</p>
                                <p style={styles.discount}>-₹{item.discount || 0}</p>
                            </div>
                            <button onClick={() => removeItem(item._id)} style={styles.removeBtn}>🗑 Remove</button>
                        </div>
                    ))
                ) : (
                    <p style={styles.emptyCartText}>🛒 Your cart is empty</p>
                )}

                <div style={styles.userForm}>
                    <h3>User Information</h3>
                    <input name="fullName" placeholder="Full Name" onChange={handleInputChange} value={userInfo.fullName} />
                    <input name="address" placeholder="Address" onChange={handleInputChange} value={userInfo.address} />
                    <input name="phone" placeholder="Phone Number" onChange={handleInputChange} value={userInfo.phone} />
                </div>
                <div style={styles.paymentMethod}>
                    <h3>Payment Method</h3>
                    <select onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
                        <option>Cash on Delivery</option>
                        <option>Online Payment</option>
                    </select>
                </div>

                <div style={styles.summary}>
                    <h3 style={styles.summaryHeading}>Price Details</h3>
                    <p>Total Items: <span style={styles.summaryValue}>{totalQuantity}</span></p>
                    <p>Total MRP: <span style={styles.summaryValue}>₹{totalMRP}</span></p>
                    <p>Discount: <span style={styles.discount}>-₹{totalDiscount}</span></p>
                    <p>Platform Fee: <span style={styles.summaryValue}>₹{platformFee}</span></p>
                    <h3>Total Amount: <span style={styles.finalAmount}>₹{finalAmount}</span></h3>
                    <button style={styles.placeOrderBtn} onClick={handlePlaceOrder}>
                        {isAuthenticated ? "PLACE ORDER" : "REGISTER TO PLACE ORDER"}
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};


// Updated CSS Styles
const styles = {
    page: { background: "#f8f8f8", minHeight: "100vh", paddingBottom: "20px" },
    container: { width: "100%", maxWidth: "900px", margin: "auto", padding: "20px", borderRadius: "8px", background: "#fff", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" },
    heading: { textAlign: "center", marginBottom: "20px", fontSize: "24px", color: "#333" },
    loadingText: { textAlign: "center" },
    cartItem: { display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ddd", padding: "15px 0" },
    image: { width: "90px", height: "90px", objectFit: "contain", borderRadius: "5px" },
    details: { flex: 1, paddingLeft: "10px" },
    sizeText: { color: "#666", fontSize: "14px" },
    quantityContainer: { display: "flex", alignItems: "center", gap: "8px", marginTop: "5px" },
    qtyBtn: { padding: "6px 12px", border: "none", background: "#ddd", cursor: "pointer", fontSize: "16px", borderRadius: "5px" },
    qtyText: { fontSize: "16px", fontWeight: "bold" },
    priceSection: { textAlign: "right", minWidth: "100px" },
    price: { fontSize: "18px", fontWeight: "bold" },
    discount: { color: "red", fontSize: "14px" },
    removeBtn: { background: "#ff3f6c", color: "white", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer", fontSize: "14px" },
    summary: { marginTop: "20px", padding: "15px", borderRadius: "8px", background: "#fff", boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)" },
    placeOrderBtn: { width: "100%", padding: "12px", background: "#ff3f6c", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" },
    userForm: {
        marginTop: "20px",
        padding: "15px",
        borderRadius: "8px",
        background: "#f9f9f9",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "8px 20px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        fontSize: "14px",
    },
    paymentMethod: {
        marginTop: "20px",
        padding: "15px",
        borderRadius: "8px",
        background: "#f9f9f9",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
    },
    select: {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        fontSize: "14px",
        border: "1px solid #ddd",
    },
    placeOrderBtnHover: {
        background: "#e02e55",
    },
};

export default CartPage;
