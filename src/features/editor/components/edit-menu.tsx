import CheckIcon from "@mui/icons-material/Check";
import { NestedDropdown } from "mui-nested-menu";
import type { ReactNode } from "react";
import EditWindow, { useEditWindowStore } from "./edit-window";
import { useEditorStore } from "./editor-view";

export default function EditMenu(): ReactNode {
  const { open, setOpen } = useEditWindowStore();
  const editor = useEditorStore((store) => store.editor);

  return (
    <>
      {!!editor && open && <EditWindow onClose={() => setOpen(false)} />}
      <NestedDropdown
        menuItemsData={{
          label: "編集",
          items: [
            {
              disabled: !editor,
              rightIcon: open ? <CheckIcon /> : undefined,
              label: "編集ウィンドウ",
              callback: () => setOpen(true),
            },
          ],
        }}
      />
    </>
  );
}
