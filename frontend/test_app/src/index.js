// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MainPage from "./MainPage";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#DA48FE",
      light: "#E668FF",
      dark: "#B03EE6",
    },
    secondary: {
      main: "#FF4757",
      light: "#FF6B7A",
      dark: "#E84354",
    },
    background: {
      default: "#1A1A1A",
      paper: "#2A2A2A",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#2A2A2A",
          border: "1px solid #DA48FE",
          borderRadius: "8px",
          boxShadow: "0 0 20px rgba(218, 72, 254, 0.3)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "rgba(218, 72, 254, 0.1)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(218, 72, 254, 0.2)",
            "&:hover": {
              backgroundColor: "rgba(218, 72, 254, 0.3)",
            },
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: "#2A2A2A",
          border: "1px solid #DA48FE",
          borderRadius: "8px",
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MainPage />
    </ThemeProvider>
  </React.StrictMode>
);
