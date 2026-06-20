"use client";

import { Add } from "@mui/icons-material";
import { Container, Fab, Stack } from "@mui/material";
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
import { useState } from "react";

import AdvertisementItem from "@/app/advertisements/_components/advertisement-item";
import LoadingView from "@/components/loading-view";
import PostAdvertisementDialog, { PostAdvertisementDialogData } from "@/dialogs/post-advertisement-dialog";
import { Advertisement, createAdvertisement, deleteAdvertisement, getAdvertisements } from "@/lib/database";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [open, setOpen] = useState(false);

  useEnhancedEffect(() => {
    getAdvertisements().then((advertisements) => {
      setAdvertisements(advertisements.items);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingView />;

  const handlePost = (value: PostAdvertisementDialogData | undefined) => {
    setOpen(false);
    if (!value) return;
    setLoading(true);
    createAdvertisement({
      title: value.title,
      description: value.description,
    }).then(
      (advertisement) => {
        setAdvertisements([advertisement, ...advertisements]);
        setLoading(false);
      },
      () => {
        alert("Unable to create advertisement!");
        setLoading(false);
      },
    );
  };

  const handleDelete = (id: string) => {
    setLoading(true);
    deleteAdvertisement(id).then(
      () => {
        setAdvertisements(advertisements.filter((advertisement) => advertisement.id !== id));
        setLoading(false);
      },
      () => {
        alert("Unable to delete post!");
        setLoading(false);
      },
    );
  };

  return (
    <>
      <PostAdvertisementDialog open={open} onClose={handlePost} />
      <Container sx={{ my: 2 }}>
        <Stack spacing={1} sx={{ maxWidth: 500, mx: "auto" }}>
          {advertisements.map((advertisement, index) => (
            <AdvertisementItem key={index} advertisement={advertisement} onDelete={handleDelete} />
          ))}
        </Stack>
        <Fab
          color={"primary"}
          sx={{ position: "fixed", bottom: { xs: 80, sm: 30 }, right: 30 }}
          onClick={() => setOpen(true)}
        >
          <Add />
        </Fab>
      </Container>
    </>
  );
}
