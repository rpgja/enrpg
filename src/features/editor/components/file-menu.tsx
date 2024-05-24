import { NestedDropdown } from "mui-nested-menu";
import type { ReactNode } from "react";
import { useCreateMapDialogStore } from "./create-map-dialog";
import { useEditorStore } from "./editor-view";
import { useLoadMapDialogStore } from "./load-map-dialog";

export default function FileMenu(): ReactNode {
  const setCreateMapDialogOpen = useCreateMapDialogStore(
    (store) => store.setOpen,
  );
  const setLoadMapDialogOpen = useLoadMapDialogStore((store) => store.setOpen);
  const { editor, setEditor } = useEditorStore();

  return (
    <NestedDropdown
      menuItemsData={{
        label: "ファイル",
        items: [
          {
            label: "新規作成",
            callback: () => setCreateMapDialogOpen(true),
          },
          {
            label: "マップの読み込み",
            callback: () => setLoadMapDialogOpen(true),
          },
          {
            disabled: !editor,
            label: "閉じる",
            callback: () => setEditor(undefined),
          },
        ],
      }}
    />
  );
}
