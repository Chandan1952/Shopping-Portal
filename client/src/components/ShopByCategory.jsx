import React, { useEffect, useState } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";

// Animation for hover effect
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components
const Section = styled.section`
  margin: 60px 0;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f9f9ff 0%, #f0f2ff 100%);
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 30px;
  color: #2a2a72;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    width: 60%;
    height: 4px;
    background: linear-gradient(90deg, #ff7e5f, #feb47b);
    bottom: -10px;
    left: 20%;
    border-radius: 2px;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
`;

const CategoryCard = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  aspect-ratio: 1/1;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    
    &:after {
      opacity: 0.9;
    }
    
    img {
      transform: scale(1.1);
    }
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);
    transition: opacity 0.3s ease;
  }
`;

const CategoryImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 25px;
  color: white;
  text-align: left;
  z-index: 2;
`;

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const CategoryDiscount = styled.p`
  font-size: 1rem;
  font-weight: 500;
  background: linear-gradient(90deg, #ff7e5f, #feb47b);
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  margin-top: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const ShopNowButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 12px 30px;
  background: white;
  color: #2a2a72;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 3;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  
  ${CategoryCard}:hover & {
    opacity: 1;
    animation: ${pulse} 2s infinite;
  }
  
  &:hover {
    background: #2a2a72;
    color: white;
  }
`;

export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://shopping-portal-backend.onrender.com/categories")
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Section>
        <Title>Shop by Category</Title>
        <CategoryGrid>
          {[...Array(4)].map((_, i) => (
            <CategoryCard key={i}>
              <div style={{
                width: '100%',
                height: '100%',
                background: '#e0e0e0',
                borderRadius: '16px'
              }} />
            </CategoryCard>
          ))}
        </CategoryGrid>
      </Section>
    );
  }

  return (
    <Section>
      <Title>Shop by Category</Title>
      <CategoryGrid>
        {categories.map((category) => (
          <CategoryCard key={category._id}>
            <CategoryImg
              src={`https://shopping-portal-backend.onrender.com${category.img}`}
              alt={category.title}
              loading="lazy"
            />
            <Overlay>
              <CategoryTitle>{category.title}</CategoryTitle>
              <CategoryDiscount>{category.discount}</CategoryDiscount>
            </Overlay>
            <ShopNowButton>SHOP NOW</ShopNowButton>
          </CategoryCard>
        ))}
      </CategoryGrid>
    </Section>
  );
}
