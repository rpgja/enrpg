import PopupWindow from "@/components/popup-window";
import { useMounted } from "@/hooks/mount";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import { useColorScheme } from "@mui/material/styles";
import { NestedDropdown } from "mui-nested-menu";
import { type ReactNode, useMemo, useState } from "react";
import {
  RPGENGridColor,
  RPGENGridSize,
  type RendererLayers,
} from "../utils/renderer";
import { useEditorStore } from "./editor-view";

export default function DisplayMenu(): ReactNode {
  const [, setUpdater] = useState(false);
  const editor = useEditorStore((store) => store.editor);
  const mounted = useMounted();
  const { mode, setMode } = useColorScheme();
  const [layerControlOpen, setLayerControlOpen] = useState(false);
  const [layers, setLayers] = useState<RendererLayers>({
    floor: true,
    objects: true,
    humans: true,
    teleportPoints: true,
    lookPoints: true,
    eventPoints: true,
  });
  const layerControl = useMemo(
    () => (
      <Stack justifyContent="space-around" height="100%">
        {Object.entries(layers).map(([name, value]) => {
          const label = (() => {
            switch (name) {
              case "floor":
                return "地面";
              case "objects":
                return "物";
              case "humans":
                return "人";
              case "teleportPoints":
                return "マップ移動ポイント";
              case "lookPoints":
                return "しらべるポイント";
              case "eventPoints":
                return "イベントポイント";
            }
          })();

          if (!label) {
            return;
          }

          return (
            <FormControlLabel
              key={name}
              label={label}
              control={
                <Checkbox
                  checked={value}
                  onChange={(_event, checked) => {
                    editor?.renderer.setLayers({
                      [name]: checked,
                    });
                    setLayers((prev) => ({
                      ...prev,
                      [name]: checked,
                    }));
                  }}
                />
              }
            />
          );
        })}
      </Stack>
    ),
    [layers, editor?.renderer?.setLayers],
  );

  return (
    <>
      {layerControlOpen && !!editor && (
        <PopupWindow
          onClose={() => setLayerControlOpen(false)}
          title="レイヤーコントロール"
          width={350}
          height={350}
        >
          {layerControl}
        </PopupWindow>
      )}
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
            {
              disabled: !editor,
              rightIcon: editor?.renderer.renderingCollisionDetection ? (
                <CheckIcon />
              ) : undefined,
              label: "当たり判定",
              callback: () => {
                if (editor) {
                  editor.renderer.renderingCollisionDetection =
                    !editor.renderer.renderingCollisionDetection;
                }
              },
            },
            {
              disabled: !editor,
              rightIcon: layerControlOpen ? <CheckIcon /> : undefined,
              label: "レイヤーコントロールの表示",
              callback: () => setLayerControlOpen((prev) => !prev),
            },
          ],
        }}
      />
    </>
  );
}
