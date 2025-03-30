import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Discover() {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  // Fetch images from API
  useEffect(() => {
    axios
      .get("https://shopping-portal-backend.onrender.com/carousel-images")
      .then((res) => setImages(res.data.images))
      .catch((err) => console.error("Error fetching images:", err));
  }, []);

  // Memoized function to move to the next slide
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Move to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  // Auto-slide functionality (every 3 seconds, unless hovered)
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(nextSlide, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, nextSlide]);

  // Handle swipe gestures for mobile users
  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchMove = (e) => {
    if (!touchStartX) return;
    const touchEndX = e.touches[0].clientX;
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchStartX - touchEndX < -50) prevSlide();
    setTouchStartX(null);
  };

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {images.length > 0 && (
        <div
          style={{
            display: "flex",
            transition: "transform 0.5s ease-in-out",
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Slide ${index + 1}`}
              style={{
                width: "100%",
                height: "80vh",
                objectFit: "contain",
                flexShrink: 0,
                "@media (max-width: 768px)": {
                  height: "50vh",
                },
              }}
            />
          ))}
        </div>
      )}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        style={{
          position: "absolute",
          left: "15px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          border: "none",
          padding: "12px",
          cursor: "pointer",
          borderRadius: "50%",
          fontSize: "20px",
          transition: "background 0.3s",
          "@media (max-width: 768px)": {
            padding: "8px",
            fontSize: "16px",
            left: "5px",
          },
        }}
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        style={{
          position: "absolute",
          right: "15px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          border: "none",
          padding: "12px",
          cursor: "pointer",
          borderRadius: "50%",
          fontSize: "20px",
          transition: "background 0.3s",
          "@media (max-width: 768px)": {
            padding: "8px",
            fontSize: "16px",
            right: "5px",
          },
        }}
      >
        <FaChevronRight />
      </button>

      {/* Dots Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "15px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
        }}
      >
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: currentSlide === index ? "14px" : "10px",
              height: currentSlide === index ? "14px" : "10px",
              borderRadius: "50%",
              backgroundColor: currentSlide === index ? "#fff" : "rgba(255, 255, 255, 0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
