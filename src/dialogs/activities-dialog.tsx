import { Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

import activities from "@/data/activities.json";

type ActivitiesDialogProps = {
  open: boolean;
  onClose: (value: string | undefined) => void;
};

export default function ActivitiesDialog(props: ActivitiesDialogProps) {
  return (
    <Dialog open={props.open} onClose={() => props.onClose(undefined)} maxWidth={"xs"} fullWidth>
      <DialogTitle>Select An Activity</DialogTitle>
      <List sx={{ pt: 0 }}>
        {activities.map((activities) => (
          <ListItem key={activities.name} disablePadding>
            <ListItemButton onClick={() => props.onClose(activities.name)}>
              <ListItemText primary={activities.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
