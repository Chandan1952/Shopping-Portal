import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const styles = {
  container: {
    padding: "20px 30px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5f7fa",
    minHeight: "calc(100vh - 120px)",
    borderRadius: "10px",
    boxShadow: "0 2px 15px rgba(0, 0, 0, 0.1)",
    marginTop: "20px",
    marginLeft: "250px", // To account for sidebar width
  },
  heading: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "25px",
    color: "#2c3e50",
    textAlign: "center",
    position: "relative",
    paddingBottom: "10px",
  },
  headingUnderline: {
    content: '""',
    position: "absolute",
    bottom: "0",
    left: "50%",
    transform: "translateX(-50%)",
    width: "80px",
    height: "4px",
    background: "linear-gradient(90deg, #3498db, #9b59b6)",
    borderRadius: "2px",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    gap: "15px",
  },
  searchInput: {
    flex: "1",
    padding: "12px 20px",
    fontSize: "16px",
    border: "1px solid #e0e0e0",
    borderRadius: "30px",
    outline: "none",
    transition: "all 0.3s",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  },
  searchInputFocus: {
    borderColor: "#3498db",
    boxShadow: "0 2px 15px rgba(52, 152, 219, 0.2)",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    backgroundColor: "white",
    borderRadius: "10px",
    overflow: "hidden",
  },
  th: {
    backgroundColor: "#34495e",
    color: "white",
    padding: "15px",
    textAlign: "left",
    fontWeight: "500",
    fontSize: "15px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    position: "sticky",
    top: "0",
  },
  td: {
    padding: "15px",
    borderBottom: "1px solid #f0f0f0",
    color: "#555",
    fontSize: "14px",
  },
  trHover: {
    backgroundColor: "#f8f9fa",
    transition: "background-color 0.2s",
  },
  button: {
    padding: "8px 15px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  readButton: {
    backgroundColor: "#2ecc71",
    color: "white",
  },
  pendingButton: {
    backgroundColor: "#e74c3c",
    color: "white",
  },
  statusIndicator: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "8px",
  },
  readIndicator: {
    backgroundColor: "#2ecc71",
  },
  pendingIndicator: {
    backgroundColor: "#e74c3c",
  },
  messageCell: {
    maxWidth: "300px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  dateCell: {
    whiteSpace: "nowrap",
  },
  noResults: {
    textAlign: "center",
    padding: "30px",
    color: "#7f8c8d",
    fontSize: "16px",
  },
};

export default function ManageQueries() {
  const [queries, setQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminSession = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin-verify", { 
          withCredentials: true 
        });
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
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/allqueries");
      const data = await response.json();
      setQueries(data);
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  const updateQueryStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/query/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const updatedQuery = await response.json();
      
      setQueries((prevQueries) =>
        prevQueries.map((query) =>
          query._id === id ? { ...query, status: updatedQuery.status } : query
        )
      );
    } catch (error) {
      console.error("Error updating query status:", error);
    }
  };

  const filteredQueries = queries.filter((query) =>
    query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <div style={styles.container}>
        <h2 style={styles.heading}>
          Manage Contact Queries
          <span style={styles.headingUnderline}></span>
        </h2>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name, email or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            style={{
              ...styles.searchInput,
              ...(isSearchFocused ? styles.searchInputFocus : {}),
            }}
          />
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Message</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.length > 0 ? (
                filteredQueries.map((query, index) => (
                  <tr 
                    key={query._id} 
                    style={{ ...styles.tr, ':hover': styles.trHover }}
                  >
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>
                      <strong>{query.name}</strong>
                    </td>
                    <td style={styles.td}>
                      <a href={`mailto:${query.email}`}>{query.email}</a>
                    </td>
                    <td style={{ ...styles.td, ...styles.messageCell }} title={query.message}>
                      {query.message}
                    </td>
                    <td style={{ ...styles.td, ...styles.dateCell }}>
                      {new Date(query.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusIndicator,
                        ...(query.status === "Read" ? styles.readIndicator : styles.pendingIndicator)
                      }}></span>
                      {query.status}
                    </td>
                    <td style={styles.td}>
                      {query.status === "Read" ? (
                        <button
                          style={{ ...styles.button, ...styles.pendingButton }}
                          onClick={() => updateQueryStatus(query._id, "Pending")}
                          title="Mark as pending"
                        >
                          Reopen
                        </button>
                      ) : (
                        <button
                          style={{ ...styles.button, ...styles.readButton }}
                          onClick={() => updateQueryStatus(query._id, "Read")}
                          title="Mark as read"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={styles.noResults}>
                    {searchTerm ? 
                      "No queries match your search criteria" : 
                      "No queries found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}