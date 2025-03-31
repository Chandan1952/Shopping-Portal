import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";

const BASE_URL = "https://shopping-portal-backend.onrender.com"; // Backend URL

const DashboardCard = ({ title, count, color }) => {
  return (
    <div style={{ ...styles.card, backgroundColor: color }}>
      <div style={styles.cardInner}>
        <h3 style={styles.cardCount}>{count}</h3>
        <p style={styles.cardTitle}>{title}</p>
      </div>
    </div>
  );
};

const Dashboard = ({ stats, loading, error }) => {
  if (loading) return <p style={styles.loading}>Loading stats...</p>;
  if (error) return <p style={styles.errorMessage}>{error}</p>;

  return (
    <div style={styles.flexContainer}>
      <div style={styles.dashboardContainer}>
        <div style={styles.dashboardTitleBox}>
          <h1 style={styles.dashboardTitle}>Admin Dashboard</h1>
        </div>
        <div style={styles.gridContainer}>
          {stats.map((stat, index) => (
            <DashboardCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
};

function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/admin-dashboard`, { withCredentials: true });
    const fetchedStats = response.data.stats || {};

    setStats([
      { title: "Banner", count: fetchedStats.Image || 0, color: "#1E3A8A" },
      { title: "Brands", count: fetchedStats.Brand || 0, color: "#10B981" },
      { title: "Products", count: fetchedStats.Product || 0, color: "#EAB308" },
      { title: "Categories", count: fetchedStats.Category || 0, color: "#EF4444" },
    ]);
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    setError("Failed to fetch stats. Please try again.");
  } finally {
    setLoading(false);
  }
};

    fetchStats();
  }, []);

  return (
    <div style={styles.app}>
      <AdminHeader />
      <div style={styles.mainContainer}>
        <AdminSidebar />
        <div style={styles.content}>
          <div style={styles.dashboardTitleBox}>
            <h2 style={styles.dashboardSubtitle}>Welcome to the Admin Dashboard!</h2>
          </div>
          <Dashboard stats={stats} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    marginLeft: "200px"
  },
  mainContainer: {
    display: "flex",
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: "20px",
  },
  loading: {
    fontSize: "18px",
    color: "#333",
    textAlign: "center",
  },
  errorMessage: {
    fontSize: "18px",
    color: "red",
    textAlign: "center",
  },
  flexContainer: {
    display: "flex",
  },
  dashboardContainer: {
    width: "75%",
    padding: "24px",
  },
  dashboardTitleBox: {
    textAlign: "center",
    marginBottom: "24px",
    border: "1px solid #ccc",
    padding: "16px",
    borderRadius: "8px",
  },
  dashboardTitle: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  dashboardSubtitle: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
  },
  card: {
    padding: "16px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    color: "white",
  },
  cardInner: {
    textAlign: "center",
    padding: "16px",
    border: "1px solid white",
    borderRadius: "8px",
  },
  cardCount: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: "18px",
  },
};

export default AdminDashboard;
