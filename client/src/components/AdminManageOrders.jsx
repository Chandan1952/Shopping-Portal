import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaShippingFast, FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminSession = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin-verify", { withCredentials: true });
        if (!response.data.isAdmin) {
          navigate("/admin-login", { replace: true });
        }
      } catch {
        navigate("/admin-login", { replace: true });
      }
    };

    verifyAdminSession();
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/orders", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Unauthorized: Please log in");
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
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/approve`, { method: "PUT" });
      if (!response.ok) throw new Error("Failed to approve order");

      setOrders(orders.map(order => order._id === orderId ? { ...order, status: "Approved" } : order));
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkShipped = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/shipped`, { method: "PUT" });
      if (!response.ok) throw new Error("Failed to update order status");

      setOrders(orders.map(order => order._id === orderId ? { ...order, status: "Shipped" } : order));
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveReturn = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/approve-return`, { method: "PUT" });
      if (!response.ok) throw new Error("Failed to approve return request");

      setOrders(orders.map(order => order._id === orderId ? { ...order, status: "Return Approved" } : order));
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelReturn = async (orderId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel-return`, { method: "PUT" });
      if (!response.ok) throw new Error("Failed to cancel return request");

      setOrders(orders.map(order => order._id === orderId ? { ...order, status: "Return Denied" } : order));
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
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete order");

      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userInfo?.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Loading orders...</p>
    </div>
  );

  if (error) return (
    <div style={styles.errorContainer}>
      <p style={styles.errorText}>{error}</p>
      <button style={styles.retryButton} onClick={fetchOrders}>Retry</button>
    </div>
  );

  return (
    <>
      <AdminHeader />
      <div style={styles.container}>
        <AdminSidebar />
        <div style={styles.content}>
          <div style={styles.header}>
            <h2 style={styles.heading}>Order Management</h2>
            <div style={styles.controls}>
              <div style={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search orders..."
                  style={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                style={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Shipped">Shipped</option>
                <option value="Return Requested">Return Requested</option>
                <option value="Return Approved">Return Approved</option>
                <option value="Return Denied">Return Denied</option>
              </select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No orders found matching your criteria</p>
              <button style={styles.resetButton} onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.tableHeaderCell}>Order ID</th>
                    <th style={styles.tableHeaderCell}>Customer</th>
                    <th style={styles.tableHeaderCell}>Contact</th>
                    <th style={styles.tableHeaderCell}>Amount</th>
                    <th style={styles.tableHeaderCell}>Status</th>
                    <th style={styles.tableHeaderCell}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order._id} style={styles.tableRow}>
                      <td style={styles.tableCell} title={order._id}>
                        {order._id.substring(0, 8)}...
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.customerInfo}>
                          <p style={styles.customerName}>{order.userId?.fullName || "N/A"}</p>
                          <p style={styles.customerAddress}>{order.userInfo?.address || "N/A"}</p>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        {order.userId?.phone || order.userInfo?.phone || "N/A"}
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.amount}>Rs. {order.totalAmount}</span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.status[order.status.replace(/\s+/g, '')]}>
                          {order.status}
                        </span>
                        {order.returnReason && (
                          <div style={styles.returnReason} title={order.returnReason}>
                            <small>Reason: {order.returnReason.substring(0, 20)}...</small>
                          </div>
                        )}
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.actionButtons}>
                          {order.status === "Pending" && (
                            <button 
                              style={styles.buttonApprove} 
                              onClick={() => handleApproveOrder(order._id)} 
                              disabled={actionLoading}
                            >
                              <FaCheck style={styles.buttonIcon} />
                              {actionLoading ? "Processing..." : "Approve"}
                            </button>
                          )}
                          {order.status === "Approved" && (
                            <button 
                              style={styles.buttonShip} 
                              onClick={() => handleMarkShipped(order._id)}
                            >
                              <FaShippingFast style={styles.buttonIcon} />
                              Ship
                            </button>
                          )}
                          {order.status === "Return Requested" && (
                            <>
                              <button 
                                style={styles.buttonApprove} 
                                onClick={() => handleApproveReturn(order._id)}
                              >
                                <FaCheck style={styles.buttonIcon} />
                                Approve
                              </button>
                              <button 
                                style={styles.buttonCancel} 
                                onClick={() => handleCancelReturn(order._id)}
                              >
                                <FaTimes style={styles.buttonIcon} />
                                Deny
                              </button>
                            </>
                          )}
                          <button 
                            style={styles.buttonView}
                            onClick={() => navigate(`/admin/orders/${order._id}`)}
                          >
                            <FaEye style={styles.buttonIcon} />
                            View
                          </button>
                          <button 
                            style={styles.buttonDelete} 
                            onClick={() => handleDeleteOrder(order._id)}
                          >
                            <FaTrashAlt style={styles.buttonIcon} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
  },
  content: {
    flex: 1,
    padding: "30px",
    marginLeft: "220px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: "0",
  },
  controls: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  searchContainer: {
    position: "relative",
  },
  searchInput: {
    padding: "10px 15px",
    paddingLeft: "40px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    width: "250px",
    fontSize: "14px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    transition: "all 0.3s",
    outline: "none",
    ":focus": {
      borderColor: "#3498db",
      boxShadow: "0 2px 8px rgba(52,152,219,0.2)",
    },
  },
  filterSelect: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    transition: "all 0.3s",
    ":focus": {
      borderColor: "#3498db",
    },
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#3498db",
    color: "white",
  },
  tableHeaderCell: {
    padding: "15px 20px",
    textAlign: "left",
    fontWeight: "500",
    fontSize: "14px",
  },
  tableRow: {
    borderBottom: "1px solid #f0f0f0",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#f8fafc",
    },
  },
  tableCell: {
    padding: "15px 20px",
    fontSize: "14px",
    color: "#555",
  },
  customerInfo: {
    display: "flex",
    flexDirection: "column",
  },
  customerName: {
    fontWeight: "500",
    color: "#2c3e50",
    margin: "0 0 5px 0",
  },
  customerAddress: {
    fontSize: "13px",
    color: "#7f8c8d",
    margin: "0",
  },
  amount: {
    fontWeight: "600",
    color: "#2c3e50",
  },
  status: {
    Pending: {
      display: "inline-block",
      padding: "5px 10px",
      borderRadius: "20px",
      backgroundColor: "#fff3cd",
      color: "#856404",
      fontSize: "12px",
      fontWeight: "500",
    },
    Approved: {
      display: "inline-block",
      padding: "5px 10px",
      borderRadius: "20px",
      backgroundColor: "#d4edda",
      color: "#155724",
      fontSize: "12px",
      fontWeight: "500",
    },
    Shipped: {
      display: "inline-block",
      padding: "5px 10px",
      borderRadius: "20px",
      backgroundColor: "#cce5ff",
      color: "#004085",
      fontSize: "12px",
      fontWeight: "500",
    },
    ReturnRequested: {
      display: "inline-block",
      padding: "5px 10px",
      borderRadius: "20px",
      backgroundColor: "#fff3cd",
      color: "#856404",
      fontSize: "12px",
      fontWeight: "500",
    },
    ReturnApproved: {
      display: "inline-block",
      padding: "5px 10px",
      borderRadius: "20px",
      backgroundColor: "#d4edda",
      color: "#155724",
      fontSize: "12px",
      fontWeight: "500",
    },
    ReturnDenied: {
      display: "inline-block",
      padding: "5px 10px",
      borderRadius: "20px",
      backgroundColor: "#f8d7da",
      color: "#721c24",
      fontSize: "12px",
      fontWeight: "500",
    },
  },
  returnReason: {
    marginTop: "5px",
    fontSize: "12px",
    color: "#7f8c8d",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "150px",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  buttonIcon: {
    marginRight: "5px",
  },
  buttonApprove: {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "#218838",
      transform: "translateY(-1px)",
    },
  },
  buttonShip: {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "#138496",
      transform: "translateY(-1px)",
    },
  },
  buttonCancel: {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "#c82333",
      transform: "translateY(-1px)",
    },
  },
  buttonView: {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "#5a6268",
      transform: "translateY(-1px)",
    },
  },
  buttonDelete: {
    display: "flex",
    alignItems: "center",
    padding: "8px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "#c82333",
      transform: "translateY(-1px)",
    },
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  emptyText: {
    fontSize: "16px",
    color: "#7f8c8d",
    marginBottom: "20px",
  },
  resetButton: {
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "#2980b9",
    },
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f7fa",
  },
  spinner: {
    border: "4px solid rgba(0, 0, 0, 0.1)",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    borderLeftColor: "#3498db",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  loadingText: {
    fontSize: "18px",
    color: "#2c3e50",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f7fa",
  },
  errorText: {
    fontSize: "18px",
    color: "#e74c3c",
    marginBottom: "20px",
  },
  retryButton: {
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "#2980b9",
    },
  },
};

export default AdminManageOrders;