"use client";

import {
  AccountCircle,
  ChevronLeft,
  EmojiPeople,
  Home,
  Info,
  Menu,
  Notifications,
  Timeline,
} from "@mui/icons-material";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
} from "@mui/material";
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { useApp } from "@/components/app-context";
import AuthenticationView from "@/components/authentication-view";
import LoadingView from "@/components/loading-view";
import { checkUser, getUser } from "@/lib/database";

const navigations = [
  {
    label: "Home",
    icon: <Home />,
    url: "/",
  },
  {
    label: "Track",
    icon: <Timeline />,
    url: "/track",
  },
  {
    label: "Ads",
    icon: <EmojiPeople />,
    url: "/advertisements",
  },
];

export default function AppShell(props: { children?: React.ReactNode }) {
  const router = useRouter();

  const { user, setUser } = useApp();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEnhancedEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }
    if (!checkUser()) {
      setLoading(false);
      return;
    }
    const authUser = getUser();
    setUser(authUser);
    setLoading(false);
  }, []);

  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <AppBar>
        <Toolbar>
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
            <IconButton onClick={() => setOpen(true)}>
              <Menu />
            </IconButton>
            <Box sx={{ height: 50 }}>
              <img src={"/assets/title.png"} />
            </Box>
          </Box>
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <IconButton onClick={() => router.back()}>
              <ChevronLeft />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <Tooltip title={"Notifications"}>
              <IconButton onClick={() => router.push("/notifications")}>
                <Notifications />
              </IconButton>
            </Tooltip>
            <Tooltip title={"Profile"}>
              <IconButton onClick={() => router.push("/profile")}>
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Tooltip title={"About"}>
              <IconButton onClick={() => router.push("/about")}>
                <Info />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
        <Drawer open={open} onClose={() => setOpen(false)}>
          <Toolbar>
            <IconButton onClick={() => setOpen(false)}>
              <ChevronLeft />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            {navigations.map((navigation, index) => (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  width: 300,
                }}
              >
                <ListItemButton
                  onClick={() => {
                    router.push(navigation.url);
                    setOpen(false);
                  }}
                >
                  <ListItemIcon>{navigation.icon}</ListItemIcon>
                  <ListItemText>{navigation.label}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </AppBar>
      <BottomNavigation
        showLabels
        sx={{
          display: { xs: "flex", sm: "none" },
          width: "100vw",
          position: "fixed",
          bottom: 0,
        }}
      >
        {navigations.map((navigation, index) => (
          <BottomNavigationAction
            key={index}
            label={navigation.label}
            icon={navigation.icon}
            onClick={() => router.push(navigation.url)}
          />
        ))}
      </BottomNavigation>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        <Box sx={{ flex: "1", overflow: "hidden auto" }}>
          {loading ? <LoadingView /> : user ? props.children : <AuthenticationView />}
        </Box>
        <BottomNavigation sx={{ display: { xs: "flex", sm: "none" } }} />
      </Box>
    </Box>
  );
}
