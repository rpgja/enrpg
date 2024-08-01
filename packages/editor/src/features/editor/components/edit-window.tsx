import PopupWindow from "@/components/popup-window";
import { useEffectOnce } from "@/hooks/once";
import { loadImage } from "@/utils/image";
import { logger } from "@/utils/logger";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { type ReactNode, useEffect, useState } from "react";
import { type Sprite, SpriteType, type StillSprite } from "rpgen-map";
import { create } from "zustand";
import { useEditorStore } from "./editor-view";

export type EditWindowStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useEditWindowStore = create<EditWindowStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

export default function EditWindow(): ReactNode {
  const { open, setOpen } = useEditWindowStore();
  const [id, setId] = useState("");
  const [collision, setCollision] = useState(false);
  const [helperText, setHelperText] = useState("");
  const { editor, sprites, setSprites } = useEditorStore();
  const [sprite, setSprite] = useState<StillSprite>();

  useEffect(() => {
    if (!editor) {
      return;
    }

    const off = editor.onMouseDown((tileX, tileY) => {
      if (!sprite) {
        return;
      }

      console.log(sprite);

      editor.putFloorTile({
        position: { x: tileX, y: tileY },
        collision,
        sprite,
      });
    });

    return () => {
      off();
    };
  }, [editor, collision, sprite]);

  return (
    open && (
      <PopupWindow
        width={800}
        height={600}
        title="編集"
        onClose={() => setOpen(false)}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={collision}
              onChange={(_, checked) => setCollision(checked)}
            />
          }
          label="当たり判定"
        />
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <TextField
            error={!!helperText}
            helperText={helperText || " "}
            size="small"
            sx={{ flex: 1 }}
            label="タイル素材のID"
            value={id}
            onChange={(event) => setId(event.currentTarget.value)}
          />
          <Button
            onClick={async () => {
              const actualId = Number.parseInt(id.trim(), 10);

              if (!Number.isFinite(actualId) || Number.isNaN(actualId)) {
                setHelperText("IDを数値としてパースできません");

                return;
              }

              let image: HTMLImageElement;

              try {
                image = await loadImage(
                  `https://rpgen.site/dq/sprites/${encodeURIComponent(
                    actualId.toString(),
                  )}/sprite.png`,
                );
              } catch (err) {
                setHelperText("スプライト画像の取得に失敗しました");
                logger.error(err);

                return;
              }

              setSprite({
                type: SpriteType.CustomStillSprite,
                id: actualId,
              });

              //setSprites((prev) => [...prev, image]);
            }}
          >
            読み込む
          </Button>
        </Stack>
      </PopupWindow>
    )
  );
}
