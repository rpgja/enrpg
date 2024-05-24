import { NestedDropdown } from "mui-nested-menu";
import type { ReactNode } from "react";
import { useEditorStore } from "./editor-view";

export default function DisplayMenu(): ReactNode {
  const editor = useEditorStore((store) => store.editor);

  return (
    <NestedDropdown
      menuItemsData={{
        label: "表示",
        items: [
          {
            disabled: !editor,
            label: "カメラ",
            items: [
              {
                label: "位置をリセット",
                callback: () => editor?.renderer.camera.setPosition(0, 0),
              },
              {
                label: "拡大率をリセット",
                callback: () => editor?.renderer.camera.setScale(1),
              },
            ],
          },
        ],
      }}
    />
  );
}
