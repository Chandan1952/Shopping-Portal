import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [contactDetails, setContactDetails] = useState({ email: "", phone: "", address: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch("https://car-rental-portal-backend.onrender.com/contact-details")
      .then((response) => response.json())
      .then((data) => setContactDetails(data))
      .catch((error) => console.error("Error fetching contact details:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.name || !formData.email || !formData.message) {
      setIsError(true);
      setMessage("⚠️ All fields are required!");
      return;
    }

    try {
      const response = await fetch("https://car-rental-portal-backend.onrender.com/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsError(false);
        setMessage(`✅ Thank you, ${formData.name}! Your message has been sent.`);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setIsError(true);
        setMessage("⚠️ Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending query:", error);
      setIsError(true);
      setMessage("⚠️ An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", color: "#1f2937" }}>Contact Us</h2>
          <p style={{ color: "#4b5563", textAlign: "center", marginTop: "8px" }}>Have any questions? We'd love to hear from you!</p>
          
          <div style={{ marginTop: "24px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "600" }}>Customer Support</h3>
            <p><strong>Email:</strong> {contactDetails.email || "Loading..."}</p>
            <p><strong>Phone:</strong> {contactDetails.phone || "Loading..."}</p>
            <p><strong>Address:</strong> {contactDetails.address || "Loading..."}</p>
          </div>
          
          <form style={{ marginTop: "24px" }} onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px", width: "100%" }} required />
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px", width: "100%" }} required />
            </div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px", width: "100%", marginTop: "16px" }}
              rows="4"
              placeholder="Your Message"
              required
            ></textarea>
            <button type="submit" style={{ marginTop: "16px", width: "100%", backgroundColor: "#2563eb", color: "white", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Send Message</button>
          </form>
          
          {message && <p style={{ marginTop: "12px", textAlign: "center", color: isError ? "red" : "green" }}>{message}</p>}
          
          <div style={{ marginTop: "24px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "600" }}>Our Location</h3>
            <iframe
              title="Myntra Office Location"
              style={{ width: "100%", height: "256px", borderRadius: "8px", marginTop: "8px" }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.9074088913297!2d77.59701967472138!3d12.971598315224649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670a1111111%3A0x1111111111111111!2sMyntra!5e0!3m2!1sen!2sin!4v1649619415413!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
