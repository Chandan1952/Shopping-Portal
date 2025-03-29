import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminManageGiftCard = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [message, setMessage] = useState("");
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
    fetchGiftCards();
  }, []);

  const fetchGiftCards = async () => {
    try {
      const response = await fetch("https://shopping-portal-backend.onrender.com/api/giftcards");
      const data = await response.json();
      setGiftCards(data);
    } catch (error) {
      console.error("Error fetching gift cards:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gift card?")) return;
    try {
      await fetch(`https://shopping-portal-backend.onrender.com/api/giftcards/${id}`, {
        method: "DELETE",
      });
      setMessage("Gift card deleted successfully");
      fetchGiftCards();
    } catch (error) {
      console.error("Error deleting gift card:", error);
      setMessage("Failed to delete gift card");
    }
  };

  return (
    <div>
      <AdminHeader />
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div style={{ padding: "24px", flex: 1, marginLeft:"220px" }}>
          <h2 style={{ textAlign: "center" }}>Admin - Manage Gift Cards</h2>
          {message && <p style={{ textAlign: "center", color: "red" }}>{message}</p>}
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Email</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Amount</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Date</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {giftCards.map((card) => (
                <tr key={card._id}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{card.name}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{card.email}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>₹{card.amount}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{new Date(card.date).toLocaleDateString()}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    <button onClick={() => handleDelete(card._id)} style={{ backgroundColor: "red", color: "white", padding: "6px", border: "none", cursor: "pointer" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManageGiftCard;
