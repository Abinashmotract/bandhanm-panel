import { createTheme } from "@mui/material";
import { useMemo } from "react";
import { useState } from "react";
import { createContext } from "react";

// Color Design Tokens - Wedding Theme
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        gray: {
          100: "#f5f5f5",
          200: "#e8e8e8",
          300: "#d1d1d1",
          400: "#b4b4b4",
          500: "#9a9a9a",
          600: "#818181",
          700: "#6a6a6a",
          800: "#5a5a5a",
          900: "#4a4a4a",
        },
        primary: {
          100: "#f8e8f0",
          200: "#f0d1e1",
          300: "#e8bad2",
          400: "#e0a3c3",
          500: "#d88cb4",
          600: "#ad7090",
          700: "#82546c",
          800: "#573848",
          900: "#2c1c24",
        },
        weddingGold: {
          100: "#fff8e1",
          200: "#fff1c4",
          300: "#ffeaa7",
          400: "#ffe38a",
          500: "#ffdc6d",
          600: "#ccb057",
          700: "#998441",
          800: "#66582b",
          900: "#332c16",
        },
        weddingPink: {
          100: "#fce4ec",
          200: "#f8bbd9",
          300: "#f48fb1",
          400: "#f06292",
          500: "#ec407a",
          600: "#d81b60",
          700: "#ad1457",
          800: "#880e4f",
          900: "#4a0e2a",
        },
        weddingRose: {
          100: "#f3e5f5",
          200: "#e1bee7",
          300: "#ce93d8",
          400: "#ba68c8",
          500: "#ab47bc",
          600: "#9c27b0",
          700: "#8e24aa",
          800: "#7b1fa2",
          900: "#4a148c",
        },
        weddingCream: {
          100: "#fefefe",
          200: "#fdfcfc",
          300: "#fcfafa",
          400: "#fbf8f8",
          500: "#faf6f6",
          600: "#c8c5c5",
          700: "#969494",
          800: "#646262",
          900: "#323131",
        },
      }
    : {
        gray: {
          100: "#f5f5f5",
          200: "#e8e8e8",
          300: "#d1d1d1",
          400: "#b4b4b4",
          500: "#9a9a9a",
          600: "#818181",
          700: "#6a6a6a",
          800: "#5a5a5a",
          900: "#4a4a4a",
        },
        primary: {
          100: "#f8e8f0",
          200: "#f0d1e1",
          300: "#e8bad2",
          400: "#e0a3c3",
          500: "#d88cb4",
          600: "#ad7090",
          700: "#82546c",
          800: "#573848",
          900: "#2c1c24",
        },
        weddingGold: {
          100: "#fff8e1",
          200: "#fff1c4",
          300: "#ffeaa7",
          400: "#ffe38a",
          500: "#ffdc6d",
          600: "#ccb057",
          700: "#998441",
          800: "#66582b",
          900: "#332c16",
        },
        weddingPink: {
          100: "#fce4ec",
          200: "#f8bbd9",
          300: "#f48fb1",
          400: "#f06292",
          500: "#ec407a",
          600: "#d81b60",
          700: "#ad1457",
          800: "#880e4f",
          900: "#4a0e2a",
        },
        weddingRose: {
          100: "#f3e5f5",
          200: "#e1bee7",
          300: "#ce93d8",
          400: "#ba68c8",
          500: "#ab47bc",
          600: "#9c27b0",
          700: "#8e24aa",
          800: "#7b1fa2",
          900: "#4a148c",
        },
        weddingCream: {
          100: "#fefefe",
          200: "#fdfcfc",
          300: "#fcfafa",
          400: "#fbf8f8",
          500: "#faf6f6",
          600: "#c8c5c5",
          700: "#969494",
          800: "#646262",
          900: "#323131",
        },
      }),
});

// Mui Theme Settings - Wedding Theme
export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.weddingPink[600],
              light: colors.weddingPink[400],
              dark: colors.weddingPink[800],
            },
            secondary: {
              main: colors.weddingGold[500],
              light: colors.weddingGold[300],
              dark: colors.weddingGold[700],
            },
            accent: {
              main: colors.weddingRose[500],
              light: colors.weddingRose[300],
              dark: colors.weddingRose[700],
            },
            neutral: {
              dark: colors.gray[700],
              main: colors.gray[500],
              light: colors.gray[100],
            },
            background: {
              default: colors.weddingCream[100],
              alt: colors.weddingCream[200],
              paper: colors.weddingCream[100],
            },
            text: {
              primary: colors.gray[800],
              secondary: colors.gray[600],
            },
          }
        : {
            primary: {
              main: colors.weddingPink[600],
              light: colors.weddingPink[400],
              dark: colors.weddingPink[800],
            },
            secondary: {
              main: colors.weddingGold[500],
              light: colors.weddingGold[300],
              dark: colors.weddingGold[700],
            },
            accent: {
              main: colors.weddingRose[500],
              light: colors.weddingRose[300],
              dark: colors.weddingRose[700],
            },
            neutral: {
              dark: colors.gray[700],
              main: colors.gray[500],
              light: colors.gray[100],
            },
            background: {
              default: colors.weddingCream[100],
              alt: colors.weddingCream[200],
              paper: colors.weddingCream[100],
            },
            text: {
              primary: colors.gray[800],
              secondary: colors.gray[600],
            },
          }),
    },
    typography: {
      fontFamily: ["Playfair Display", "Source Sans Pro", "serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Playfair Display", "serif"].join(","),
        fontSize: 40,
        fontWeight: 700,
        color: colors.weddingPink[800],
      },
      h2: {
        fontFamily: ["Playfair Display", "serif"].join(","),
        fontSize: 32,
        fontWeight: 600,
        color: colors.weddingPink[700],
      },
      h3: {
        fontFamily: ["Playfair Display", "serif"].join(","),
        fontSize: 24,
        fontWeight: 600,
        color: colors.weddingPink[600],
      },
      h4: {
        fontFamily: ["Playfair Display", "serif"].join(","),
        fontSize: 20,
        fontWeight: 500,
        color: colors.gray[800],
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 500,
        color: colors.gray[700],
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
        fontWeight: 500,
        color: colors.gray[600],
      },
      body1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
        color: colors.gray[700],
      },
      body2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 12,
        color: colors.gray[600],
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(216, 27, 96, 0.15)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(216, 27, 96, 0.25)',
            },
          },
          contained: {
            background: `linear-gradient(135deg, ${colors.weddingPink[600]} 0%, ${colors.weddingPink[700]} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${colors.weddingPink[700]} 0%, ${colors.weddingPink[800]} 100%)`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            border: `1px solid ${colors.weddingCream[300]}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: colors.weddingCream[100],
          },
        },
      },
    },
  };
};

// Context For Color Mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(() => ({
    toggleColorMode: () =>
      setMode((prev) => (prev === "light" ? "dark" : "light")),
  }));

  const theme = useMemo(() => createTheme(themeSettings(mode), [mode]));

  return [theme, colorMode];
};
