import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { FiPieChart, FiImage, FiTag, FiShoppingBag, FiLayers } from "react-icons/fi";
import { BsGraphUp, BsPeople } from "react-icons/bs";

const BASE_URL = "http://localhost:5000";

const DashboardCard = ({ title, count, color, icon }) => {
  const IconComponent = icon;
  return (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      borderLeft: `4px solid ${color}`,
      ':hover': {
        transform: "translateY(-5px)",
        boxShadow: `0 8px 25px ${color}20`
      }
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <p style={{
            color: "#718096",
            fontSize: "14px",
            fontWeight: "500",
            marginBottom: "8px",
            textTransform: "uppercase"
          }}>{title}</p>
          <h3 style={{
            color: "#2D3748",
            fontSize: "28px",
            fontWeight: "700",
            margin: "0"
          }}>{count}</h3>
        </div>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: `${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color
        }}>
          <IconComponent size={20} />
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ stats, loading, error }) => {
  if (loading) return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "300px"
    }}>
      <div style={{
        display: "inline-block",
        width: "50px",
        height: "50px",
        border: "3px solid rgba(99, 102, 241, 0.3)",
        borderRadius: "50%",
        borderTopColor: "#6366F1",
        animation: "spin 1s ease-in-out infinite"
      }}></div>
    </div>
  );

  if (error) return (
    <div style={{
      background: "#FEE2E2",
      color: "#B91C1C",
      padding: "16px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "20px 0"
    }}>
      <svg style={{ marginRight: "8px" }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#B91C1C"/>
      </svg>
      {error}
    </div>
  );

  return (
    <div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "24px",
        marginBottom: "32px"
      }}>
        {stats.map((stat, index) => (
          <DashboardCard 
            key={index} 
            title={stat.title} 
            count={stat.count} 
            color={stat.color} 
            icon={stat.icon}
          />
        ))}
      </div>
      
      {/* Additional Dashboard Sections */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px"
      }}>
        {/* Recent Activity */}
        <div style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px"
          }}>
            <h3 style={{
              color: "#2D3748",
              fontSize: "18px",
              fontWeight: "600",
              margin: "0"
            }}>Recent Activity</h3>
            <button style={{
              background: "none",
              border: "none",
              color: "#6366F1",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer"
            }}>View All</button>
          </div>
          <div style={{
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#718096"
          }}>
            Activity feed will appear here
          </div>
        </div>
        
        {/* Quick Stats */}
        <div style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
        }}>
          <h3 style={{
            color: "#2D3748",
            fontSize: "18px",
            fontWeight: "600",
            margin: "0 0 20px 0"
          }}>Quick Stats</h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px"
          }}>
            <div style={{
              background: "#F0F9FF",
              borderRadius: "8px",
              padding: "12px",
              textAlign: "center"
            }}>
              <BsPeople size={24} color="#3B82F6" />
              <p style={{
                color: "#3B82F6",
                fontSize: "14px",
                fontWeight: "600",
                margin: "8px 0 0 0"
              }}>Users</p>
              <p style={{
                color: "#1E3A8A",
                fontSize: "20px",
                fontWeight: "700",
                margin: "4px 0 0 0"
              }}>0</p>
            </div>
            <div style={{
              background: "#ECFDF5",
              borderRadius: "8px",
              padding: "12px",
              textAlign: "center"
            }}>
              <BsGraphUp size={24} color="#10B981" />
              <p style={{
                color: "#10B981",
                fontSize: "14px",
                fontWeight: "600",
                margin: "8px 0 0 0"
              }}>Sales</p>
              <p style={{
                color: "#065F46",
                fontSize: "20px",
                fontWeight: "700",
                margin: "4px 0 0 0"
              }}>0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminSession = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin-verify`, { withCredentials: true });
        if (response.data.isAdmin) {
          setAdmin({ email: response.data.email });
        } else {
          navigate("/admin-login", { replace: true });
        }
      } catch {
        navigate("/admin-login", { replace: true });
      }
    };

    const fetchStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin-dashboard`, { withCredentials: true });
        const fetchedStats = response.data.stats || {};

        const formattedStats = [
          { title: "Banners", count: fetchedStats.Image || 0, color: "#6366F1", icon: FiImage },
          { title: "Brands", count: fetchedStats.Brand || 0, color: "#10B981", icon: FiTag },
          { title: "Products", count: fetchedStats.Product || 0, color: "#F59E0B", icon: FiShoppingBag },
          { title: "Categories", count: fetchedStats.Category || 0, color: "#EF4444", icon: FiLayers },
        ];

        setStats(formattedStats);
      } catch {
        setError("Failed to fetch dashboard statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    verifyAdminSession();
    fetchStats();
  }, [navigate]);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#F7FAFC"
    }}>
      <AdminSidebar />
      <div style={{
        flex: "1",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        <AdminHeader admin={admin} />
        <main style={{
          flex: "1",
          padding: "32px",
          overflowY: "auto"
        }}>
          <div style={{
            maxWidth: "1200px",
            margin: "0 auto"
          }}>
            <div style={{
              marginBottom: "32px"
            }}>
              <h1 style={{
                color: "#2D3748",
                fontSize: "24px",
                fontWeight: "700",
                margin: "0 0 8px 0"
              }}>Dashboard Overview</h1>
              <p style={{
                color: "#718096",
                fontSize: "14px",
                margin: "0"
              }}>Welcome back, {admin?.email || "Admin"}! Here's what's happening with your store today.</p>
            </div>
            <Dashboard stats={stats} loading={loading} error={error} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;