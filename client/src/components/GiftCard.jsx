import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

const GiftCard = () => {
  const [formData, setFormData] = useState({ name: "", email: "", amount: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch("https://shopping-portal-wptg.onrender.com/api/auth/check", { credentials: "include" })
        .catch(() => console.error("Authentication check failed"));
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.name || !formData.email || !formData.amount) {
      setIsError(true);
      setMessage("⚠️ All fields are required!");
      return;
    }

    setIsError(false);
    setMessage(`✅ Thank you, ${formData.name}! Your gift card purchase is successful.`);
    setFormData({ name: "", email: "", amount: "" });
  };

  return (
    <div>
      <Header />
      <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", color: "#1f2937" }}>Myntra Gift Cards</h2>
          <p style={{ color: "#4b5563", textAlign: "center", marginTop: "8px" }}>Give the perfect gift for any occasion!</p>
          
          <form style={{ marginTop: "24px" }} onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Recipient's Name" value={formData.name} onChange={handleChange} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px", width: "100%", marginBottom: "12px" }} required />
            <input type="email" name="email" placeholder="Recipient's Email" value={formData.email} onChange={handleChange} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px", width: "100%", marginBottom: "12px" }} required />
            <input type="number" name="amount" placeholder="Gift Card Amount (INR)" value={formData.amount} onChange={handleChange} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px", width: "100%", marginBottom: "12px" }} required />
            <button type="submit" style={{ width: "100%", backgroundColor: "#2563eb", color: "white", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Purchase Gift Card</button>
          </form>

          {message && <p style={{ marginTop: "12px", textAlign: "center", color: isError ? "red" : "green" }}>{message}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GiftCard;
