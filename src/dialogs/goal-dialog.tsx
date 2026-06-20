import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";

import { Goal } from "@/lib/types";

type GoalDialogProps = {
  open: boolean;
  onClose: (value: Goal | undefined) => void;
  data?: Goal;
};

export default function GoalDialog(props: GoalDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (props.data) {
      setTitle(props.data.title);
      setDescription(props.data.description || "");
      setDate(props.data.due || "");
    } else {
      setTitle("");
      setDescription("");
      setDate("");
    }
  }, [props.data]);

  const handleCancel = () => {
    props.onClose(undefined);
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    props.onClose({ title, description, due: date });
  };

  return (
    <Dialog component={"form"} open={props.open} onSubmit={handleSave} onClose={handleCancel} maxWidth={"xs"} fullWidth>
      <DialogTitle>Goal Setting</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>Describe what you are going to achieve.</Typography>
          <TextField type={"text"} label={"Title"} value={title} onChange={(e) => setTitle(e.target.value)} required />
          <TextField
            type={"text"}
            label={"Description"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
          />
          <TextField type={"date"} label={"Date"} value={date} onChange={(e) => setDate(e.target.value)} />
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
  );
}
