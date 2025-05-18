import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

const GiftCard = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    amount: "",
    message: "",
    occasion: "birthday"
  });
  const [status, setStatus] = useState({ message: "", isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/check", { credentials: "include" })
      .catch(() => console.error("Authentication check failed"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ message: "", isError: false });

    // Validate form
    if (!formData.name || !formData.email || !formData.amount) {
      setStatus({ message: "All fields are required!", isError: true });
      setIsSubmitting(false);
      return;
    }

    if (isNaN(formData.amount) || Number(formData.amount) < 100) {
      setStatus({ message: "Minimum amount is ₹100", isError: true });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus({ 
        message: `Gift card sent successfully to ${formData.name}!`, 
        isError: false 
      });
      setFormData({ 
        name: "", 
        email: "", 
        amount: "",
        message: "",
        occasion: "birthday"
      });
    } catch (error) {
      setStatus({ 
        message: "Failed to process gift card. Please try again.", 
        isError: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Inline styles
  const styles = {
    pageContainer: {
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      display: "flex",
      flexDirection: "column"
    },
    mainContent: {
      flex: 1,
      padding: "32px 16px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    card: {
      maxWidth: "600px",
      width: "100%",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      overflow: "hidden",
      padding: "32px"
    },
    header: {
      textAlign: "center",
      marginBottom: "32px"
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "8px",
      background: "linear-gradient(90deg, #7c3aed, #4f46e5)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    },
    subtitle: {
      color: "#64748b",
      fontSize: "16px",
      margin: "0"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    label: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#334155"
    },
    input: {
      padding: "14px 16px",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "16px",
      transition: "all 0.2s",
      outline: "none"
    },
    inputFocus: {
      borderColor: "#818cf8",
      boxShadow: "0 0 0 3px rgba(129, 140, 248, 0.2)"
    },
    select: {
      padding: "14px 16px",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "16px",
      backgroundColor: "white",
      cursor: "pointer"
    },
    textarea: {
      padding: "14px 16px",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "16px",
      minHeight: "100px",
      resize: "vertical"
    },
    submitButton: {
      padding: "16px",
      backgroundColor: "#4f46e5",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    },
    submitButtonHover: {
      backgroundColor: "#4338ca"
    },
    submitButtonDisabled: {
      opacity: "0.7",
      cursor: "not-allowed"
    },
    statusMessage: {
      padding: "12px 16px",
      borderRadius: "8px",
      marginTop: "20px",
      textAlign: "center",
      fontWeight: "500"
    },
    error: {
      backgroundColor: "#fee2e2",
      color: "#b91c1c"
    },
    success: {
      backgroundColor: "#dcfce7",
      color: "#166534"
    },
    giftCardPreview: {
      backgroundColor: "#f5f3ff",
      borderRadius: "12px",
      padding: "24px",
      marginTop: "24px",
      border: "2px dashed #8b5cf6",
      textAlign: "center"
    },
    giftCardAmount: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#7c3aed",
      margin: "12px 0"
    },
    giftCardMessage: {
      fontStyle: "italic",
      color: "#475569"
    },
    spinner: {
      animation: "spin 1s linear infinite",
      width: "20px",
      height: "20px"
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Header />
      
      <div style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>Myntra Gift Card</h2>
            <p style={styles.subtitle}>Give the gift of style to your loved ones</p>
          </div>
          
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label htmlFor="name" style={styles.label}>Recipient's Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter recipient's full name"
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Recipient's Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter recipient's email address"
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label htmlFor="occasion" style={styles.label}>Occasion</label>
              <select
                id="occasion"
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="wedding">Wedding</option>
                <option value="holiday">Holiday</option>
                <option value="thankyou">Thank You</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div style={styles.inputGroup}>
              <label htmlFor="amount" style={styles.label}>Gift Card Amount (₹)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount (minimum ₹100)"
                min="100"
                step="100"
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label htmlFor="message" style={styles.label}>Personal Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Add a personal message..."
                style={styles.textarea}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.submitButton,
                ...(isSubmitting ? styles.submitButtonDisabled : {})
              }}
            >
              {isSubmitting ? (
                <>
                  <svg 
                    style={styles.spinner} 
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"></circle>
                    <path 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      opacity="0.75"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : "Purchase Gift Card"}
            </button>
          </form>
          
          {status.message && (
            <div style={{
              ...styles.statusMessage,
              ...(status.isError ? styles.error : styles.success)
            }}>
              {status.message}
            </div>
          )}
          
          {formData.name && formData.amount && (
            <div style={styles.giftCardPreview}>
              <h3 style={{ color: "#6d28d9" }}>Your Gift Card Preview</h3>
              <p>For: {formData.name}</p>
              <div style={styles.giftCardAmount}>₹{formData.amount}</div>
              {formData.message && (
                <p style={styles.giftCardMessage}>"{formData.message}"</p>
              )}
              <p style={{ color: "#6d28d9", marginTop: "8px" }}>Happy {formData.occasion}!</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GiftCard;