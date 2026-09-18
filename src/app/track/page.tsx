"use client";

import { Add, FitnessCenter, MonitorHeart, MusicNote, PlayArrow } from "@mui/icons-material";
import { Box, Chip, SpeedDial, SpeedDialAction } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ActivitiesDialog from "@/dialogs/activities-dialog";

import MapView from "./_components/map-view";

export default function Page() {
  const router = useRouter();

  const [activity, setActivity] = useState<string>();
  const [activitiesDialogOpen, setActivitiesDialogOpen] = useState(false);

  const handleTodo = () => alert("This feature is not implemented yet!");
  const handleGym = () => router.push("/track/gym");
  const handleActivities = () => setActivitiesDialogOpen(true);

  const handleActivitiesDialogClose = (value: string | undefined) => {
    setActivitiesDialogOpen(false);
    if (!value) return;
    setActivity(value);
  };

  return (
    <>
      <ActivitiesDialog open={activitiesDialogOpen} onClose={handleActivitiesDialogClose} />
      <Box sx={{ height: "100%" }}>
        <MapView />
        {activity && activity !== "None" && (
          <Chip
            color={"primary"}
            label={activity}
            sx={{
              boxShadow: 4,
              fontWeight: 500,
              left: "50%",
              position: "fixed",
              top: 100,
              transform: "translate(-50%, 0)",
              zIndex: 1500,
            }}
            variant={"filled"}
          />
        )}
        <SpeedDial ariaLabel={""} icon={<Add />} sx={{ position: "fixed", bottom: { xs: 80, sm: 30 }, left: 30 }}>
          <SpeedDialAction
            icon={<MusicNote />}
            onClick={handleTodo}
            slotProps={{
              tooltip: {
                title: "Music",
                placement: "right",
                open: true,
              },
            }}
          />
          <SpeedDialAction
            icon={<MonitorHeart />}
            onClick={handleTodo}
            slotProps={{
              tooltip: {
                title: "HRM",
                placement: "right",
                open: true,
              },
            }}
          />
          <SpeedDialAction
            icon={<FitnessCenter />}
            onClick={handleGym}
            slotProps={{
              tooltip: {
                title: "Gym",
                placement: "right",
                open: true,
              },
            }}
          />
          <SpeedDialAction
            icon={<PlayArrow />}
            onClick={handleActivities}
            slotProps={{
              tooltip: {
                title: "Activities",
                placement: "right",
                open: true,
              },
            }}
          />
        </SpeedDial>
      </Box>
    </>
  );
}
