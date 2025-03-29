import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();



  // ✅ Verify Admin Session
  useEffect(() => {
    const verifyAdminSession = async () => {
      try {
        const response = await axios.get("https://shopping-portal-backend.onrender.com/admin-verify", { withCredentials: true });
        if (!response.data.isAdmin) {
          navigate("/admin-login", { replace: true });
        }
      } catch {
        navigate("/admin-login", { replace: true });
      }
    };

    verifyAdminSession(); // ✅ Call the function inside useEffect
  }, [navigate]); // ✅ Add navigate as a dependency


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://shopping-portal-backend.onrender.com/api/admin/orders", {
        method: "GET",
        credentials: "include", // ✅ Allows cookies to be sent
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("❌ Unauthorized: Please log in");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrder = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`https://shopping-portal-backend.onrender.com/api/orders/${orderId}/approve`, { method: "PUT" });
      if (!response.ok) throw new Error("Failed to approve order");

      setOrders(orders.map(order => order._id === orderId ? { ...order, status: "Approved" } : order));
      alert("✅ Order approved successfully!");
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkShipped = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`https://shopping-portal-backend.onrender.com/api/orders/${orderId}/shipped`, { method: "PUT" });
      if (!response.ok) throw new Error("Failed to update order status");

      setOrders(orders.map(order => order._id === orderId ? { ...order, status: "Shipped" } : order));
      alert("✅ Order marked as shipped!");
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveReturn = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`https://shopping-portal-backend.onrender.com/api/orders/${orderId}/approve-return`, { method: "PUT" });
      if (!response.ok) throw new Error("Failed to approve return request");

      setOrders(orders.map(order => order._id === orderId ? { ...order, status: "Return Approved" } : order));
      alert("✅ Return request approved!");
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelReturn = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`https://shopping-portal-backend.onrender.com/api/orders/${orderId}/cancel-return`, { method: "PUT" });
      if (!response.ok) throw new Error("Failed to cancel return request");

      setOrders(orders.map(order => order._id === orderId ? { ...order, status: "Return Denied" } : order));
      alert("❌ Return request canceled.");
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    setActionLoading(true);
    try {
      const response = await fetch(`https://shopping-portal-backend.onrender.com/api/orders/${orderId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete order");

      setOrders(orders.filter(order => order._id !== orderId));
      alert("❌ Order deleted successfully!");
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p style={styles.loading}>Loading orders...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <>
      <AdminHeader />
      <div style={styles.container}>
        <AdminSidebar />
        <div style={styles.content}>
          <h2 style={styles.heading}>Manage Orders</h2>
          {orders.length === 0 ? <p style={styles.noOrders}>No orders found.</p> : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Payment Method</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Return Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={styles.tableRow}>
                    <td>{order._id}</td>
                    <td>{order.userId?.fullName || "N/A"}</td>
                    <td>{order.userId?.phone || order.userInfo?.phone || "N/A"}</td>
                    <td>{order.userInfo?.address || "N/A"}</td>
                    <td>{order.paymentMethod}</td>
                    <td>Rs. {order.totalAmount}</td>
                    <td style={styles.status[order.status]}>{order.status}</td>
                    <td>{order.returnReason || "N/A"}</td>
                    <td>
                      {order.status === "Pending" && (
                        <button style={styles.buttonApprove} onClick={() => handleApproveOrder(order._id)} disabled={actionLoading}>
                          {actionLoading ? "Processing..." : "Approve"}
                        </button>
                      )}
                      {order.status === "Approved" && (
                        <button style={styles.buttonShip} onClick={() => handleMarkShipped(order._id)}>Ship</button>
                      )}
                      {order.status === "Return Requested" && (
                        <>
                          <button style={styles.buttonApprove} onClick={() => handleApproveReturn(order._id)}>Approve Return</button>
                          <button style={styles.buttonDelete} onClick={() => handleCancelReturn(order._id)}>Cancel Return</button>
                        </>
                      )}
                      <button style={styles.buttonDelete} onClick={() => handleDeleteOrder(order._id)}>
                        <FaTrashAlt /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>
      </div>
    </>
  );
};

// 🔹 CSS Styles (Inline)
const styles = {
  container: { display: "flex", marginLeft: "220px" },
  content: { flex: 1, padding: "20px" },
  heading: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#333" },
  noOrders: { fontSize: "18px", color: "#777" },
  loading: { fontSize: "18px", color: "#007bff" },
  error: { fontSize: "18px", color: "red" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden" },
  tableHeader: { backgroundColor: "#007bff", color: "#fff", textAlign: "left" },
  tableRow: { borderBottom: "1px solid #ddd" },
  status: {
    Pending: { color: "#ff9800", fontWeight: "bold" },
    Approved: { color: "#4caf50", fontWeight: "bold" },
    Shipped: { color: "#2196f3", fontWeight: "bold" },
    "Return Requested": { color: "#ff9800", fontWeight: "bold" },
    "Return Approved": { color: "#4caf50", fontWeight: "bold" },
    "Return Denied": { color: "#e53935", fontWeight: "bold" },
  },
  buttonApprove: { backgroundColor: "#4caf50", color: "white", padding: "5px 10px", borderRadius: "5px", marginRight: "5px" },
  buttonShip: { backgroundColor: "#2196f3", color: "white", padding: "5px 10px", borderRadius: "5px", marginRight: "5px" },
  buttonDelete: { backgroundColor: "#e53935", color: "white", padding: "5px 10px", borderRadius: "5px" }
};

export default AdminManageOrders;
