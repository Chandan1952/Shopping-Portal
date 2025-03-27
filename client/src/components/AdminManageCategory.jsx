import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminManageCategory() {
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDiscount, setEditedDiscount] = useState("");
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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category._id);
    setEditedTitle(category.title);
    setEditedDiscount(category.discount);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/categories/${id}`, {
        title: editedTitle,
        discount: editedDiscount,
      });

      setCategories(
        categories.map((cat) =>
          cat._id === id ? { ...cat, title: editedTitle, discount: editedDiscount } : cat
        )
      );

      setEditingCategoryId(null);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div>
      <AdminHeader />
      <AdminSidebar />
      <div style={{ padding: "20px", marginLeft: "240px" }}>
        <h2>Manage Categories</h2>
        <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Discount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>
                  <img src={`http://localhost:5000${category.img}`} alt={category.title} width="80" />
                </td>

                {editingCategoryId === category._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="New Title"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editedDiscount}
                        onChange={(e) => setEditedDiscount(e.target.value)}
                        placeholder="New Discount"
                      />
                    </td>
                    <td>
                      <button onClick={() => handleUpdate(category._id)} style={{ color: "green" }}>
                        Save
                      </button>
                      <button onClick={() => setEditingCategoryId(null)} style={{ marginLeft: "10px", color: "red" }}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{category.title}</td>
                    <td>{category.discount}</td>
                    <td>
                      <button onClick={() => handleEdit(category)}>Edit</button>
                      <button onClick={() => handleDelete(category._id)} style={{ marginLeft: "10px", color: "red" }}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
