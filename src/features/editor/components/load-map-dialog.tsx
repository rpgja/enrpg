import { Editor } from "@/features/editor/utils/editor";
import { RPGMap } from "@/features/rpgen/utils/map";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { decompressFromEncodedURIComponent } from "lz-string";
import { type ReactNode, useState } from "react";
import { create } from "zustand";
import { useEditorStore } from "./editor-view";

export type LoadMapDialogStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useLoadMapDialogStore = create<LoadMapDialogStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

const COMPRESSED_PLACEHOLDER =
  "MQCQogSg8gUAzAGgOzDAOQCIxsAQgcQFkYALAFzIAcBnALgHp6B3FgOg...";

const PLACEHOLDER = `\
#HERO
3,7#END

#BGM
...
`;

export default function LoadMapDialog(): ReactNode {
  const { open, setOpen } = useLoadMapDialogStore();
  const [loadCompressed, setLoadCompressed] = useState(false);
  const loadMapText = useEditorStore((store) => store.loadMapText);
  const [disabled, setDisabled] = useState(false);
  const [mapData, setMapData] = useState("");
  const [error, setError] = useState("");

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <DialogTitle>マップを読み込む</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <FormControlLabel
            control={<Checkbox checked={loadCompressed} />}
            label="圧縮されたマップを読み込む"
            onChange={(_event, checked) => setLoadCompressed(checked)}
          />
          <TextField
            sx={{ width: "500px" }}
            helperText={error}
            error={!!error}
            onFocus={() => setError("")}
            multiline
            rows={5}
            placeholder={loadCompressed ? COMPRESSED_PLACEHOLDER : PLACEHOLDER}
            value={mapData}
            onChange={(event) => setMapData(event.currentTarget.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={disabled}
          onClick={() => {
            setDisabled(true);
            setError("");

            try {
              const actualMapData = loadCompressed
                ? decompressFromEncodedURIComponent(mapData.replace(/^L1/, ""))
                : mapData;

              loadMapText(actualMapData);
              setOpen(false);
            } catch (error) {
              setError("マップデータの読み込みに問題が発生しました");
              console.error(error);
            }

            setDisabled(false);
          }}
        >
          読み込む
        </Button>
      </DialogActions>
    </Dialog>
  );
}
