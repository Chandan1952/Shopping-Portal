import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import * as XLSX from "xlsx";
// import { FaDownload } from "react-icons/fa";
import AdminHeader from "./AdminHeader"; // Importing UserHeader
import AdminSidebar from "./AdminSidebar"; // Importing UserSidebar

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
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
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/admin-manageprofile?page=${currentPage}&limit=${limit}`,
          { withCredentials: true }
        );
        setUsers(response.data?.users || []);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error(error); // Log the error for debugging
        setError("An error occurred while loading the users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, limit]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user permanently?")) return;

    try {
      await axios.delete(`http://localhost:5000/delete/${userId}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      alert("Failed to delete user.");
    }
  };


  // const downloadExcel = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(
  //     users.map((user, index) => ({
  //       "S.No": index + 1,
  //       Name: user.fullName,
  //       Email: user.email,
  //       Phone: user.phone,
  //       DOB: user.dob ? new Date(user.dob).toLocaleDateString() : "N/A",
  //       Address: user.address,
  //       City: user.city,
  //       Country: user.country,
  //       "Reg. Date": new Date(user.registrationDate).toLocaleDateString(),
  //     }))
  //   );

  //   // Create a workbook and add the worksheet
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  //   // Download the Excel file
  //   XLSX.writeFile(workbook, "users_data.xlsx");
  // };

  const getPagination = () => {
    const pageNumbers = [];
    const range = 2; // Number of pages to show before and after the current page
    for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="container">
      <style>{`
      body {
  font-family: 'Arial', sans-serif;
  margin: 0px 0 0 250px;
  padding: 0;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.container {
  display: flex;
  flex-direction: column;
}

.main-container {
  display: flex;
  flex: 1;
}

.content {
  flex-grow: 1;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 20px;
}

/* Table Styling */
.user-table {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow-x: auto;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
}

table th,
table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  font-size: 15px;
  color: #333;
}

table th {
  background-color: #007bff;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  text-align: left;
}

table tr:nth-child(even) {
  background-color: #f9f9f9;
}

table tr:hover {
  background-color: #f1f1f1;
  transition: 0.3s ease-in-out;
}

/* Buttons */
.edit-btn,
.delete-btn {
  border: none;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  margin: 0 6px;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #b02a37;
}

/* Pagination */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
}

.pagination-btn {
  display: inline-block;
  padding: 8px 12px;
  text-decoration: none;
  color: #007bff;
  border: 1px solid #007bff;
  border-radius: 5px;
  background-color: white;
  font-size: 14px;
  transition: all 0.3s;
}

.pagination-btn:hover {
  background-color: #007bff;
  color: white;
}

.pagination-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #0056b3;
  pointer-events: none;
}

/* Table Controls */
.table-controls {
  margin-bottom: 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.table-controls select {
  padding: 6px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .content {
    padding: 10px;
    margin: 10px;
  }

  table th,
  table td {
    font-size: 13px;
    padding: 10px;
  }

  .edit-btn,
  .delete-btn {
    padding: 6px 10px;
    font-size: 12px;
  }

  .pagination-controls {
    flex-wrap: wrap;
  }

.downloadIcon {
  cursor: pointer;
  font-size: 24px;
  color: green;
  margin-bottom: 10px;
}
}

      `}</style>

      {/* User Header */}
      <AdminHeader />
      


      <div className="main-container">
        {/* User Sidebar */}
        <AdminSidebar />
      
        {/* Main Section */}
        <div className="content">
        <div style={{ textAlign: "right", marginBottom: "10px" }}>
  {/* <FaDownload className="downloadIcon" onClick={downloadExcel} /> */}
</div>
          <h2>Registered Users</h2>
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <>
              <div className="table-controls">
                <label>
                  Show
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    {[10, 25, 50, 100].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  entries per page
                </label>
              </div>

              <div className="user-table">
                <table>
                  <thead>
                    <tr>
                      <th>Sno.</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>DOB</th>
                      <th>Address</th>
                      <th>City</th>
                      <th>Country</th>
                      <th>Reg. Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr key={user._id}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          <td>{user.fullName}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{user.dob}</td>
                          <td>{user.address}</td>
                          <td>{user.city}</td>
                          <td>{user.country}</td>

                          <td>{new Date(user.registrationDate).toLocaleString()}</td>
                          <td>
                            <button className="edit-btn" onClick={() => navigate(`/admin-edit-user/${user._id}`)}>
                              ✏️ Edit
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(user._id)}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pagination-controls">
                {currentPage > 1 && (
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                )}
                {getPagination().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`pagination-btn ${currentPage === pageNum ? "active" : ""}`}
                  >
                    {pageNum}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManageUsers;
