import { BackHand, Chat, Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
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
import { Advertisement, getFileUrl } from "@/lib/database";

type AdvertisementItemProps = {
  advertisement: Advertisement;
  onDelete: (id: string) => void;
};

export default function AdvertisementItem(props: AdvertisementItemProps) {
  const { user } = useApp();
  const [anchor, setAnchor] = useState<HTMLElement | undefined>();

  const handleTodo = () => alert("This feature is not implemented yet!");

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            src={
              props.advertisement.expand.author.avatar &&
              getFileUrl(props.advertisement.expand.author, props.advertisement.expand.author.avatar)
            }
          />
        }
        title={props.advertisement.expand.author.name}
        subheader={props.advertisement.created.toString()}
        action={
          props.advertisement.author === user?.id && (
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
                <MenuItem onClick={() => props.onDelete(props.advertisement.id)}>
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
      <CardContent>
        <Typography variant={"h6"}>{props.advertisement.title}</Typography>
        <Typography color={"text.secondary"}>{props.advertisement.description}</Typography>
      </CardContent>
      <CardActions>
        <Tooltip title={"Join"}>
          <IconButton onClick={handleTodo}>
            <BackHand />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Comment"}>
          <IconButton onClick={handleTodo}>
            <Chat />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
