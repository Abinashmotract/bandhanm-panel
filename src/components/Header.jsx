import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../theme";
import { useLocation } from "react-router-dom";

const Header = ({ title, subtitle, path }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const pathName = location.pathname
    .split("/")
    .filter(Boolean)
    .map(str => str.replace(/-/g, " "))
    .map(str => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" / ");

  return (
    <Box
      mb="10px"
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      gap={{ xs: 1, sm: 0 }}
    >
      <Box>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          fontWeight="bold"
          color={colors.weddingPink[800]}
          mb="5px"
          sx={{ 
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            fontFamily: "Playfair Display, serif",
            background: `linear-gradient(135deg, ${colors.weddingPink[600]} 0%, ${colors.weddingRose[600]} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          color={colors.weddingGold[700]}
          sx={{ 
            fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.2rem" },
            fontFamily: "Source Sans Pro, sans-serif",
            fontWeight: 500
          }}
        >
          {subtitle}
        </Typography>
      </Box>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        fontWeight="600"
        color={colors.gray[600]}
        mb="5px"
        sx={{
          fontSize: { xs: "0.8rem", sm: "1rem", md: "1.1rem" },
          textAlign: { xs: "left", sm: "right" },
          fontFamily: "Source Sans Pro, sans-serif"
        }}
      >
        Home{pathName ? ` / ${pathName}` : ""}
      </Typography>
    </Box>
  );
};

export default Header;
