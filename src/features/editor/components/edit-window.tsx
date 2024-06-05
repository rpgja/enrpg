import PopupWindow, { type PopupWindowProps } from "@/components/popup-window";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { arrayFrom, execPipe, map } from "iter-tools";
import { type ReactNode, useState } from "react";
import { create } from "zustand";

export type EditWindowStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useEditWindowStore = create<EditWindowStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

export const EditMode = {
  Mylist: "mylist",
} as const;

export type EditMode = (typeof EditMode)[keyof typeof EditMode];

export const iterateEditModes = (): IterableIterator<EditMode> =>
  Object.values(EditMode).values();

export const editModeToDisplayName = (editMode: EditMode): string => {
  switch (editMode) {
    case EditMode.Mylist:
      return "マイリスト";
  }
};

export type EditWindow = Pick<PopupWindowProps, "onClose">;

export default function EditWindow({ onClose }: EditWindow): ReactNode {
  const [editMode, setEditMode] = useState<EditMode>(EditMode.Mylist);

  return (
    <PopupWindow width={800} height={600} title="編集" onClose={onClose}>
      <Stack padding={2} spacing={2}>
        <FormControl fullWidth>
          <InputLabel>項目</InputLabel>
          <Select
            value={editMode}
            label="項目"
            onChange={(_event, value) => setEditMode(value as EditMode)}
          >
            {execPipe(
              iterateEditModes(),
              map((editMode) => (
                <MenuItem key={editMode} value={editMode}>
                  {editModeToDisplayName(editMode)}
                </MenuItem>
              )),
              arrayFrom,
            )}
          </Select>
        </FormControl>
        {editMode === EditMode.Mylist && <Box>てすと</Box>}
      </Stack>
    </PopupWindow>
  );
}
