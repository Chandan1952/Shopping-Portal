import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Discover() {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    axios
      .get("https://shopping-portal-backend.onrender.com/carousel-images")
      .then((res) => setImages(res.data.images))
      .catch((err) => console.error("Error fetching images:", err));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

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
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
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
            maxHeight: "550px",
            objectFit: "cover",
            borderRadius: "12px",
            transition: "opacity 0.5s ease-in-out",
          }}
        />
      )}
      <button
        onClick={prevSlide}
        style={{
          position: "absolute",
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0, 0, 0, 0.6)",
          color: "#fff",
          border: "none",
          padding: "12px",
          cursor: "pointer",
          borderRadius: "50%",
          fontSize: "20px",
          transition: "background 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.background = "rgba(0, 0, 0, 0.8)")}
        onMouseLeave={(e) => (e.target.style.background = "rgba(0, 0, 0, 0.6)")}
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        style={{
          position: "absolute",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0, 0, 0, 0.6)",
          color: "#fff",
          border: "none",
          padding: "12px",
          cursor: "pointer",
          borderRadius: "50%",
          fontSize: "20px",
          transition: "background 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.background = "rgba(0, 0, 0, 0.8)")}
        onMouseLeave={(e) => (e.target.style.background = "rgba(0, 0, 0, 0.6)")}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
