import CheckIcon from "@mui/icons-material/Check";
import { NestedDropdown } from "mui-nested-menu";
import type { ReactNode } from "react";
import { useEditorStore } from "./editor-view";
import TilePaletteWindow, {
  useTilePlatteWindowStore,
} from "./tile-palette/tile-palette-window";

export default function EditMenu(): ReactNode {
  const { open, setOpen } = useTilePlatteWindowStore();
  const editor = useEditorStore((store) => store.editor);

  return (
    <>
      {!!editor && open && <TilePaletteWindow onClose={() => setOpen(false)} />}
      <NestedDropdown
        menuItemsData={{
          label: "編集",
          items: [
            {
              disabled: !editor,
              rightIcon: open ? <CheckIcon /> : undefined,
              label: "タイルパレット",
              callback: () => setOpen(true),
            },
          ],
        }}
      />
    </>
  );
}
