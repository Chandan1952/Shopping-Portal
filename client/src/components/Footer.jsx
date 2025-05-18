import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaArrowRight } from "react-icons/fa";
import { AiOutlineApple } from "react-icons/ai";
import { BsGooglePlay } from "react-icons/bs";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #2a2a2a;
  color: #ffffff;
  padding: 60px 20px 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ColumnHeading = styled.h3`
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 15px;
  color: #ffffff;
  position: relative;
  padding-bottom: 10px;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #ff4d4d, #f9cb28);
  }
`;

const FooterLink = styled.a`
  color: #b0b0b0;
  transition: all 0.3s ease;
  font-size: 15px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: #ffffff;
    transform: translateX(5px);
    
    svg {
      opacity: 1;
    }
  }
  
  svg {
    opacity: 0;
    transition: all 0.3s ease;
    font-size: 12px;
    color: #f9cb28;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
`;

const SocialIcon = styled.a`
  color: #b0b0b0;
  font-size: 20px;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  
  &:hover {
    color: #ffffff;
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const AppDownload = styled.div`
  margin-top: 25px;
`;

const AppButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
`;

const AppButton = styled.a`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  color: #ffffff;
  text-decoration: none;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 24px;
  }
`;

const AppButtonText = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  
  span:first-child {
    font-size: 10px;
  }
  
  span:last-child {
    font-weight: 600;
    font-size: 14px;
  }
`;

const Badge = styled.div`
  background: linear-gradient(135deg, #ff4d4d, #f9cb28);
  color: #2a2a2a;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 12px;
  display: inline-block;
  margin-bottom: 10px;
`;

const BottomSection = styled.div`
  max-width: 1200px;
  margin: 30px auto 0;
  text-align: center;
  font-size: 14px;
  color: #b0b0b0;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Copyright = styled.p`
  font-size: 13px;
`;

const ContactLink = styled.a`
  color: #f9cb28;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default function Footer() {
  const navigate = useNavigate();

  const categories = ["Men", "Women", "Kids", "Home & Living"];

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.toLowerCase()}`);
  };

  return (
    <FooterContainer>
      <GridContainer>
        {/* Online Shopping Links */}
        <Column>
          <ColumnHeading>Shop</ColumnHeading>
          {categories.map((category) => (
            <FooterLink 
              key={category}
              onClick={() => handleCategoryClick(category)}
              aria-label={`Browse ${category} products`}
            >
              <FaArrowRight />
              {category}
            </FooterLink>
          ))}
        </Column>

        {/* Customer Policies */}
        <Column>
          <ColumnHeading>Customer Service</ColumnHeading>
          <FooterLink onClick={() => navigate("/contact")}>Contact Us</FooterLink>
          <FooterLink onClick={() => navigate("/faq")}>FAQ</FooterLink>
          <FooterLink onClick={() => navigate("/terms-of-use")}>Terms of Use</FooterLink>
          <FooterLink onClick={() => navigate("/track-orders")}>Track Orders</FooterLink>
          <FooterLink onClick={() => navigate("/shipping")}>Shipping</FooterLink>
          <FooterLink onClick={() => navigate("/cancellation")}>Cancellation</FooterLink>
          <FooterLink onClick={() => navigate("/returns")}>Returns</FooterLink>
          <FooterLink onClick={() => navigate("/privacy-policy")}>Privacy Policy</FooterLink>
        </Column>

        {/* Social Media Links & App Download */}
        <Column>
          <ColumnHeading>Connect With Us</ColumnHeading>
          <SocialIcons>
            <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </SocialIcon>
            <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </SocialIcon>
            <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </SocialIcon>
            <SocialIcon href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </SocialIcon>
          </SocialIcons>
          
          <AppDownload>
            <ColumnHeading>Download App</ColumnHeading>
            <AppButtons>
              <AppButton href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                <BsGooglePlay />
                <AppButtonText>
                  <span>GET IT ON</span>
                  <span>Google Play</span>
                </AppButtonText>
              </AppButton>
              <AppButton href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                <AiOutlineApple />
                <AppButtonText>
                  <span>Download on the</span>
                  <span>App Store</span>
                </AppButtonText>
              </AppButton>
            </AppButtons>
          </AppDownload>
        </Column>

        {/* Additional Info */}
        <Column>
          <Badge>100% ORIGINAL</Badge>
          <p style={{ color: "#b0b0b0", fontSize: "14px" }}>Guaranteed for all products at Myntra.com</p>
          
          <Badge style={{ marginTop: "20px" }}>EASY RETURNS</Badge>
          <p style={{ color: "#b0b0b0", fontSize: "14px" }}>Return within 14 days of receiving your order</p>
        </Column>
      </GridContainer>

      {/* Bottom Section */}
      <BottomSection>
        <Copyright>© 2025 www.myntra.com. All rights reserved.</Copyright>
        <p>
          In case of any concern,{" "}
          <ContactLink onClick={() => navigate("/contact")}>
            Contact Us
          </ContactLink>
        </p>
      </BottomSection>
    </FooterContainer>
  );
}