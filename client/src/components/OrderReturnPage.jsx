import React, { useState, useEffect } from "react";
import Header from "./Header";
import UserSidebar from "./UserSidebar";
import Footer from "./Footer";

export default function OrderReturnPage() {
    const [orders, setOrders] = useState([]);
    const [returnDialog, setReturnDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [returnReason, setReturnReason] = useState("");
    const [expandedOrders, setExpandedOrders] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("https://shopping-portal-backend.onrender.com/api/auth/check", { credentials: "include" })
            .catch(() => console.error("Authentication check failed"));
    }, []);
    
    useEffect(() => {
        fetch("https://shopping-portal-backend.onrender.com/api/orders", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                setOrders(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
                setIsLoading(false);
            });
    }, []);

    const handleReturn = (order) => {
        setSelectedOrder(order);
        setReturnDialog(true);
    };

    const handleCancelReturn = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this return request?")) return;

        try {
            const response = await fetch(`https://shopping-portal-backend.onrender.com/api/orders/${orderId}/cancel-return`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (response.ok) {
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, returnStatus: "Cancelled" } : order
                ));
                alert("Return request cancelled successfully!");
            } else {
                alert("Failed to cancel return request.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error cancelling return request.");
        }
    };

    const toggleExpand = (orderId) => {
        setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
    };

    const submitReturnRequest = async () => {
        if (!returnReason.trim()) {
            alert("Please enter a return reason!");
            return;
        }

        try {
            const response = await fetch("https://shopping-portal-backend.onrender.com/api/orders/return", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ orderId: selectedOrder._id, reason: returnReason }),
            });

            if (response.ok) {
                alert("Return request submitted successfully!");
                setReturnDialog(false);
                setReturnReason("");

                const updatedOrders = await fetch("https://shopping-portal-backend.onrender.com/api/orders", { credentials: "include" })
                    .then((res) => res.json());
                setOrders(updatedOrders);
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Error submitting return request");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error processing return request");
        }
    };

    // Styles
    const styles = {
        container: {
            display: "flex",
            minHeight: "calc(100vh - 160px)",
            maxWidth: "1400px",
            margin: "40px auto",
            gap: "30px",
            padding: "0 5%",
        },
        sidebar: {
            flex: "0 0 280px",
        },
        mainContent: {
            flex: "1",
        },
        header: {
            fontSize: "28px",
            fontWeight: "600",
            color: "#2c3e50",
            marginBottom: "30px",
            position: "relative",
            ":after": {
                content: '""',
                display: "block",
                width: "60px",
                height: "4px",
                background: "linear-gradient(to right, #3498db, #9b59b6)",
                marginTop: "10px",
                borderRadius: "2px",
            },
        },
        orderCard: {
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
            padding: "25px",
            marginBottom: "25px",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            ":hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            },
        },
        orderHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "15px",
            borderBottom: "1px solid #eee",
        },
        statusBadge: (status) => ({
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "600",
            backgroundColor: 
                status === "Delivered" ? "#d4edda" : 
                status === "Approved" ? "#d1ecf1" : "#fff3cd",
            color: 
                status === "Delivered" ? "#155724" : 
                status === "Approved" ? "#0c5460" : "#856404",
        }),
        paymentBadge: (status) => ({
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "600",
            backgroundColor: 
                status === "Paid" ? "#d4edda" : 
                status === "Pending" ? "#fff3cd" : "#f8d7da",
            color: 
                status === "Paid" ? "#155724" : 
                status === "Pending" ? "#856404" : "#721c24",
        }),
        itemContainer: {
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "15px",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#f8f9fa",
        },
        itemImage: {
            width: "80px",
            height: "80px",
            borderRadius: "8px",
            objectFit: "cover",
            border: "1px solid #eee",
        },
        itemDetails: {
            flex: "1",
        },
        itemName: {
            fontWeight: "600",
            marginBottom: "5px",
            color: "#2c3e50",
        },
        itemPrice: {
            color: "#e74c3c",
            fontWeight: "600",
            marginRight: "15px",
        },
        viewMoreBtn: {
            background: "none",
            border: "none",
            color: "#3498db",
            cursor: "pointer",
            fontWeight: "600",
            padding: "5px 0",
            margin: "10px 0",
            display: "flex",
            alignItems: "center",
            gap: "5px",
        },
        returnStatus: (status) => ({
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "600",
            backgroundColor: status === "Requested" ? "#d1ecf1" : "#f8d7da",
            color: status === "Requested" ? "#0c5460" : "#721c24",
            margin: "15px 0",
            display: "inline-block",
        }),
        actionButton: {
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            border: "none",
            transition: "all 0.3s ease",
            fontSize: "14px",
        },
        returnButton: {
            background: "linear-gradient(to right, #3498db, #9b59b6)",
            color: "white",
            ":hover": {
                background: "linear-gradient(to right, #2980b9, #8e44ad)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            },
        },
        cancelButton: {
            background: "#e74c3c",
            color: "white",
            ":hover": {
                background: "#c0392b",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            },
        },
        modalOverlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
        },
        modalContent: {
            backgroundColor: "white",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "500px",
            padding: "30px",
            position: "relative",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
        },
        closeButton: {
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#7f8c8d",
            ":hover": {
                color: "#e74c3c",
            },
        },
        modalTitle: {
            fontSize: "22px",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#2c3e50",
        },
        textarea: {
            width: "100%",
            minHeight: "120px",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            marginBottom: "20px",
            fontSize: "15px",
            ":focus": {
                borderColor: "#3498db",
                outline: "none",
                boxShadow: "0 0 0 3px rgba(52, 152, 219, 0.2)",
            },
        },
        submitButton: {
            background: "linear-gradient(to right, #2ecc71, #27ae60)",
            color: "white",
            padding: "12px 25px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "16px",
            width: "100%",
            transition: "all 0.3s ease",
            ":hover": {
                background: "linear-gradient(to right, #27ae60, #219653)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            },
        },
        loading: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            fontSize: "18px",
            color: "#7f8c8d",
        },
        emptyState: {
            textAlign: "center",
            padding: "50px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            color: "#7f8c8d",
        },
    };

    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <Header />
            <div style={styles.container}>
                <div style={styles.sidebar}>
                    <UserSidebar />
                </div>
                
                <div style={styles.mainContent}>
                    <h1 style={styles.header}>My Orders</h1>
                    
                    {isLoading ? (
                        <div style={styles.loading}>Loading your orders...</div>
                    ) : orders.length === 0 ? (
                        <div style={styles.emptyState}>
                            <h3>No orders found</h3>
                            <p>You haven't placed any orders yet.</p>
                        </div>
                    ) : (
                        <div>
                            {orders.map((order) => {
                                const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

                                return (
                                    <div key={order._id} style={styles.orderCard}>
                                        <div style={styles.orderHeader}>
                                            <div>
                                                <p style={{ fontWeight: "600", marginBottom: "5px" }}>
                                                    Order #{order._id.slice(-6).toUpperCase()}
                                                </p>
                                                <p style={{ color: "#7f8c8d", fontSize: "14px" }}>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div style={styles.statusBadge(order.status)}>
                                                {order.status}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: "15px" }}>
                                            <p style={{ fontWeight: "600", marginBottom: "5px" }}>
                                                Total: Rs. {totalAmount.toFixed(2)}
                                            </p>
                                            {order.paymentMethod === "COD" ? (
                                                <p style={styles.paymentBadge("COD")}>
                                                    Cash on Delivery
                                                </p>
                                            ) : (
                                                order.paymentStatus && (
                                                    <p style={styles.paymentBadge(order.paymentStatus)}>
                                                        {order.paymentStatus}
                                                    </p>
                                                )
                                            )}
                                        </div>

                                        {order.items.slice(0, expandedOrders[order._id] ? order.items.length : 1).map((item) => (
                                            <div key={item._id} style={styles.itemContainer}>
                                                <img
                                                    src={
                                                        item.image?.startsWith("/uploads/")
                                                            ? `https://shopping-portal-backend.onrender.com${item.image}`
                                                            : item.image || "https://via.placeholder.com/100"
                                                    }
                                                    alt={item.name}
                                                    style={styles.itemImage}
                                                    onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                                                />
                                                <div style={styles.itemDetails}>
                                                    <p style={styles.itemName}>{item.name}</p>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                                        <span style={styles.itemPrice}>Rs. {item.price}</span>
                                                        <span style={{ color: "#7f8c8d" }}>Size: {item.size}</span>
                                                        <span style={{ color: "#7f8c8d" }}>Qty: {item.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {order.items.length > 1 && (
                                            <button 
                                                onClick={() => toggleExpand(order._id)} 
                                                style={styles.viewMoreBtn}
                                            >
                                                {expandedOrders[order._id] ? (
                                                    <>
                                                        <span>Show less</span>
                                                        <span>↑</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Show {order.items.length - 1} more items</span>
                                                        <span>↓</span>
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {order.returnStatus && (
                                            <div style={styles.returnStatus(order.returnStatus)}>
                                                Return: {order.returnStatus}
                                            </div>
                                        )}

                                        <div style={{ display: "flex", gap: "15px" }}>
                                            {order.returnStatus === "Requested" ? (
                                                <button
                                                    onClick={() => handleCancelReturn(order._id)}
                                                    style={{ ...styles.actionButton, ...styles.cancelButton }}
                                                >
                                                    Cancel Return
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleReturn(order)}
                                                    style={{ ...styles.actionButton, ...styles.returnButton }}
                                                    disabled={order.status !== "Delivered"}
                                                >
                                                    Request Return
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Return Dialog Modal */}
            {returnDialog && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <button 
                            onClick={() => {
                                setReturnDialog(false);
                                setReturnReason("");
                            }}
                            style={styles.closeButton}
                        >
                            ×
                        </button>
                        <h3 style={styles.modalTitle}>Request Return</h3>
                        <p style={{ marginBottom: "20px", color: "#7f8c8d" }}>
                            You're requesting a return for order #{selectedOrder?._id.slice(-6).toUpperCase()}
                        </p>
                        
                        <textarea
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                            placeholder="Please explain the reason for your return..."
                            style={styles.textarea}
                        />
                        
                        <button
                            onClick={submitReturnRequest}
                            style={styles.submitButton}
                        >
                            Submit Return Request
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
