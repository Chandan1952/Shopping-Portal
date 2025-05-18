import React, { useState, useEffect } from "react";
import { FaTrash, FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { RiShoppingBag3Fill } from "react-icons/ri";
import styled, { keyframes } from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const WishlistContainer = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const WishlistHeader = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #2a2a72;
  text-align: center;
  position: relative;
  padding-bottom: 15px;
  
  &:after {
    content: '';
    position: absolute;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #ff7e5f, #feb47b);
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
  }
`;

const EmptyWishlist = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #f9f9ff;
  border-radius: 16px;
  margin-top: 20px;
  
  svg {
    font-size: 3rem;
    color: #ff7e5f;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 30px;
  }
  
  button {
    background: linear-gradient(90deg, #ff7e5f, #feb47b);
    color: white;
    padding: 12px 30px;
    border: none;
    border-radius: 30px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(255, 126, 95, 0.3);
    }
  }
`;

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 30px;
`;

const WishlistItem = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    
    .item-actions {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ItemImage = styled.div`
  height: 250px;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const ItemBadge = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ff3f6c;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ItemDetails = styled.div`
  padding: 20px;
`;

const ItemTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemBrand = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
`;

const ItemPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const CurrentPrice = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: #2a2a72;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
`;

const Discount = styled.span`
  font-size: 0.9rem;
  color: #ff3f6c;
  font-weight: 600;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  
  button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const MoveToCartBtn = styled.button`
  background: linear-gradient(90deg, #ff7e5f, #feb47b);
  color: white;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(255, 126, 95, 0.3);
  }
`;

const RemoveBtn = styled.button`
  background: #f0f0f0;
  color: #666;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await fetch("https://shopping-portal-backend.onrender.com/api/wishlist");
                if (!response.ok) throw new Error("Failed to fetch wishlist");
                const data = await response.json();
                setWishlist(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            const response = await fetch(`https://shopping-portal-backend.onrender.com/api/wishlist/${productId}`, { 
                method: "DELETE" 
            });
            if (!response.ok) throw new Error("Failed to remove item");
            setWishlist(wishlist.filter(item => item.productId !== productId));
        } catch (error) {
            alert(error.message);
        }
    };

    const handleMoveToCart = async (item) => {
        try {
            const response = await fetch("https://shopping-portal-backend.onrender.com/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: item.productId,
                    name: item.name,
                    brand: item.brand || "Unknown",
                    price: item.price,
                    quantity: 1,
                    size: item.size || "M",
                    discount: item.discount || 0,
                    image: item.image,
                }),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                await handleRemove(item.productId);
            } else {
                alert(`Failed to add: ${data.message || "Unknown error"}`);
            }
        } catch (error) {
            alert("Error adding to cart. Try again.");
        }
    };

    if (loading) return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh' 
        }}>
            <div className="spinner"></div>
        </div>
    );

    if (error) return (
        <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: 'red' 
        }}>
            <p>{error}</p>
            <button 
                onClick={() => window.location.reload()}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    background: '#ff3f6c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Try Again
            </button>
        </div>
    );

    return (
        <>
            <Header />
            <WishlistContainer>
                <WishlistHeader>
                    My Wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
                </WishlistHeader>
                
                {wishlist.length === 0 ? (
                    <EmptyWishlist>
                        <FaRegHeart />
                        <p>Your wishlist is empty</p>
                        <p>Start adding items you love!</p>
                        <button onClick={() => window.location.href = '/products'}>
                            Continue Shopping
                        </button>
                    </EmptyWishlist>
                ) : (
                    <WishlistGrid>
                        {wishlist.map(item => {
                            const originalPrice = item.discount > 0 
                                ? Math.round(item.price / (1 - item.discount / 100))
                                : item.price;
                                
                            return (
                                <WishlistItem key={item.productId}>
                                    <ItemImage>
                                        <img
                                            src={item.image.startsWith("/uploads/") 
                                                ? `https://shopping-portal-backend.onrender.com${item.image}` 
                                                : item.image || "https://via.placeholder.com/300"}
                                            alt={item.name}
                                            onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
                                        />
                                        {item.discount > 0 && (
                                            <ItemBadge>{item.discount}% OFF</ItemBadge>
                                        )}
                                    </ItemImage>
                                    
                                    <ItemDetails>
                                        <ItemBrand>{item.brand || "Generic Brand"}</ItemBrand>
                                        <ItemTitle>{item.name}</ItemTitle>
                                        
                                        <ItemPrice>
                                            <CurrentPrice>Rs. {item.price}</CurrentPrice>
                                            {item.discount > 0 && (
                                                <>
                                                    <OriginalPrice>Rs. {originalPrice}</OriginalPrice>
                                                    <Discount>(Save Rs. {originalPrice - item.price})</Discount>
                                                </>
                                            )}
                                        </ItemPrice>
                                        
                                        <ItemActions className="item-actions">
                                            <MoveToCartBtn onClick={() => handleMoveToCart(item)}>
                                                <RiShoppingBag3Fill /> Move to Bag
                                            </MoveToCartBtn>
                                            <RemoveBtn onClick={() => handleRemove(item.productId)}>
                                                <FaTrash /> Remove
                                            </RemoveBtn>
                                        </ItemActions>
                                    </ItemDetails>
                                </WishlistItem>
                            );
                        })}
                    </WishlistGrid>
                )}
            </WishlistContainer>
            <Footer />
        </>
    );
};

export default Wishlist;
