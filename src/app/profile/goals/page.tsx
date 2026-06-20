"use client";

import { Add, Check } from "@mui/icons-material";
import {
  Container,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useApp } from "@/components/app-context";
import LoadingView from "@/components/loading-view";
import GoalDialog from "@/dialogs/goal-dialog";
import { Profile, getProfile, updateProfile } from "@/lib/database";
import { Goal } from "@/lib/types";

export default function Page() {
  const { user } = useApp();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<Goal | undefined>(undefined);

  useEffect(() => {
    if (!user) return;
    getProfile(user.id).then((profile) => {
      setProfile(profile);
      setGoals(profile.goals || []);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <LoadingView />;

  const updateChanges = (value: Goal[]) => {
    if (!profile) return;
    setLoading(true);
    updateProfile(profile.id, { goals: value }).then((newProfile) => {
      setGoals(value);
      setProfile(newProfile);
      setLoading(false);
    });
  };

  const handleDialogClose = (value: Goal | undefined) => {
    setDialogOpen(false);
    if (!value) return;
    let newGoals: Goal[] = [];
    if (dialogData) {
      const index = goals.indexOf(dialogData);
      if (index !== -1) {
        newGoals = [...goals];
        newGoals[index] = value;
      }
    } else {
      newGoals = [...goals, value];
    }
    updateChanges(newGoals);
  };

  const handleDelete = (index: number) => {
    const newGoals = [...goals];
    newGoals.splice(index, 1);
    updateChanges(newGoals);
  };

  return (
    <>
      <GoalDialog open={dialogOpen} onClose={handleDialogClose} data={dialogData} />
      <Container sx={{ my: 2 }}>
        <List sx={{ maxWidth: 600, mx: "auto" }}>
          {goals.length > 0 ? (
            goals.map((item, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton onClick={() => handleDelete(index)}>
                    <Check />
                  </IconButton>
                }
                disablePadding
              >
                <Paper sx={{ width: "100%" }}>
                  <ListItemButton
                    onClick={() => {
                      setDialogData(item);
                      setDialogOpen(true);
                    }}
                  >
                    <ListItemText primary={item.title} secondary={item.due && `Due ${item.due}`} />
                  </ListItemButton>
                </Paper>
              </ListItem>
            ))
          ) : (
            <Typography align={"center"}>No goals yet.</Typography>
          )}
        </List>
        <Fab
          color={"primary"}
          sx={{ position: "fixed", bottom: { xs: 80, sm: 30 }, right: 30 }}
          onClick={() => {
            setDialogData(undefined);
            setDialogOpen(true);
          }}
        >
          <Add />
        </Fab>
      </Container>
    </>
  );
}
