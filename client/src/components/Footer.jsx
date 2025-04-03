import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { AiOutlineApple } from "react-icons/ai";
import { BsGooglePlay } from "react-icons/bs";

const styles = {
  footer: {
    backgroundColor: "#f4f4f4",
    padding: "40px 20px",
    fontSize: "14px",
    color: "#333",
    borderTop: "3px solid #ddd",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "auto",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  heading: {
    fontWeight: "600",
    fontSize: "16px",
    marginBottom: "12px",
    color: "#222",
  },
  link: {
    cursor: "pointer",
    color: "#007bff",
    transition: "color 0.3s",
    fontSize: "14px",
    textDecoration: "none",
  },
  linkHover: {
    textDecoration: "underline",
  },
  socialIcons: {
    display: "flex",
    gap: "12px",
    fontSize: "22px",
    marginTop: "10px",
  },
  appButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "12px",
    alignItems: "center",
  },
  bottomSection: {
    marginTop: "30px",
    borderTop: "1px solid #ccc",
    paddingTop: "12px",
    textAlign: "center",
    fontSize: "13px",
    color: "#555",
  },
};

export default function Footer() {
  const navigate = useNavigate();

  const categories = ["Mens", "Women", "Kids", "Home & Living"];

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.toLowerCase()}`); // ✅ Ensure lowercase query
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Online Shopping Links */}
        <div style={styles.column}>
          <div style={styles.heading}>Online Shopping</div>
          {categories.map((category) => (
            <span
              key={category}
              onClick={() => handleCategoryClick(category)}
              style={styles.link}
              aria-label={`Browse ${category} products`}
            >
              {category}
            </span>
          ))}
        </div>

        {/* Customer Policies */}
        <div style={styles.column}>
          <div style={styles.heading}>Customer Policies</div>
          <span onClick={() => navigate("/contact")} style={styles.link}>Contact Us</span>
          <span onClick={() => navigate("/faq")} style={styles.link}>FAQ</span>
          <span onClick={() => navigate("/terms-of-use")} style={styles.link}>Terms of Use</span>
          <span onClick={() => navigate("/track-orders")} style={styles.link}>Track Orders</span>
          <span onClick={() => navigate("/shipping")} style={styles.link}>Shipping</span>
          <span onClick={() => navigate("/cancellation")} style={styles.link}>Cancellation</span>
          <span onClick={() => navigate("/returns")} style={styles.link}>Returns</span>
          <span onClick={() => navigate("/privacy-policy")} style={styles.link}>Privacy Policy</span>
        </div>

        {/* Social Media Links & App Download */}
        <div style={styles.column}>
          <div style={styles.heading}>Keep in Touch</div>
          <div style={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </div>
          <div style={{ marginTop: "15px" }}>
            <div style={styles.heading}>Experience the Myntra App</div>
            <div style={styles.appButtons}>
              <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                <BsGooglePlay size={30} />
              </a>
              <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                <AiOutlineApple size={30} />
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div style={styles.column}>
          <div style={styles.heading}>100% Original</div>
          <p>Guaranteed for all products at Myntra.com</p>
          <div style={styles.heading}>Return within 14 Days</div>
          <p>of receiving your order</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={styles.bottomSection}>
        <p>© 2025 www.myntra.com. All rights reserved.</p>
        <p>
          In case of any concern,{" "}
          <span onClick={() => navigate("/contact")} style={{ color: "#007bff", fontWeight: "600", cursor: "pointer" }}>
            Contact Us
          </span>
        </p>
      </div>
    </footer>
  );
}
