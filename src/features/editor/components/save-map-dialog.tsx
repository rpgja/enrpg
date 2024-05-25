import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { compressToEncodedURIComponent } from "lz-string";
import { type ReactNode, useState } from "react";
import { create } from "zustand";
import { useEditorStore } from "./editor-view";

export type SaveMapDialogStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useSaveMapDialogStore = create<SaveMapDialogStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

const saveAsTextFile = (fileText: string, fileName: string) => {
  const blob = new Blob([fileText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

export default function SaveMapDialog(): ReactNode {
  const { open, setOpen } = useSaveMapDialogStore();
  const [saveCompressed, setSaveCompressed] = useState(false);
  const editor = useEditorStore((store) => store.editor);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <DialogTitle>マップを保存する</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <FormControlLabel
            control={<Checkbox checked={saveCompressed} />}
            label="圧縮されたマップを保存する"
            onChange={(_event, checked) => setSaveCompressed(checked)}
          />
          <Typography color="error">{error}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={disabled}
          onClick={() => {
            setDisabled(true);
            setError("");

            const str = editor?.renderer.rpgMap.toString();
            if (!str) {
              setError("虚無を保存しました");
              setDisabled(false);
              return;
            }
            try {
              const fileText = saveCompressed
                ? compressToEncodedURIComponent(str)
                : str;
              saveAsTextFile(fileText, `${+new Date()}.txt`); // ToDo: ファイル名の考案
            } catch (error) {
              setError("マップデータの保存に問題が発生しました");
              console.error(error);
            }

            setDisabled(false);
          }}
        >
          保存する
        </Button>
      </DialogActions>
    </Dialog>
  );
}
