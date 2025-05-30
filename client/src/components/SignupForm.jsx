import React, { useState, useEffect } from "react";
import { FaTimes, FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(5px)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    position: "relative",
    textAlign: "center",
    animation: "fadeIn 0.3s ease-out",
  },
  closeButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    cursor: "pointer",
    fontSize: "20px",
    color: "#888",
    background: "none",
    border: "none",
    transition: "color 0.2s",
    "&:hover": {
      color: "#555",
    },
  },
  title: {
    marginBottom: "20px",
    color: "#2c3e50",
    fontSize: "24px",
    fontWeight: "600",
  },
  inputContainer: {
    position: "relative",
    marginBottom: "15px",
  },
  input: {
    width: "90%",
    padding: "12px 15px",
    margin: "5px 0",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "border 0.3s, box-shadow 0.3s",
    "&:focus": {
      borderColor: "#3498db",
      boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
      outline: "none",
    },
  },
  passwordToggle: {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#888",
    "&:hover": {
      color: "#555",
    },
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "15px 0",
    justifyContent: "flex-start",
  },
  checkbox: {
    appearance: "none",
    width: "18px",
    height: "18px",
    border: "2px solid #3498db",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
    "&:checked": {
      backgroundColor: "#3498db",
    },
  },
  checkboxLabel: {
    fontSize: "14px",
    color: "#555",
    cursor: "pointer",
  },
  termsLink: {
    color: "#3498db",
    textDecoration: "none",
    fontWeight: "500",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  signupButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    margin: "10px 0",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  signupButtonEnabled: {
    backgroundColor: "#3498db",
    color: "white",
    "&:hover": {
      backgroundColor: "#2980b9",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(52, 152, 219, 0.3)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },
  signupButtonDisabled: {
    backgroundColor: "#e0e0e0",
    color: "#aaa",
    cursor: "not-allowed",
  },
  switchLink: {
    color: "#3498db",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    marginTop: "15px",
    display: "inline-block",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  errorMessage: {
    color: "#e74c3c",
    fontSize: "13px",
    margin: "5px 0",
    textAlign: "left",
    paddingLeft: "5px",
  },
  successMessage: {
    color: "#2ecc71",
    fontSize: "14px",
    margin: "10px 0",
    fontWeight: "500",
  },
  inputError: {
    borderColor: "#e74c3c",
    "&:focus": {
      borderColor: "#e74c3c",
      boxShadow: "0 0 0 2px rgba(231, 76, 60, 0.2)",
    },
  },
};

export default function SignupForm({ isOpen, onClose, onSwitch }) {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: "",
        mobileNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      });
      setError("");
      setSuccess("");
      setFieldErrors({
        fullName: "",
        mobileNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [isOpen]);

  const validateField = (name, value) => {
    let errorMsg = "";
    
    switch (name) {
      case "fullName":
        if (!value.trim()) errorMsg = "Full name is required";
        else if (value.length < 3) errorMsg = "Name is too short";
        break;
      case "mobileNumber":
        if (!value.trim()) errorMsg = "Mobile number is required";
        else if (!/^\d{10,15}$/.test(value)) errorMsg = "Invalid phone number";
        break;
      case "email":
        if (!value.trim()) errorMsg = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errorMsg = "Invalid email format";
        break;
      case "password":
        if (!value.trim()) errorMsg = "Password is required";
        else if (value.length < 8) errorMsg = "Password must be at least 8 characters";
        break;
      case "confirmPassword":
        if (!value.trim()) errorMsg = "Please confirm your password";
        else if (value !== formData.password) errorMsg = "Passwords don't match";
        break;
      default:
        break;
    }
    
    setFieldErrors(prev => ({ ...prev, [name]: errorMsg }));
    return !errorMsg;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Validate field on change
    if (type !== "checkbox") {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validate all fields
    let isValid = true;
    Object.keys(formData).forEach(key => {
      if (key !== "agreeToTerms") {
        isValid = validateField(key, formData[key]) && isValid;
      }
    });
    
    if (!isValid) return;
    
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    try {
      const response = await fetch("https://myntra-clone-api.vercel.app/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.mobileNumber,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed. Please try again.");
      }

      setSuccess("User Registration Successful!");
      
      // Reset form
      setFormData({
        fullName: "",
        mobileNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      });
      
      // Close signup modal and open login form after a delay
      setTimeout(() => {
        onClose();
        onSwitch();
      }, 1500);
      
    } catch (error) {
      setError(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <button style={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>

        <h2 style={styles.title}>Create Your Account</h2>
        
        {error && <p style={styles.errorMessage}>{error}</p>}
        {success && <p style={styles.successMessage}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                ...styles.input,
                ...(fieldErrors.fullName && styles.inputError),
              }}
              required
            />
            {fieldErrors.fullName && <p style={styles.errorMessage}>{fieldErrors.fullName}</p>}
          </div>

          <div style={styles.inputContainer}>
            <input
              type="tel"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                ...styles.input,
                ...(fieldErrors.mobileNumber && styles.inputError),
              }}
              required
            />
            {fieldErrors.mobileNumber && <p style={styles.errorMessage}>{fieldErrors.mobileNumber}</p>}
          </div>

          <div style={styles.inputContainer}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                ...styles.input,
                ...(fieldErrors.email && styles.inputError),
              }}
              required
            />
            {fieldErrors.email && <p style={styles.errorMessage}>{fieldErrors.email}</p>}
          </div>

          <div style={styles.inputContainer}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                ...styles.input,
                ...(fieldErrors.password && styles.inputError),
              }}
              required
            />
            <span 
              style={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {fieldErrors.password && <p style={styles.errorMessage}>{fieldErrors.password}</p>}
          </div>

          <div style={styles.inputContainer}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                ...styles.input,
                ...(fieldErrors.confirmPassword && styles.inputError),
              }}
              required
            />
            <span 
              style={styles.passwordToggle}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {fieldErrors.confirmPassword && <p style={styles.errorMessage}>{fieldErrors.confirmPassword}</p>}
          </div>

          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="agreeToTerms"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              style={styles.checkbox}
            />
            <label htmlFor="agreeToTerms" style={styles.checkboxLabel}>
              I agree to the <a href="#" style={styles.termsLink}>Terms and Conditions</a>
            </label>
          </div>

          <button
            type="submit"
            style={{
              ...styles.signupButton,
              ...(formData.agreeToTerms
                ? styles.signupButtonEnabled
                : styles.signupButtonDisabled),
            }}
            disabled={!formData.agreeToTerms}
          >
            <FaCheck /> Sign Up
          </button>

          <p style={styles.switchLink} onClick={onSwitch}>
            Already have an account? Log in
          </p>
        </form>
      </div>
    </div>
  );
}
