import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, Typography, IconButton, Skeleton } from "@mui/material";

export default function Discover() {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://shopping-portal-backend.onrender.com/carousel-images")
      .then((res) => {
        setImages(res.data.images);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching images:", err);
        setIsLoading(false);
      });
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isHovered && images.length > 0) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered, nextSlide, images.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={isMobile ? 300 : 550}
        sx={{ borderRadius: 2 }}
      />
    );
  }

  if (!isLoading && images.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: isMobile ? 300 : 550,
          backgroundColor: theme.palette.grey[100],
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="textSecondary">
          No images available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        borderRadius: "12px",
        boxShadow: theme.shadows[4],
        height: isMobile ? 300 : 550,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ height: "100%" }}
        >
          <Box
            component="img"
            src={images[currentSlide].url}
            alt="Carousel"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <IconButton
        onClick={prevSlide}
        sx={{
          position: "absolute",
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
          width: 48,
          height: 48,
          display: isHovered ? "flex" : { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
        }}
        aria-label="Previous slide"
      >
        <FaChevronLeft size={20} />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        sx={{
          position: "absolute",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
          width: 48,
          height: 48,
          display: isHovered ? "flex" : { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
        }}
        aria-label="Next slide"
      >
        <FaChevronRight size={20} />
      </IconButton>

      {/* Slide Indicators */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
        }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor:
                currentSlide === index
                  ? theme.palette.primary.main
                  : "rgba(255, 255, 255, 0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor:
                  currentSlide === index
                    ? theme.palette.primary.dark
                    : "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
        ))}
      </Box>

      {/* Optional: Add text overlay */}
      {images[currentSlide]?.title && (
        <Box
          sx={{
            position: "absolute",
            bottom: 60,
            left: 20,
            right: 20,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            padding: 2,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6">{images[currentSlide].title}</Typography>
          {images[currentSlide].description && (
            <Typography variant="body2">
              {images[currentSlide].description}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
