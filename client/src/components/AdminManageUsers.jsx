import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { 
  FaDownload, 
  FaEdit, 
  FaTrash, 
  FaChevronLeft, 
  FaChevronRight,
  FaSearch,
  FaUserCog
} from "react-icons/fa";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/admin-manageprofile?page=${currentPage}&limit=${limit}&search=${searchTerm}`,
          { withCredentials: true }
        );
        setUsers(response.data?.users || []);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error(error);
        setError("An error occurred while loading the users.");
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, limit, searchTerm]);

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

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      users.map((user, index) => ({
        "S.No": index + 1,
        Name: user.fullName,
        Email: user.email,
        Phone: user.phone,
        DOB: user.dob ? new Date(user.dob).toLocaleDateString() : "N/A",
        Address: user.address,
        City: user.city,
        Country: user.country,
        "Reg. Date": new Date(user.registrationDate).toLocaleDateString(),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users_data.xlsx");
  };

  const getPagination = () => {
    const pageNumbers = [];
    const range = 2;
    for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  return (
    <div className="admin-container">
      <AdminHeader />
      
      <div className="admin-main-container">
        <AdminSidebar />
      
        <div className="admin-content">
          <div className="content-header">
            <h2>
              <FaUserCog className="header-icon" /> User Management
            </h2>
            <div className="header-actions">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="export-btn" onClick={downloadExcel}>
                <FaDownload /> Export
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>DOB</th>
                      <th>Location</th>
                      <th>Registered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, index) => (
                        <tr key={user._id}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">
                                {user.fullName?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <span>{user.fullName}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.phone || '-'}</td>
                          <td>{user.dob ? new Date(user.dob).toLocaleDateString() : '-'}</td>
                          <td>
                            {[user.city, user.country].filter(Boolean).join(', ') || '-'}
                          </td>
                          <td>{new Date(user.registrationDate).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="edit-btn" 
                                onClick={() => navigate(`/admin-edit-user/${user._id}`)}
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => handleDelete(user._id)}
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="no-results">
                        <td colSpan="8">
                          <div className="empty-state">
                            <img src="/images/no-users.svg" alt="No users found" />
                            <p>No users found matching your criteria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="table-footer">
                <div className="rows-per-page">
                  <span>Show</span>
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
                  <span>entries</span>
                </div>

                <div className="pagination">
                  <button
                    className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft />
                  </button>
                  
                  {getPagination().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  <button
                    className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f5f7fa;
        }

        .admin-main-container {
          display: flex;
          flex: 1;
          margin-top: 60px;
        }

        .admin-content {
          flex-grow: 1;
          padding: 2rem;
          margin-left: 250px;
          transition: margin-left 0.3s ease;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .content-header h2 {
          font-size: 1.75rem;
          color: #2c3e50;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0;
        }

        .header-icon {
          color: #4e73df;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #6c757d;
        }

        .search-box input {
          padding: 0.5rem 1rem 0.5rem 2.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
          width: 250px;
          transition: all 0.3s;
        }

        .search-box input:focus {
          outline: none;
          border-color: #4e73df;
          box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .export-btn:hover {
          background-color: #218838;
        }

        .table-responsive {
          overflow-x: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
          margin-bottom: 1.5rem;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .users-table th {
          background-color: #f8f9fc;
          color: #5a5c69;
          font-weight: 600;
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e3e6f0;
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 0.5px;
        }

        .users-table td {
          padding: 1rem;
          border-bottom: 1px solid #e3e6f0;
          color: #5a5c69;
          vertical-align: middle;
        }

        .users-table tr:last-child td {
          border-bottom: none;
        }

        .users-table tr:hover td {
          background-color: #f8f9fc;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #4e73df;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .edit-btn, .delete-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .edit-btn {
          background-color: #f8f9fc;
          color: #4e73df;
        }

        .edit-btn:hover {
          background-color: #e6e9f4;
        }

        .delete-btn {
          background-color: #f8f9fc;
          color: #e74a3b;
        }

        .delete-btn:hover {
          background-color: #f5e6e5;
        }

        .table-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
        }

        .rows-per-page {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #5a5c69;
        }

        .rows-per-page select {
          padding: 0.25rem 0.5rem;
          border: 1px solid #d1d3e2;
          border-radius: 4px;
          background-color: #f8f9fc;
        }

        .pagination {
          display: flex;
          gap: 0.5rem;
        }

        .pagination-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d1d3e2;
          border-radius: 4px;
          background-color: white;
          color: #5a5c69;
          cursor: pointer;
          transition: all 0.3s;
        }

        .pagination-btn:hover:not(.disabled) {
          background-color: #f8f9fc;
          border-color: #bac8f3;
        }

        .pagination-btn.active {
          background-color: #4e73df;
          border-color: #4e73df;
          color: white;
        }

        .pagination-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #4e73df;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          padding: 2rem;
          background-color: #f8d7da;
          color: #721c24;
          border-radius: 8px;
          text-align: center;
        }

        .no-results td {
          padding: 3rem !important;
          text-align: center;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .empty-state img {
          width: 150px;
          opacity: 0.7;
        }

        .empty-state p {
          color: #6c757d;
          font-size: 1.1rem;
        }

        @media (max-width: 992px) {
          .admin-content {
            margin-left: 0;
            padding: 1rem;
          }

          .content-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
            justify-content: space-between;
          }

          .search-box input {
            width: 200px;
          }
        }

        @media (max-width: 768px) {
          .users-table th, 
          .users-table td {
            padding: 0.75rem;
          }

          .table-footer {
            flex-direction: column;
            align-items: flex-start;
          }

          .pagination {
            width: 100%;
            justify-content: center;
            margin-top: 1rem;
          }
        }

        @media (max-width: 576px) {
          .search-box input {
            width: 150px;
          }

          .export-btn span {
            display: none;
          }

          .export-btn {
            width: 36px;
            height: 36px;
            justify-content: center;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminManageUsers;