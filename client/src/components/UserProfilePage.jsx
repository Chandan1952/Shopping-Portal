import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import UserSidebar from "../components/UserSidebar";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://shopping-portal-backend.onrender.com/api/auth/check", { credentials: "include" })
        .catch(() => console.error("Authentication check failed"));
}, []);


 useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await fetch("https://shopping-portal-backend.onrender.com/api/user", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Not authenticated");
      
      const data = await response.json();
      setUser(data);
    } catch (error) {
      navigate("/"); // Redirects unauthorized users
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [navigate]);


const handleChange = (e) => {
  const { name, value } = e.target;
  setUser((prevUser) => ({
    ...prevUser,
    [name]: value.trim() ? value : prevUser[name], // Prevents empty updates
  }));
};

const [saving, setSaving] = useState(false);
const [successMessage, setSuccessMessage] = useState("");

const handleSave = async () => {
  setSaving(true);
  setSuccessMessage("");

  try {
    const response = await fetch(`https://shopping-portal-backend.onrender.com/update-users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(user),
    });

    if (!response.ok) throw new Error("Failed to update profile");

    const data = await response.json();
    setUser(data);
    setSuccessMessage("Profile updated successfully!");
  } catch (err) {
    setError(err.message);
  } finally {
    setSaving(false);
  }
};



  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Error loading profile.</p>;

  return (
    <>
      <Header />
      <div style={{ display: "flex", marginTop: "24px", maxWidth: "1200px", margin: "auto", gap: "20px", padding: "16px" }}>
        <UserSidebar />
        <main style={{ flex: "3", minWidth: "600px", background: "#fff", padding: "24px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", borderBottom: "2px solid #ddd", paddingBottom: "8px" }}>
            General Settings
          </h2>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div style={{ marginTop: "16px" }}>
            <label>Full Name</label>
            <input type="text" name="fullName" style={inputStyle} value={user.fullName} onChange={handleChange} />

            <label>Email Address</label>
            <input type="email" name="email" style={inputStyle} value={user.email} disabled />

            <label>Phone Number</label>
            <input type="text" name="phone" style={inputStyle} value={user.phone} onChange={handleChange} />

            <label>Date of Birth</label>
            <input type="date" name="dob" style={inputStyle} value={user.dob} onChange={handleChange} />

            <label>Your Address</label>
            <textarea name="address" style={{ ...inputStyle, height: "80px" }} value={user.address} onChange={handleChange}></textarea>

            <label>Country</label>
            <input type="text" name="country" style={inputStyle} value={user.country} onChange={handleChange} />

            <label>City</label>
            <input type="text" name="city" style={inputStyle} value={user.city} onChange={handleChange} />

          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
<button style={buttonStyle} onClick={handleSave} disabled={saving}>
  {saving ? "Saving..." : "Save Changes"}
</button>

          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginTop: "8px",
  fontSize: "16px",
};

const buttonStyle = {
  background: "#007BFF",
  color: "#fff",
  padding: "12px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  marginTop: "16px",
  width: "100%", // Make button full-width on mobile
};
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "1200px",
  margin: "auto",
  padding: "16px",
  gap: "20px",
};

const mainStyle = {
  flex: "3",
  minWidth: "600px",
  background: "#fff",
  padding: "24px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
};

@media (max-width: 768px) {
  mainStyle.minWidth = "100%"; // Ensures full-width on mobile
}

export default UserProfilePage;
