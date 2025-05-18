import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminHeader = () => {
  const [admin, setAdmin] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    axios
      .get("http://localhost:5000/api/admin", { withCredentials: true })
      .then((response) => setAdmin(response.data))
      .catch((error) => console.error("Error fetching admin details:", error));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/admin-logout", {}, { withCredentials: true });
      setAdmin(null);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff",
        color: "#2d3748",
        padding: "15px 30px",
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid #e2e8f0"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "20px"
        }}>
          <h1 style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            margin: 0,
            color: "#4a5568",
            letterSpacing: "0.5px"
          }}>Admin Dashboard</h1>
          <div style={{
            display: "flex",
            gap: "15px"
          }}>
            <a href="/admin" style={{
              color: "#4a5568",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "0.9rem",
              padding: "5px 10px",
              borderRadius: "6px",
              transition: "all 0.2s",
              ":hover": {
                backgroundColor: "#f7fafc",
                color: "#4299e1"
              }
            }}>Home</a>
            <a href="/admin/users" style={{
              color: "#4a5568",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "0.9rem",
              padding: "5px 10px",
              borderRadius: "6px",
              transition: "all 0.2s",
              ":hover": {
                backgroundColor: "#f7fafc",
                color: "#4299e1"
              }
            }}>Users</a>
            <a href="/admin/settings" style={{
              color: "#4a5568",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "0.9rem",
              padding: "5px 10px",
              borderRadius: "6px",
              transition: "all 0.2s",
              ":hover": {
                backgroundColor: "#f7fafc",
                color: "#4299e1"
              }
            }}>Settings</a>
          </div>
        </div>
        
        <div style={{
          position: "relative"
        }}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#4299e1",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "42px",
              height: "42px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              ":hover": {
                backgroundColor: "#3182ce",
                transform: "scale(1.05)"
              }
            }}
          >
            {admin && admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
          </button>
          
          {dropdownOpen && (
            <div style={{
              position: "absolute",
              top: "55px",
              right: "0",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              width: "280px",
              zIndex: 1001,
              padding: "20px",
              animation: "fadeIn 0.2s ease-out",
              border: "1px solid #e2e8f0"
            }}>
              {admin ? (
                <>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "15px"
                  }}>
                    <div style={{
                      backgroundColor: "#ebf8ff",
                      color: "#3182ce",
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      fontWeight: "600"
                    }}>
                      {admin.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{
                        margin: 0,
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#2d3748"
                      }}>{admin.name}</h3>
                      <p style={{
                        margin: "3px 0 0",
                        fontSize: "0.85rem",
                        color: "#718096"
                      }}>{admin.email}</p>
                    </div>
                  </div>
                  <div style={{
                    borderTop: "1px solid #e2e8f0",
                    paddingTop: "15px"
                  }}>
                    <button 
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "transparent",
                        color: "#e53e3e",
                        border: "1px solid #e53e3e",
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        ":hover": {
                          backgroundColor: "#fff5f5",
                          borderColor: "#c53030"
                        }
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17L21 12L16 7" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12H9" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div style={{
                  textAlign: "center",
                  padding: "10px"
                }}>
                  <p style={{
                    color: "#718096",
                    marginBottom: "15px"
                  }}>Please login to continue</p>
                  <a href="/admin-login" style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    backgroundColor: "#4299e1",
                    color: "white",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                    transition: "all 0.2s",
                    ":hover": {
                      backgroundColor: "#3182ce"
                    }
                  }}>Login</a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind the fixed header */}
      <div style={{ height: "75px" }}></div>
    </>
  );
};

export default AdminHeader;