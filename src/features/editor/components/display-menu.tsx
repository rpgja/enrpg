import { useMounted } from "@/hooks/mount";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import { useColorScheme } from "@mui/material/styles";
import { NestedDropdown } from "mui-nested-menu";
import { type ReactNode, useState } from "react";
import { RPGENGridColor, RPGENGridSize } from "../utils/renderer";
import { useEditorStore } from "./editor-view";

export default function DisplayMenu(): ReactNode {
  const [, setUpdater] = useState(false);
  const editor = useEditorStore((store) => store.editor);
  const mounted = useMounted();
  const { mode, setMode } = useColorScheme();

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
          {
            disabled: !editor,
            label: "RPGENグリッド",
            items: [
              {
                label: "サイズ",
                items: (
                  [
                    ["なし", undefined],
                    ["通常", RPGENGridSize.Medium],
                    ["大きい", RPGENGridSize.Large],
                    ["最大", RPGENGridSize.Largest],
                  ] as const
                ).map(([label, value]) => ({
                  label,
                  rightIcon:
                    editor?.renderer.rpgenGridSize === value ? (
                      <CheckIcon />
                    ) : undefined,
                  callback: () => {
                    editor?.renderer.setRPGENGridSize(value);
                    setUpdater((prev) => !prev);
                  },
                })),
              },
              {
                label: "色",
                items: (
                  [
                    ["ゲーミング", RPGENGridColor.Gaming],
                    ["反転", RPGENGridColor.Invert],
                  ] as const
                ).map(([label, value]) => ({
                  label,
                  rightIcon:
                    editor?.renderer.rpgenGridColor === value ? (
                      value === RPGENGridColor.Gaming ? (
                        <StarIcon />
                      ) : (
                        <CheckIcon />
                      )
                    ) : undefined,
                  callback: () => {
                    editor?.renderer.setRPGENGridColor(value);
                    setUpdater((prev) => !prev);
                  },
                })),
              },
            ],
          },
          {
            disabled: !mounted,
            label: "カラーテーマ",
            items: (
              [
                ["ライト", "light"],
                ["ダーク", "dark"],
                ["システムと同期", "system"],
              ] as const
            ).map(([label, value]) => ({
              label,
              rightIcon: value === mode ? <CheckIcon /> : undefined,
              callback: () => setMode(value),
            })),
          },
        ],
      }}
    />
  );
}
