import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // Adjust the path as needed
import Footer from "../components/Footer"; // Adjust the path as needed

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch("https://shopping-portal-backend.onrender.com/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong. Please try again.");
            }

            setMessage("Password reset link sent to your email.");
            navigate(`/reset-password?email=${email}`);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header /> {/* Imported Header Component */}
            <div style={styles.container}>
                <div style={styles.formContainer}>
                    <h2 style={styles.heading}>Forgot Password</h2>
                    <p style={styles.text}>
                        Enter your email address below, and we’ll send you instructions to reset your password.
                    </p>
                    {message && (
                        <p style={{ textAlign: "center", color: message.includes("sent") ? "green" : "red" }}>
                            {message}
                        </p>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="email" style={styles.label}>Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                style={styles.input} 
                                placeholder="Enter your email address" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <button 
                            type="submit" 
                            style={{ ...styles.button, backgroundColor: loading ? "#aaa" : styles.button.backgroundColor }} 
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Send Reset Link"}
                        </button>
                    </form>
                    <p style={styles.backToLogin}>
                        Remembered your password? <a href="/" style={styles.link}>Back to Login</a>
                    </p>
                </div>
            </div>
            <Footer /> {/* Imported Footer Component */}
        </>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        backgroundColor: "#f3f4f6",
    },
    formContainer: {
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        width: "100%",
    },
    heading: {
        textAlign: "center",
        fontSize: "1.5rem",
        color: "#333",
        marginBottom: "1rem",
    },
    text: {
        textAlign: "center",
        color: "#555",
        marginBottom: "1.5rem",
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
    button: {
        width: "100%",
        padding: "0.75rem",
        backgroundColor: "#007BFF",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "1rem",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    backToLogin: {
        textAlign: "center",
        color: "#555",
        marginTop: "1rem",
    },
    link: {
        color: "#007BFF",
        textDecoration: "none",
    }
};

export default ForgotPassword;
