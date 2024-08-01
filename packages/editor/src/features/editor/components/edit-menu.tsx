import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import { NestedDropdown } from "mui-nested-menu";
import type { ReactNode } from "react";
import EditWindow, { useEditWindowStore } from "./edit-window";
import { useEditorStore } from "./editor-view";

export default function EditMenu(): ReactNode {
  const { open, setOpen } = useEditWindowStore();
  const editor = useEditorStore((store) => store.editor);

  console.log(editor);

  return (
    <>
      <EditWindow />
      <NestedDropdown
        menuItemsData={{
          label: "編集",
          items: [
            {
              disabled: !editor,
              label: "編集ウィンドウ",
              rightIcon: open ? <CheckIcon /> : undefined,
              callback: () => setOpen(!open),
            },
          ],
        }}
      />
    </>
  );
}
