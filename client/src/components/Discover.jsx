import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Discover() {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0px auto",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.length > 0 && (
        <img
          src={images[currentSlide].url}
          alt="Carousel"
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "contain",
            transition: "opacity 0.5s ease-in-out",
          }}
        />
      )}
      <button
        onClick={prevSlide}
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          border: "none",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "50%",
        }}
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          border: "none",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "50%",
        }}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
