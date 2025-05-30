import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Skeleton, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function BrandsSection() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("https://myntra-clone-api.vercel.app/api/brands");
        setBrands(response.data);
      } catch (err) {
        setError("Failed to load brands. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleCategoryClick = (category) => {
    const formattedCategory = category.toLowerCase().replace(/ & /g, "%26").replace(/\s/g, "%20");
    navigate(`/products?category=${formattedCategory}`);
  };

  if (error) return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography color="error">{error}</Typography>
    </Box>
  );

  const menBrands = brands.filter((brand) => brand.category === "men");
  const womenBrands = brands.filter((brand) => brand.category === "women");
  const kidsBrands = brands.filter((brand) => brand.category === "kids");

  return (
    <Box sx={{ maxWidth: "1400px", margin: "0 auto", px: isMobile ? 2 : 4 }}>
      <BrandSection 
        title="Men's Fashion" 
        brands={menBrands} 
        loading={loading}
        onTitleClick={() => handleCategoryClick("Men")} 
      />
      <BrandSection 
        title="Women's Fashion" 
        brands={womenBrands} 
        loading={loading}
        onTitleClick={() => handleCategoryClick("Women")} 
      />
      <BrandSection 
        title="Kids' Fashion" 
        brands={kidsBrands} 
        loading={loading}
        onTitleClick={() => handleCategoryClick("Kids")} 
      />
    </Box>
  );
}

function BrandSection({ title, brands, loading, onTitleClick }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ mb: 6 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          mb: 3, 
          cursor: "pointer",
          "&:hover": { color: theme.palette.primary.main },
          transition: "color 0.3s ease",
          textTransform: "uppercase",
          letterSpacing: "1px",
          position: "relative",
          display: "inline-block",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: 0,
            width: "50%",
            height: "3px",
            backgroundColor: theme.palette.primary.main,
            transition: "width 0.3s ease",
          },
          "&:hover::after": {
            width: "100%",
          }
        }}
        onClick={onTitleClick}
      >
        {title}
      </Typography>
      
      {loading ? (
        <Box sx={{ display: "flex", gap: 2 }}>
          {[...Array(5)].map((_, index) => (
            <Skeleton 
              key={index} 
              variant="rounded" 
              width={isMobile ? 120 : 180} 
              height={isMobile ? 80 : 120} 
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      ) : (
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={isMobile ? 10 : 20}
          slidesPerView={"auto"}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          style={{ padding: "10px 5px" }}
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand.id} style={{ width: "auto" }}>
              <BrandCard brand={brand} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Box>
  );
}

function BrandCard({ brand }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!brand?.category || !brand?.brand) {
      console.error("Brand data is missing:", brand);
      return;
    }
    navigate(`/products?category=${brand.category.toLowerCase()}&brand=${brand.brand.toLowerCase()}`);
  };

  return (
    <Box
      sx={{
        width: 220,
        height: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: isHovered 
          ? `0 10px 20px ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`
          : "0 4px 8px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.palette.primary.main,
          opacity: isHovered ? 0.1 : 0,
          transition: "opacity 0.3s ease",
          zIndex: 1,
        },
        "&:hover": {
          transform: "translateY(-5px)",
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {brand?.img ? (
        <Box
          component="img"
          src={`https://shopping-portal-backend.onrender.com${brand.img}`}
          alt={brand?.brand || "Brand"}
          sx={{
            maxWidth: "100%",
            maxHeight: "80%",
            objectFit: "contain",
            filter: isHovered ? "none" : "grayscale(20%)",
            transition: "filter 0.3s ease",
          }}
        />
      ) : (
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.text.secondary,
            textAlign: "center",
          }}
        >
          {brand?.brand || "Brand"}
        </Typography>
      )}
    </Box>
  );
}
