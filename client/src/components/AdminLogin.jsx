import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await axios.post(
      "https://shopping-portal-backend.onrender.com/admin-login",
      formData,
      {
        withCredentials: true, // ✅ Sends session cookies
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 200) {
      navigate("/admin-dashboard"); // ✅ Navigate after successful login
    }
  } catch (err) {
    setError(err.response?.data?.error || "Invalid credentials. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.body}>
      <div style={styles.loginContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Admin Login</h2>
          {error && <p style={styles.errorMessage}>{error}</p>}

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter admin email"
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter admin password"
              style={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            style={loading ? { ...styles.loginButton, ...styles.loginButtonDisabled } : styles.loginButton}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

// **Updated Styles**
const styles = {
  body: {
    margin: 0,
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  loginContainer: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#333",
  },
  inputGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  loginButton: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#d9534f",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  loginButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  errorMessage: {
    color: "red",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
  },
};

export default AdminLogin;
