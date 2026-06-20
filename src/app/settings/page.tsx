"use client";

import { Edit } from "@mui/icons-material";
import { Avatar, Badge, Box, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
import { ChangeEvent, useState } from "react";

import { useApp } from "@/components/app-context";
import { getFileUrl, logoutUser, updateUser } from "@/lib/database";

export default function Page() {
  const { user, setUser } = useApp();
  const [name, setName] = useState<string>();

  useEnhancedEffect(() => {
    if (!user) return;
    setName(user.name);
  }, [user]);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("avatar", file);
    updateUser(form).then((user) => {
      setUser(user);
      alert("Your avatar has been updated!");
    });
  };

  const handleUpdate = () => {
    const form = new FormData();
    form.append("name", name!);
    updateUser(form).then((user) => {
      setUser(user);
      alert("Your account has been updated!");
    });
  };

  const handleLogout = () => {
    logoutUser();
    setUser(undefined);
  };

  return (
    <Container sx={{ my: 2 }}>
      <Stack
        spacing={1}
        sx={{
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Paper sx={{ padding: 2 }}>
          <Typography variant={"h5"} align={"center"} sx={{ marginBottom: 2 }}>
            Account
          </Typography>
          <Box sx={{ display: "flex", my: 2, justifyContent: "center" }}>
            <Badge
              overlap={"circular"}
              anchorOrigin={{
                horizontal: "right",
                vertical: "bottom",
              }}
              badgeContent={
                <IconButton component={"label"}>
                  <Edit />
                  <input type={"file"} accept="image/*" hidden onChange={handleUpload} />
                </IconButton>
              }
            >
              <Avatar
                src={user && getFileUrl(user, user.avatar)}
                sx={{
                  width: 100,
                  height: 100,
                }}
              />
            </Badge>
          </Box>
          <Stack spacing={2}>
            <TextField type={"text"} label={"Name"} value={name} onChange={(event) => setName(event.target.value)} />
            <Button variant={"contained"} onClick={handleUpdate}>
              Update
            </Button>
          </Stack>
          <Box
            sx={{
              display: "flex",
              marginTop: 2,
              gap: 1,
              "&>*": { flexGrow: 1 },
            }}
          >
            <Button color={"info"} variant={"outlined"}>
              Change Email
            </Button>
            <Button color={"info"} variant={"outlined"}>
              Change Password
            </Button>
          </Box>
          <Button color={"error"} variant={"contained"} fullWidth sx={{ marginTop: 1 }} onClick={handleLogout}>
            Logout
          </Button>
        </Paper>
      </Stack>
    </Container>
  );
}
