"use client";

import { Add, FitnessCenter, MonitorHeart, MusicNote, PlayArrow } from "@mui/icons-material";
import { Box, Chip, SpeedDial, SpeedDialAction } from "@mui/material";
import GoogleMapReact from "google-map-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ActivitiesDialog from "@/dialogs/activities-dialog";

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
        <GoogleMapReact
          bootstrapURLKeys={{ key: "" }}
          defaultCenter={{
            lat: 1.3791139,
            lng: 103.849472,
          }}
          defaultZoom={16}
        />
        {activity && activity !== "None" && (
          <Chip
            label={activity}
            sx={{
              position: "fixed",
              top: 100,
              left: "50%",
              transform: "translate(-50%, 0)",
            }}
          />
        )}
        <SpeedDial ariaLabel={""} icon={<Add />} sx={{ position: "fixed", bottom: { xs: 80, sm: 30 }, left: 30 }}>
          <SpeedDialAction
            icon={<MusicNote />}
            tooltipTitle={"Music"}
            tooltipPlacement={"right"}
            tooltipOpen
            onClick={handleTodo}
          />
          <SpeedDialAction
            icon={<MonitorHeart />}
            tooltipTitle={"HRM"}
            tooltipPlacement={"right"}
            tooltipOpen
            onClick={handleTodo}
          />
          <SpeedDialAction
            icon={<FitnessCenter />}
            tooltipTitle={"Gym"}
            tooltipPlacement={"right"}
            tooltipOpen
            onClick={handleGym}
          />
          <SpeedDialAction
            icon={<PlayArrow />}
            tooltipTitle={"Activities"}
            tooltipPlacement={"right"}
            tooltipOpen
            onClick={handleActivities}
          />
        </SpeedDial>
      </Box>
    </>
  );
}
