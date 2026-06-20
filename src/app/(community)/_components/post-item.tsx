import { Chat, Delete, Edit, Favorite, MoreVert, Share } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useApp } from "@/components/app-context";
import { Post, getFileUrl } from "@/lib/database";

type PostItemProps = {
  post: Post;
  onDelete: (id: string) => void;
};

export default function PostItem(props: PostItemProps) {
  const { user } = useApp();
  const [anchor, setAnchor] = useState<HTMLElement | undefined>();

  const handleTodo = () => alert("This feature is not implemented yet!");

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            src={
              props.post.expand.author.avatar && getFileUrl(props.post.expand.author, props.post.expand.author.avatar)
            }
          />
        }
        title={props.post.expand.author.name}
        subheader={props.post.created.toString()}
        action={
          props.post.author === user?.id && (
            <>
              <IconButton onClick={(event) => setAnchor(event.currentTarget)}>
                <MoreVert />
              </IconButton>
              <Menu open={anchor !== undefined} anchorEl={anchor} onClose={() => setAnchor(undefined)}>
                <MenuItem onClick={handleTodo}>
                  <ListItemIcon>
                    <Edit />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => props.onDelete(props.post.id)}>
                  <ListItemIcon>
                    <Delete />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )
        }
      />
      {props.post.cover && <CardMedia component={"img"} src={getFileUrl(props.post, props.post.cover)} />}
      <CardContent>
        <Typography>{props.post.message}</Typography>
      </CardContent>
      <CardActions>
        <Tooltip title={"Like"}>
          <IconButton onClick={handleTodo}>
            <Favorite />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Comment"}>
          <IconButton onClick={handleTodo}>
            <Chat />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Share"}>
          <IconButton onClick={handleTodo}>
            <Share />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
