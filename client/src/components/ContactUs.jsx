import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [contactDetails, setContactDetails] = useState({ email: "", phone: "", address: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/contact-details")
      .then((response) => response.json())
      .then((data) => {
        setContactDetails(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contact details:", error);
        setIsLoading(false);
      });
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
      const response = await fetch("http://localhost:5000/api/queries", {
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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div style={{
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: "40px 20px",
        backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(240,249,255,0.8))"
      }}>
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          alignItems: "start"
        }}>
          {/* Left Column - Contact Information */}
          <div style={{
            backgroundColor: "#ffffff",
            padding: "32px",
            borderRadius: "16px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            height: "100%"
          }}>
            <h2 style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "24px",
              position: "relative",
              paddingBottom: "12px"
            }}>
              Get in Touch
              <span style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "60px",
                height: "4px",
                backgroundColor: "#3b82f6",
                borderRadius: "2px"
              }}></span>
            </h2>
            
            <p style={{ color: "#64748b", marginBottom: "32px", lineHeight: "1.6" }}>
              Our team is here to help you with any questions about our services. Reach out and we'll respond as soon as possible.
            </p>
            
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#eff6ff",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "16px",
                  flexShrink: 0
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>Email</h3>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
                    {isLoading ? (
                      <div style={{ width: "120px", height: "20px", backgroundColor: "#e2e8f0", borderRadius: "4px" }}></div>
                    ) : (
                      contactDetails.email || "info@example.com"
                    )}
                  </p>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#eff6ff",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "16px",
                  flexShrink: 0
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>Phone</h3>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
                    {isLoading ? (
                      <div style={{ width: "120px", height: "20px", backgroundColor: "#e2e8f0", borderRadius: "4px" }}></div>
                    ) : (
                      contactDetails.phone || "+1 (555) 000-0000"
                    )}
                  </p>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#eff6ff",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "16px",
                  flexShrink: 0
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>Address</h3>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
                    {isLoading ? (
                      <div style={{ width: "180px", height: "40px", backgroundColor: "#e2e8f0", borderRadius: "4px" }}></div>
                    ) : (
                      contactDetails.address || "123 Business Ave, Suite 400, San Francisco, CA 94107"
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b", marginBottom: "16px" }}>Business Hours</h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ color: "#64748b" }}>Monday - Friday</span>
                <span style={{ fontWeight: "600", color: "#1e293b" }}>9:00 AM - 6:00 PM</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Saturday - Sunday</span>
                <span style={{ fontWeight: "600", color: "#1e293b" }}>Closed</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Contact Form */}
          <div style={{
            backgroundColor: "#ffffff",
            padding: "32px",
            borderRadius: "16px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
          }}>
            <h2 style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "24px",
              position: "relative",
              paddingBottom: "12px"
            }}>
              Send Us a Message
              <span style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "60px",
                height: "4px",
                backgroundColor: "#3b82f6",
                borderRadius: "2px"
              }}></span>
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="name" style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569",
                  marginBottom: "8px"
                }}>Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    transition: "all 0.2s",
                    backgroundColor: "#f8fafc"
                  }}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="email" style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569",
                  marginBottom: "8px"
                }}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    transition: "all 0.2s",
                    backgroundColor: "#f8fafc"
                  }}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div style={{ marginBottom: "24px" }}>
                <label htmlFor="message" style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569",
                  marginBottom: "8px"
                }}>Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    minHeight: "120px",
                    resize: "vertical",
                    transition: "all 0.2s",
                    backgroundColor: "#f8fafc"
                  }}
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.1)"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#2563eb"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#3b82f6"}
              >
                Send Message
              </button>
              
              {message && (
                <div style={{
                  marginTop: "16px",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: isError ? "#fee2e2" : "#dcfce7",
                  borderLeft: `4px solid ${isError ? "#ef4444" : "#22c55e"}`,
                  color: isError ? "#b91c1c" : "#166534"
                }}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;