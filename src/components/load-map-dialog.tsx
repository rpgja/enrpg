import { ReactNode, useState } from "react";
import { create } from "zustand";
import Dialog from "@mui/material/Dialog";
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { useRPGMapStore } from "./app";
import Button from "@mui/material/Button";
import { RPGMap } from "@/features/rpgen/utils/map";

export type LoadMapDialogStore = {
  open: boolean,
  setOpen: (open: boolean) => void
};

export const useLoadMapDialogStore = create<LoadMapDialogStore>(set => ({
  open: false,
  setOpen: open => set({ open })
}));

const COMPRESSED_PLACEHOLDER = "MQCQogSg8gUAzAGgOzDAOQCIxsAQgcQFkYALAFzIAcBnALgHp6B3FgOg..."

const PLACEHOLDER = `\
#HERO
3,7#END

#BGM
...
`

export default function LoadMapDialog(): ReactNode {
  const { open, setOpen } = useLoadMapDialogStore();
  const { setRPGMap } = useRPGMapStore();
  const [disabled, setDisabled] = useState(false);
  const [mapData, setMapData] = useState("");

  console.log(open)

  return (
    <Dialog
      onClose={() => setOpen(false)}
      open={open}
    >
      <DialogTitle>マップを読み込む</DialogTitle>
      <DialogContent>
        <TextField
          sx={{
            width: "500px"
          }}
          multiline
          rows={5}
          placeholder={PLACEHOLDER}
          value={mapData}
          onChange={event => setMapData(event.currentTarget.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={disabled}
          onClick={() => {
            setDisabled(true);
            setRPGMap(RPGMap.parse(mapData));
            setOpen(false);
          }}
        >
          読み込む
        </Button>
      </DialogActions>
    </Dialog>
  );
}
