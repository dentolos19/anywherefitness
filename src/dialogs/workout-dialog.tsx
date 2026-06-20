import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";

import { Workout } from "@/lib/types";

import WorkoutSelectorDialog from "./workout-selector-dialog";

type WorkoutDialogProps = {
  open: boolean;
  onClose: (value: Workout | undefined) => void;
  data?: Workout;
};

export default function WorkoutDialog(props: WorkoutDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (props.data) {
      setName(props.data.name);
      setCategory(props.data.category || "");
      setNotes(props.data.notes || "");
      setReps(props.data.reps || 0);
      setSets(props.data.sets || 0);
      setStartTime(props.data.startTime || "");
      setEndTime(props.data.endTime || "");
    } else {
      setName("");
      setCategory("");
      setNotes("");
      setReps(0);
      setSets(0);
      setStartTime("");
      setEndTime("");
    }
  }, [props.data]);

  const handleCancel = () => {
    props.onClose(undefined);
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    props.onClose({
      name,
      category,
      notes,
      reps,
      sets,
      startTime,
      endTime,
    });
  };

  return (
    <>
      <WorkoutSelectorDialog
        open={dialogOpen}
        onClose={(value) => {
          setDialogOpen(false);
          if (!value) return;
          setName(value.name);
          setCategory(value.category);
        }}
      />
      <Dialog
        component={"form"}
        open={props.open}
        onSubmit={handleSave}
        onClose={handleCancel}
        maxWidth={"sm"}
        fullWidth
      >
        <DialogTitle>Workout Manager</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>Record your workout here.</Typography>
            <Stack spacing={1}>
              <TextField type={"text"} label={"Name"} value={name} onChange={(e) => setName(e.target.value)} required />
              <TextField
                type={"text"}
                label={"Category"}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <Button variant={"outlined"} onClick={() => setDialogOpen(true)}>
                Select
              </Button>
            </Stack>
            <TextField
              type={"text"}
              label={"Notes"}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
            />
            <TextField
              type={"number"}
              label={"Reps"}
              value={reps}
              onChange={(e) => setReps(parseInt(e.target.value))}
              inputProps={{ min: 0 }}
            />
            <TextField
              type={"number"}
              label={"Sets"}
              value={sets}
              onChange={(e) => setSets(parseInt(e.target.value))}
              inputProps={{ min: 0 }}
            />
            <TextField
              type={"time"}
              label={"Start Time"}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <TextField type={"time"} label={"End Time"} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type={"button"} onClick={handleCancel}>
            Cancel
          </Button>
          <Button type={"submit"} variant={"contained"}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
