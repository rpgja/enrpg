import { ReactNode } from "react";
import { create } from "zustand";
import Dialog from "@mui/material/Dialog";

export type CreateMapDialogStore = {
  open: boolean,
  setOpen: (open: boolean) => void
};

export const useCreateMapDialogStore = create<CreateMapDialogStore>(set => ({
  open: false,
  setOpen: open => set({ open })
}));

export default function CreateMapDialog(): ReactNode {
  const { open, setOpen } = useCreateMapDialogStore();

  console.log(open)

  return (
    <Dialog
      onClose={() => setOpen(false)}
      open={open}></Dialog>
  );
}
