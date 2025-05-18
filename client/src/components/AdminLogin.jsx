import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://shopping-portal-backend.onrender.com/admin-login", formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        localStorage.setItem("adminEmail", formData.email);
        navigate("/admin-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    body: {
      margin: 0,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    loginContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      padding: "2.5rem",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      width: "100%",
      maxWidth: "450px",
      backdropFilter: "blur(5px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      transform: "translateY(0)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      ":hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
      },
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    title: {
      textAlign: "center",
      marginBottom: "2rem",
      color: "#2c3e50",
      fontSize: "2rem",
      fontWeight: "700",
      position: "relative",
      ":after": {
        content: '""',
        display: "block",
        width: "60px",
        height: "4px",
        background: "linear-gradient(to right, #d9534f, #e74c3c)",
        margin: "0.5rem auto 0",
        borderRadius: "2px",
      },
    },
    inputGroup: {
      marginBottom: "1.5rem",
      position: "relative",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      color: "#2c3e50",
      fontWeight: "600",
      fontSize: "0.9rem",
    },
    input: {
      width: "100%",
      padding: "0.9rem 1rem",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      ":focus": {
        borderColor: "#d9534f",
        outline: "none",
        boxShadow: "0 0 0 3px rgba(217, 83, 79, 0.2)",
      },
    },
    passwordToggle: {
      position: "absolute",
      right: "12px",
      top: "38px",
      background: "none",
      border: "none",
      color: "#7f8c8d",
      cursor: "pointer",
      fontSize: "0.9rem",
      ":hover": {
        color: "#d9534f",
      },
    },
    loginButton: {
      width: "100%",
      padding: "1rem",
      backgroundColor: "#d9534f",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "0.5rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
      ":hover": {
        backgroundColor: "#c9302c",
        transform: "translateY(-2px)",
        boxShadow: "0 5px 15px rgba(217, 83, 79, 0.4)",
      },
    },
    loginButtonDisabled: {
      opacity: 0.7,
      cursor: "not-allowed",
      transform: "none !important",
      boxShadow: "none !important",
    },
    errorMessage: {
      color: "#e74c3c",
      backgroundColor: "#fdeaea",
      padding: "0.8rem",
      borderRadius: "6px",
      marginBottom: "1.5rem",
      textAlign: "center",
      fontSize: "0.9rem",
      fontWeight: "500",
    },
    loadingSpinner: {
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTop: "2px solid white",
      borderRadius: "50%",
      width: "16px",
      height: "16px",
      animation: "spin 1s linear infinite",
    },
    footerText: {
      textAlign: "center",
      marginTop: "1.5rem",
      color: "#7f8c8d",
      fontSize: "0.8rem",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Admin Portal</h2>
          
          {error && <div style={styles.errorMessage}>{error}</div>}

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="admin@example.com"
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="••••••••"
              style={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button 
              type="button" 
              style={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            style={loading ? { ...styles.loginButton, ...styles.loginButtonDisabled } : styles.loginButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.loadingSpinner}></span>
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <p style={styles.footerText}>
            Restricted access. Unauthorized entry prohibited.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
