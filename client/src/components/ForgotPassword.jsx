import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
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

            toast.success("Password reset link sent to your email!");
            setTimeout(() => navigate(`/reset-password?email=${email}`), 2000);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <ToastContainer position="top-center" autoClose={3000} />
            <Header />
            
            <main className="forgot-password-container">
                <div className="forgot-password-card">
                    <div className="card-header">
                        <button 
                            className="back-button"
                            onClick={() => navigate(-1)}
                        >
                            <FiArrowLeft />
                        </button>
                        <h1>Forgot Password?</h1>
                        <p className="subtext">
                            No worries! Enter your email and we'll send you reset instructions
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="forgot-password-form">
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-with-icon">
                                <FiMail className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="button-loader"></span>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>

                    <div className="back-to-login">
                        Remember your password?{" "}
                        <button 
                            className="text-button"
                            onClick={() => navigate("/login")}
                        >
                            Log in
                        </button>
                    </div>
                </div>
            </main>

            <Footer />

            <style jsx>{`
                .forgot-password-page {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    background-color: #f8fafc;
                }

                .forgot-password-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex: 1;
                    padding: 2rem;
                }

                .forgot-password-card {
                    background: white;
                    border-radius: 1rem;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
                    padding: 2.5rem;
                    width: 100%;
                    max-width: 28rem;
                    margin: 0 auto;
                }

                .card-header {
                    text-align: center;
                    margin-bottom: 2rem;
                    position: relative;
                }

                .back-button {
                    position: absolute;
                    left: 0;
                    top: 0;
                    background: none;
                    border: none;
                    color: #64748b;
                    font-size: 1.25rem;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }

                .back-button:hover {
                    color: #334155;
                    background-color: #f1f5f9;
                }

                .card-header h1 {
                    font-size: 1.75rem;
                    color: #1e293b;
                    margin-bottom: 0.5rem;
                }

                .subtext {
                    color: #64748b;
                    margin: 0;
                }

                .forgot-password-form {
                    margin-top: 2rem;
                }

                .input-group {
                    margin-bottom: 1.5rem;
                }

                .input-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #475569;
                    font-weight: 500;
                }

                .input-with-icon {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                }

                .input-with-icon input {
                    width: 100%;
                    padding: 0.875rem 1rem 0.875rem 2.5rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    transition: all 0.2s ease;
                }

                .input-with-icon input:focus {
                    outline: none;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }

                .submit-button {
                    width: 100%;
                    padding: 1rem;
                    background-color: #6366f1;
                    color: white;
                    border: none;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 3rem;
                }

                .submit-button:hover {
                    background-color: #4f46e5;
                }

                .submit-button:disabled {
                    background-color: #cbd5e1;
                    cursor: not-allowed;
                }

                .button-loader {
                    width: 1.5rem;
                    height: 1.5rem;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .back-to-login {
                    text-align: center;
                    margin-top: 1.5rem;
                    color: #64748b;
                }

                .text-button {
                    background: none;
                    border: none;
                    color: #6366f1;
                    font-weight: 500;
                    cursor: pointer;
                    padding: 0.25rem;
                }

                .text-button:hover {
                    text-decoration: underline;
                }

                @media (max-width: 640px) {
                    .forgot-password-card {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ForgotPassword;
