"use client";

import { ChevronRight, Notifications } from "@mui/icons-material";
import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";

import NotificationDialog from "@/dialogs/notification-dialog";

const notifications = [
  {
    title: "Welcome to Anywhere Fitness!",
    message:
      "Discover new friends that will be with you in your fitness journey! With Anywhere Fitness, you can find the perfect workout routine that fits your schedule and lifestyle.",
  },
];

export default function Page() {
  const [dialogData, setDialogData] = useState(notifications[0]);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <NotificationDialog open={dialogOpen} data={dialogData} onClose={() => setDialogOpen(false)} />
      <Container sx={{ my: 2 }}>
        <List sx={{ maxWidth: 600, mx: "auto" }}>
          {notifications.map((notification, index) => (
            <ListItem key={index}>
              <Paper sx={{ width: "100%" }}>
                <ListItemButton
                  onClick={() => {
                    setDialogData(notification);
                    setDialogOpen(true);
                  }}
                >
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant={"h6"}>{notification.title}</Typography>
                    <Typography color={"text.secondary"} noWrap>
                      {notification.message}
                    </Typography>
                  </ListItemText>
                  <ChevronRight />
                </ListItemButton>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
}
