import { Box, Button, Container, Paper, Stack, TextField } from "@mui/material";
import { FormEvent, useState } from "react";

import { useApp } from "@/components/app-context";
import LoadingView from "@/components/loading-view";
import { loginUser, registerUser } from "@/lib/database";

export default function AuthenticationView() {
  const { setUser } = useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  if (loading) return <LoadingView />;

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    loginUser({ username, password }).then(
      (user) => {
        setUser(user.record);
        setLoading(false);
      },
      () => {
        alert("Unable to login.");
        setLoading(false);
      },
    );
  };

  const handleRegister = (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Your passwords do not match.");
      return;
    }
    setLoading(true);
    registerUser({ name, username, email, password }).then(
      (user) => {
        setUser(user);
        setLoading(false);
      },
      () => {
        alert("Unable to register.");
        setLoading(false);
      },
    );
  };

  return (
    <Container sx={{ my: 2 }}>
      <Paper sx={{ maxWidth: 400, mx: "auto", padding: 2 }}>
        <Box sx={{ marginBottom: 1 }}>
          <img src={"/assets/title.png"} />
        </Box>
        {mode === "login" ? (
          <Box component={"form"} onSubmit={handleLogin}>
            <Stack spacing={2}>
              <TextField
                label={"Username"}
                type={"text"}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
              <TextField
                label={"Password"}
                type={"password"}
                value={password}
                inputProps={{
                  minLength: 8,
                }}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Stack>
            <Box
              sx={{
                display: "flex",
                marginTop: 2,
                gap: 1,
                "&>*": { flexGrow: 1 },
              }}
            >
              <Button type={"submit"} variant={"contained"}>
                Login
              </Button>
              <Button type={"button"} variant={"outlined"} onClick={() => setMode("register")}>
                Register
              </Button>
            </Box>
          </Box>
        ) : (
          <Box component={"form"} onSubmit={handleRegister}>
            <Stack spacing={2}>
              <TextField
                label={"Name"}
                type={"text"}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
              <TextField
                label={"Username"}
                type={"text"}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
              <TextField
                label={"Email"}
                type={"email"}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <TextField
                label={"Password"}
                type={"password"}
                value={password}
                inputProps={{
                  minLength: 8,
                }}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <TextField
                label={"Confirm Password"}
                type={"password"}
                value={confirmPassword}
                inputProps={{
                  minLength: 8,
                }}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </Stack>
            <Box
              sx={{
                display: "flex",
                marginTop: 2,
                gap: 1,
                "&>*": { flexGrow: 1 },
              }}
            >
              <Button type={"button"} variant={"outlined"} onClick={() => setMode("login")}>
                Login
              </Button>
              <Button type={"submit"} variant={"contained"}>
                Register
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
