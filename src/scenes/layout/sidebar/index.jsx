/* eslint-disable react/prop-types */
import React from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import logo from "../../../assets/images/bandhnm.png";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  DashboardOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  CalendarMonthOutlined,
  InventoryOutlined,
  AccessTimeOutlined,
  AddCircleOutline,
  Close,
  HistoryOutlined,
  CardMembershipOutlined,
  AdminPanelSettingsOutlined,
  AnalyticsOutlined,
  ReportOutlined,
  SettingsOutlined,
  NotificationsOutlined,
  FavoriteOutlined,
  ChatOutlined,
  VerifiedUserOutlined,
  ReceiptOutlined
} from "@mui/icons-material";
import Item from "./Item";
import { ToggledContext } from "../../../App";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const panelType = "admin"; // Fixed to admin panel only
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const isMobile = useMediaQuery("(max-width:480px)");

  useEffect(() => {
    if (!isMdDevices) {
      const mainContent = document.querySelector("[data-main-content]");
      if (mainContent) {
        const sidebarWidth = collapsed ? 80 : 250;
        mainContent.style.marginLeft = `${sidebarWidth}px`;
      }
    }
  }, [collapsed, isMdDevices]);

  // Mobile: update marginLeft based on toggled state
  useEffect(() => {
    if (isMdDevices) {
      const mainContent = document.querySelector("[data-main-content]");
      if (mainContent) {
        mainContent.style.marginLeft = toggled ? "250px" : "0px";
      }
    }
  }, [toggled, isMdDevices]);

  const navSections = {
    admin: [
      { title: "User Management", path: "/user-management", icon: <PeopleAltOutlined /> },
      { title: "Subscription Management", path: "/subscription-management", icon: <CardMembershipOutlined /> },
      { title: "Transactions", path: "/transactions", icon: <ReceiptOutlined /> },
      { title: "Matches & Connections", path: "/matches", icon: <FavoriteOutlined /> },
      { title: "Messages & Chats", path: "/messages", icon: <ChatOutlined /> },
      { title: "Verification Center", path: "/verification", icon: <VerifiedUserOutlined /> },
      { title: "Reports & Analytics", path: "/analytics", icon: <AnalyticsOutlined /> },
      { title: "Success Stories", path: "/success-stories", icon: <HistoryOutlined /> },
      { title: "Notifications", path: "/notifications", icon: <NotificationsOutlined /> },
      { title: "System Settings", path: "/settings", icon: <SettingsOutlined /> },
    ],
    vendor: [
      { title: "Packages", path: "/packages", icon: <InventoryOutlined /> },
      { title: "Services", path: "/services", icon: <CalendarMonthOutlined /> },
      { title: "Portfolio", path: "/portfolio", icon: <AddCircleOutline /> },
      {
        title: "Availability Management",
        path: "/availability",
        icon: <AccessTimeOutlined />,
      },
      {
        title: "Appointment Management",
        path: "/appointment",
        icon: <HistoryOutlined />,
      },
    ],
  };

  return (
    <Sidebar
      backgroundColor="transparent"
      rootStyles={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 1000,
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderColor: "#d88cb4",
        WebkitTransition: "width, left, right, 300ms",
        transition: "width, left, right, 300ms",
        width: collapsed ? "80px" : "250px",
        minWidth: collapsed ? "80px" : "250px",
        border: 0,
        background: "#51365F",
        boxShadow: "0 8px 32px rgba(216, 27, 96, 0.15)",
        "@media (max-width: 768px)": {
          width: toggled ? "250px" : "0px",
          minWidth: toggled ? "250px" : "0px",
        },
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
      className="sidebar-container"
    >
      <Menu
        menuItemStyles={{ button: { ":hover": { background: "transparent" } } }}
      >
        <MenuItem rootStyles={{ margin: "10px 0 20px 0", color: "#FFFFFF" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: { xs: "0 10px", sm: "0 1px" },
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: ".3s ease" }}
              >
                <img
                  alt="avatar"
                  src={logo}
                  height={isMobile ? "40" : "70"}
                  // style={{
                  //   maxWidth: "100%",
                  //   filter: "brightness(0) invert(1)",
                  //   transition: "0.3s ease",
                  // }}
                />{" "}
              </Box>
            )}
            {isMdDevices && toggled && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                <IconButton
                  onClick={() => setToggled(false)}
                  sx={{ color: "#FFFFFF" }}
                >
                  <Close sx={{ fontSize: 24 }} />
                </IconButton>
              </Box>
            )}
            {!isMdDevices && (
              <IconButton
                onClick={() => setCollapsed(!collapsed)}
                sx={{ color: "#FFFFFF", padding: { xs: "8px", sm: "12px" } }}
              >
                <MenuOutlined sx={{ fontSize: { xs: "18px", sm: "20px" } }} />
              </IconButton>
            )}
          </Box>
        </MenuItem>
      </Menu>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />

      <Box mb={5} pl={collapsed ? undefined : { xs: "3%", sm: "5%" }}>
        <Menu
          menuItemStyles={{
            button: {
              transition: "all 0.4s ease",
              fontWeight: "600",
              color: "#FFFFFF",
              fontSize: { xs: "14px", sm: "16px" },
              padding: { xs: "12px 16px", sm: "16px 20px" },
              margin: "4px 8px",
              borderRadius: "12px",
              ":hover": {
                color: "#FFFFFF",
                background: "rgba(255,255,255,0.2)",
                transform: "translateX(8px)",
                boxShadow: "0 4px 12px rgba(255,255,255,0.1)",
              },
            },
          }}
        >
          <Item
            title="Dashboard"
            path="/"
            colors={colors}
            icon={<DashboardOutlined sx={{ color: "#FFFFFF" }} />}
          />
        </Menu>

        <Divider sx={{ mx: "auto", borderColor: "#fff" }} />
        <Menu
          menuItemStyles={{
            button: {
              transition: "all 0.4s ease",
              fontWeight: "600",
              color: "#FFFFFF",
              fontSize: { xs: "14px", sm: "16px" },
              padding: { xs: "12px 16px", sm: "16px 20px" },
              margin: "4px 8px",
              borderRadius: "12px",
              ":hover": {
                color: "#FFFFFF",
                background: "rgba(255,255,255,0.2)",
                transform: "translateX(8px)",
                boxShadow: "0 4px 12px rgba(255,255,255,0.1)",
              },
            },
          }}
        >
          {(navSections[panelType] || []).map(({ title, path, icon }) => (
            <Item
              key={title}
              title={title}
              path={path}
              colors={colors}
              icon={React.cloneElement(icon, { sx: { color: "#FFFFFF" } })}
            />
          ))}
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
