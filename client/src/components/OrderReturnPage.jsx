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

    useEffect(() => {
        fetch("https://shopping-portal-wptg.onrender.com/api/auth/check", { credentials: "include" })
            .catch(() => console.error("Authentication check failed"));
    }, []);
    

    useEffect(() => {
        fetch("https://shopping-portal-wptg.onrender.com/api/orders", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch((error) => console.error("❌ Error fetching orders:", error));
    }, []);

    const handleReturn = (order) => {
        setSelectedOrder(order);
        setReturnDialog(true);
    };

    const handleCancelReturn = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this return request?")) return;

        try {
            const response = await fetch(`https://shopping-portal-wptg.onrender.com/api/orders/${orderId}/cancel-return`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (response.ok) {
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, returnStatus: "Cancelled" } : order
                ));
                alert("❌ Return request cancelled.");
            } else {
                alert("❌ Failed to cancel return request.");
            }
        } catch (error) {
            console.error("❌ Error:", error);
            alert("❌ Error cancelling return request.");
        }
    };

    const toggleExpand = (orderId) => {
        setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
    };

    const submitReturnRequest = async () => {
        if (!returnReason.trim()) {
            alert("❌ Please enter a return reason!");
            return;
        }

        try {
            const response = await fetch("https://shopping-portal-wptg.onrender.com/api/orders/return", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ orderId: selectedOrder._id, reason: returnReason }),
            });

            if (response.ok) {
                alert("✅ Return request submitted successfully!");
                setReturnDialog(false);
                setReturnReason("");

                // ✅ Fetch updated orders after submitting return request
                const updatedOrders = await fetch("https://shopping-portal-wptg.onrender.com/api/orders", { credentials: "include" })
                    .then((res) => res.json());
                setOrders(updatedOrders);
            } else {
                const errorData = await response.json();
                alert(errorData.error || "❌ Error submitting return request");
            }
        } catch (error) {
            console.error("❌ Error:", error);
            alert("❌ Error processing return request");
        }
    };


    return (
        <div>
            <Header />
            <div style={{ display: "flex", marginTop: "35px", padding: "0 16px", maxWidth: "1200px", margin: "auto" }}>
                <UserSidebar />
                <div style={{ flex: 1, margin: "0 20px" }}>
                    <h1>My Orders</h1>
                    {orders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

                                return (
                                    <div key={order._id} style={{ padding: "15px", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0,0,0,0.2)", backgroundColor: "white", marginBottom: "10px" }}>

                                        {/* Order Status, Quantity, and Total Amount */}
                                        <p style={{ fontWeight: "bold", color: "black" }}>
                                            Order Status:
                                            <span style={{
                                                color: order.status === "Delivered" ? "green" :
                                                    order.status === "Approved" ? "blue" : "orange"
                                            }}>
                                                {order.status}
                                            </span>
                                        </p>

                                        <p style={{ fontWeight: "bold", color: "black" }}>Total Items: {order.items.length}</p>
                                        <p style={{ fontWeight: "bold", color: "black" }}>Total Amount: Rs. {totalAmount}</p>

                                        {order.items.slice(0, expandedOrders[order._id] ? order.items.length : 1).map((item) => (
                                            <div key={item._id} style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "8px" }}>
                                                <img
                                                    src={
                                                        item.image?.startsWith("/uploads/")
                                                            ? `https://shopping-portal-wptg.onrender.com${item.image}`
                                                            : item.image || "https://via.placeholder.com/100"
                                                    }
                                                    alt={item.name}
                                                    style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover" }}
                                                    onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                                                />
                                                <div>
                                                    <span>{item.name}</span>
                                                    <span style={{ display: "block", fontWeight: "bold" }}>Price: Rs.{item.price}</span>
                                                    <span style={{ display: "block", fontWeight: "bold" }}>Size: {item.size}</span>
                                                    <span style={{ display: "block", fontWeight: "bold", color: "black" }}>Quantity: {item.quantity}</span>
                                                </div>
                                            </div>
                                        ))}

                                        {order.items.length > 1 && (
                                            <button onClick={() => toggleExpand(order._id)} style={{ border: "none", background: "none", color: "blue", cursor: "pointer" }}>
                                                {expandedOrders[order._id] ? "View Less" : "View More"}
                                            </button>
                                        )}

                                        {/* Return Status */}
                                        {order.returnStatus && (
                                            <p style={{ color: order.returnStatus === "Requested" ? "blue" : "red", fontWeight: "bold" }}>
                                                Return Status: {order.returnStatus}
                                            </p>
                                        )}

                                        {/* Return and Cancel Buttons */}
                                        {order.returnStatus === "Requested" ? (
                                            <button
                                                onClick={() => handleCancelReturn(order._id)}
                                                style={{
                                                    marginTop: "10px",
                                                    padding: "10px 15px",
                                                    borderRadius: "5px",
                                                    backgroundColor: "red",
                                                    color: "white",
                                                    cursor: "pointer",
                                                    border: "none",
                                                    fontSize: "16px",
                                                }}
                                            >
                                                Cancel Return Request
                                            </button>
                                        ) : (
                                            <button
                                                style={{
                                                    marginTop: "10px",
                                                    padding: "10px 15px",
                                                    borderRadius: "5px",
                                                    backgroundColor: "black",
                                                    color: "white",
                                                    cursor: "pointer",
                                                    border: "none",
                                                    fontSize: "16px",
                                                }}
                                                onClick={() => handleReturn(order)}
                                            >
                                                Return
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>




          {/* Return Dialog */}
{returnDialog && (
    <div style={{ 
        position: "fixed", 
        top: 0, left: 0, 
        width: "100%", height: "100%", 
        backgroundColor: "rgba(0, 0, 0, 0.5)", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center" 
    }}>
        <div style={{ 
            backgroundColor: "white", 
            padding: "20px", 
            borderRadius: "8px", 
            width: "400px", 
            textAlign: "center", 
            position: "relative" 
        }}>
            {/* Close Button */}
            <button 
                onClick={() => setReturnDialog(false)} 
                style={{ 
                    position: "absolute", 
                    top: "10px", right: "10px", 
                    border: "none", 
                    background: "red", 
                    color: "white", 
                    padding: "5px 10px", 
                    borderRadius: "5px", 
                    cursor: "pointer"
                }}
            >
                X
            </button>

            <h2>Return {selectedOrder?.items[0].name}</h2>
            <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Enter reason..."
                style={{ width: "100%", height: "80px", margin: "10px 0", padding: "10px" }}
            />
            <button 
                onClick={submitReturnRequest} 
                style={{
                    backgroundColor: "black",
                    color: "white",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                Submit Return
            </button>
        </div>
    </div>
)}


            <Footer />
        </div>
    );
}
