import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type PostDialogProps = {
  open: boolean;
  onClose: (value: PostDialogData | undefined) => void;
};

export type PostDialogData = {
  cover?: File;
  message: string;
};

export default function PostDialog(props: PostDialogProps) {
  const [message, setMessage] = useState<string>("");
  const [cover, setCover] = useState<File | undefined>(undefined);
  const [coverUrl, setCoverUrl] = useState("");

  useEffect(() => {
    if (!cover) return;
    const url = URL.createObjectURL(cover);
    setCoverUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [cover]);

  const handleCancel = () => {
    props.onClose(undefined);
  };

  const handlePost = (event: FormEvent) => {
    event.preventDefault();
    props.onClose({
      cover,
      message,
    });
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setCover(event.target.files?.item(0) || undefined);
  };

  return (
    <Dialog
      component={"form"}
      open={props.open}
      onSubmit={handlePost}
      onClose={handleCancel}
      maxWidth={"xs"}
      fullWidth={true}
    >
      <DialogTitle>Create A Post</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>What&apos;s on your mind? Share it with the world!</Typography>
          {cover && coverUrl && (
            <>
              <img src={coverUrl} alt="Post cover preview" />
              <Typography align={"center"}>{cover.name}</Typography>
            </>
          )}
          <TextField
            type={"text"}
            label={"Message"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            multiline
          />
          <Button component={"label"} color={"info"} variant={"outlined"}>
            Upload Cover
            <input type="file" accept={"image/*"} hidden onChange={handleFileUpload} />
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type={"button"} onClick={handleCancel}>
          Cancel
        </Button>
        <Button type={"submit"} variant={"contained"}>
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
}
