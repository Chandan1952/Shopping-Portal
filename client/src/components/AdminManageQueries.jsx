import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#333",
    color: "white",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  button: {
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  readButton: {
    backgroundColor: "green",
    color: "white",
  },
  pendingButton: {
    backgroundColor: "orange",
    color: "white",
  },
};

export default function ManageQueries() {
  const [queries, setQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
      const navigate = useNavigate();
  

   // ✅ Verify Admin Session
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
    
        verifyAdminSession(); // ✅ Call the function inside useEffect
      }, [navigate]); // ✅ Add navigate as a dependency
    

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
      
      // Update state to reflect changes
      setQueries((prevQueries) =>
        prevQueries.map((query) =>
          query._id === id ? { ...query, status: updatedQuery.status } : query
        )
      );
    } catch (error) {
      console.error("Error updating query status:", error);
    }
  };

  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Manage Contact Us Queries</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search queries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        {/* Queries Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Message</th>
              <th style={styles.th}>Posting Date</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {queries
              .filter((query) =>
                query.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((query, index) => (
                <tr key={query._id}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{query.name}</td>
                  <td style={styles.td}>{query.email}</td>
                  <td style={styles.td}>{query.message}</td>
                  <td style={styles.td}>
                    {new Date(query.date).toLocaleString()}
                  </td>
                  <td style={styles.td}>
                    {query.status === "Read" ? (
                      <button
                        style={{ ...styles.button, ...styles.readButton }}
                        onClick={() => updateQueryStatus(query._id, "Pending")}
                      >
                        Read
                      </button>
                    ) : (
                      <button
                        style={{ ...styles.button, ...styles.pendingButton }}
                        onClick={() => updateQueryStatus(query._id, "Read")}
                      >
                        Pending
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}