import React, { useState } from "react";
import { Box, Button, Typography, Fade } from "@mui/material";
import { Email, Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import Cookies from "js-cookie";
import Input from "../custom/Input";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = async () => {
    try {
      return await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation not supported"));
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => reject(error),
          { enableHighAccuracy: true }
        );
      });
    } catch (error) {
      console.warn("Location not available", error);
      return {};
    }
  };

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Admin login
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }
      
      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        email,
        password,
      });
      
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
      localStorage.removeItem("panelType");
      localStorage.removeItem("stylistId");
      localStorage.removeItem("vendorToken");
      
      const token = response.data.token;
      localStorage.setItem("isAuthenticated", "true");
      Cookies.set("token", token, { expires: 1 });
      localStorage.setItem("panelType", "admin");
      onLoginSuccess(true, "admin", token, null);
      
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        p: 2,
        // Background image with overlay
        backgroundImage: "linear-gradient(rgba(20.5, 12.5, 14.5, 5.5), rgba(5.5, 0.5, 10.5, 0.5)),url('https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?cs=srgb&dl=pexels-vireshstudio-1444442.jpg&fm=jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Main login card */}
      <Fade in={true} timeout={800}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 450,
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: 4,
            boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
            overflow: "hidden",
            zIndex: 10,
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Header with logo */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #2f444d 0%, #353037 100%)",
              py: 3,
              textAlign: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 1,
              }}
            >
              {/* Custom Bandhanam Logo SVG */}
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="28" fill="none" stroke="white" strokeWidth="2" />
                <path d="M20,40 Q30,15 40,40" stroke="white" strokeWidth="2" fill="none" />
                <circle cx="25" cy="25" r="4" fill="white" />
                <circle cx="35" cy="25" r="4" fill="white" />
                <path d="M25,35 L30,40 L35,35" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </Box>
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 500,
                letterSpacing: 1,
              }}
            >
              Bandhanam
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.8)",
                mt: 0.5,
              }}
            >
              Matrimony Admin Portal
            </Typography>
          </Box>

          {/* Login form */}
          <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Input
                placeholder="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Email />}
              />
            </Box>
            <Box>
              <Input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock />}
                endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
                onEndIconClick={() => setShowPassword(!showPassword)}
              />
            </Box>

            {error && (
              <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                mt: 3,
                py: 1.5,
                background: "linear-gradient(135deg, #2f444d 0%, #353037 100%)",
                color: "white",
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: 500,
                textTransform: 'none',
                "&:hover": { bgcolor: "linear-gradient(135deg, #2f444d 0%, #353037 100%)" },
              }}
              onClick={handleLogin}
            >
              {isLoading ? "Logging in..." : "Login to Dashboard"}
            </Button>

            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                mt: 3,
                color: "text.secondary",
                fontSize: "0.8rem",
              }}
            >
              Secure access for authorized personnel only
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default Login;