"use client";

import { Add } from "@mui/icons-material";
import { Alert, Box, Container, Fab, Stack } from "@mui/material";
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
import { useState } from "react";

import PostItem from "@/app/(community)/_components/post-item";
import LoadingView from "@/components/loading-view";
import PostDialog, { PostDialogData } from "@/dialogs/post-dialog";
import { Post, createPost, deletePost, getPosts } from "@/lib/database";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);

  useEnhancedEffect(() => {
    getPosts().then((posts) => {
      setPosts(posts.items);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingView />;

  const handlePost = (value: PostDialogData | undefined) => {
    setOpen(false);
    if (!value) return;
    setLoading(true);
    createPost({ message: value.message, cover: value.cover }).then(
      (post) => {
        setPosts([post, ...posts]);
        setLoading(false);
      },
      () => {
        alert("Unable to create post!");
        setLoading(false);
      },
    );
  };

  const handleDelete = (id: string) => {
    setLoading(true);
    deletePost(id).then(
      () => {
        setPosts(posts.filter((post) => post.id !== id));
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
      <PostDialog open={open} onClose={handlePost} />
      <Container sx={{ my: 2 }}>
        <Box sx={{ maxWidth: 500, mx: "auto" }}>
          <Alert severity={"warning"} sx={{ marginBottom: 2 }}>
            This app is just a mock and it is not fully-featured! Please be warned that some functions may not work as
            expected.
          </Alert>
          <Stack spacing={1}>
            {posts.map((post, index) => (
              <PostItem key={index} post={post} onDelete={handleDelete} />
            ))}
          </Stack>
        </Box>
      </Container>
      <Fab
        color={"primary"}
        sx={{ position: "fixed", bottom: { xs: 80, sm: 30 }, right: 30 }}
        onClick={() => setOpen(true)}
      >
        <Add />
      </Fab>
    </>
  );
}
