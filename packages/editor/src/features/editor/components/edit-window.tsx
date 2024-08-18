import PopupWindow from "@/components/popup-window";
import { loadImage } from "@/utils/image";
import { logger } from "@/utils/logger";
import SearchIcon from "@mui/icons-material/Search";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import bresenham from "bresenham/generator";
import { arrayFrom, execPipe, map } from "iter-tools";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { SpriteType, type StillSprite } from "rpgen-map";
import { create } from "zustand";
import { useEditorStore } from "./editor-view";

/* タブ定義 */

export const TilePaletteTab = {
  Mylist: "mylist",
  Custom: "custom",
  DQ: "dq",
  History: "history",
} as const;

export type TilePaletteTab =
  (typeof TilePaletteTab)[keyof typeof TilePaletteTab];

export const iterate = (): IterableIterator<TilePaletteTab> =>
  Object.values(TilePaletteTab).values();

export const toDisplayName = (tilePaletteTab: TilePaletteTab): string => {
  switch (tilePaletteTab) {
    case TilePaletteTab.Mylist:
      return "マイリスト";
    case TilePaletteTab.Custom:
      return "カスタム素材";
    case TilePaletteTab.DQ:
      return "標準素材";
    case TilePaletteTab.History:
      return "履歴";
  }
};

/* 当たり判定 */

/* ウィンドウ定義 */

export type EditWindowStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeTab: TilePaletteTab;
  setActiveTab: (activeTab: TilePaletteTab) => void;
};

export const useEditWindowStore = create<EditWindowStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  activeTab: TilePaletteTab.Mylist,
  setActiveTab: (activeTab) => set({ activeTab }),
}));

export default function EditWindow(): ReactNode {
  const { open, setOpen } = useEditWindowStore();
  const { activeTab, setActiveTab } = useEditWindowStore((store) => ({
    activeTab: store.activeTab,
    setActiveTab: store.setActiveTab,
  }));
  const [id, setId] = useState("");
  const [collision, setCollision] = useState(false);
  const [helperText, setHelperText] = useState("");
  const { editor, sprites, setSprites } = useEditorStore();
  const [sprite, setSprite] = useState<StillSprite>();

  useEffect(() => {
    if (!editor) {
      return;
    }

    let writing = false;
    let prevX: number | undefined;
    let prevY: number | undefined;

    const offMouseDown = editor.onMouseDown((tileX, tileY) => {
      writing = true;
      prevX = tileX;
      prevY = tileY;
    });

    const offMouseMove = editor.onMouseMove((tileX, tileY) => {
      if (!sprite || !writing) {
        return;
      }

      console.log(sprite);

      editor.putFloorTile({
        position: { x: tileX, y: tileY },
        collision,
        sprite,
      });

      if (prevX !== undefined && prevY !== undefined) {
        const line = bresenham(prevX, prevY, tileX, tileY);

        for (const p of line) {
          editor.putFloorTile({
            position: { x: p.x, y: p.y },
            collision,
            sprite,
          });
        }
      }

      prevX = tileX;
      prevY = tileY;
    });

    const offMouseUp = editor.onMouseUp(() => {
      writing = false;
      prevX = prevY = undefined;
    });

    return () => {
      offMouseDown();
      offMouseMove();
      offMouseUp();
    };
  }, [editor, collision, sprite]);

  const MylistPalette = () => <Paper />; // TODO：別のブランチで実装
  const ToggleCollision = () => (
    <FormControlLabel
      control={
        <Checkbox
          checked={collision}
          onChange={(_, checked) => setCollision(checked)}
        />
      }
      label="当たり判定"
    />
  );
  const tilePreviewRef = useRef<HTMLImageElement>(null);

  return (
    open && (
      <TabContext value={activeTab}>
        <PopupWindow
          width={800}
          height={600}
          title="編集"
          onClose={() => setOpen(false)}
        >
          <Stack direction="row" height="100%">
            <TabList
              orientation="vertical"
              onChange={(_event, value) => setActiveTab(value)}
            >
              {execPipe(
                iterate(),
                map((tilePaletteTab) => (
                  <Tab
                    value={tilePaletteTab}
                    key={tilePaletteTab}
                    label={toDisplayName(tilePaletteTab)}
                  />
                )),
                arrayFrom,
              )}
            </TabList>
            <TabPanel value={TilePaletteTab.Mylist} sx={{ flex: 1 }}>
              <Stack spacing={2} height="100%">
                <ToggleCollision />
                <MylistPalette />
                <Paper sx={{ flex: 1 }} />
              </Stack>
            </TabPanel>
            <TabPanel value={TilePaletteTab.Custom} sx={{ flex: 1 }}>
              <Stack spacing={2} height="100%">
                <ToggleCollision />
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    fullWidth
                    error={!!helperText}
                    helperText={helperText || " "}
                    size="small"
                    sx={{ flex: 1 }}
                    label="タイル素材のID"
                    value={id}
                    onChange={(event) => setId(event.currentTarget.value)}
                  />
                  <IconButton
                    onClick={async () => {
                      const actualId = Number.parseInt(id.trim(), 10);

                      if (
                        !Number.isFinite(actualId) ||
                        Number.isNaN(actualId)
                      ) {
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

                      setHelperText("");
                      if (tilePreviewRef.current) {
                        tilePreviewRef.current.innerHTML = "";
                        tilePreviewRef.current.append(image);
                      }

                      setSprite({
                        type: SpriteType.CustomStillSprite,
                        id: actualId,
                      });

                      //setSprites((prev) => [...prev, image]);
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </Stack>
                <Paper
                  ref={tilePreviewRef}
                  style={{
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  {/* 画像がここに挿入されます */}
                </Paper>
                <Paper sx={{ flex: 1 }} />
              </Stack>
            </TabPanel>
            <TabPanel value={TilePaletteTab.DQ} sx={{ flex: 1 }}>
              <Stack spacing={2} height="100%">
                <ToggleCollision />
                <FormControl fullWidth>
                  <InputLabel>初期素材</InputLabel>
                  <Select value="human" label="種類">
                    <MenuItem value="human">地面（歩ける）</MenuItem>
                    <MenuItem value="any">地面（歩けない）</MenuItem>
                    <MenuItem value="any">物（ぶつかる）</MenuItem>
                    <MenuItem value="any">物（ぶつからない）</MenuItem>
                    <MenuItem value="any">-----------</MenuItem>
                    <MenuItem value="any">階段</MenuItem>
                    <MenuItem value="any">建物</MenuItem>
                    <MenuItem value="any">マップ移動ポイント</MenuItem>
                    <MenuItem value="any">扉</MenuItem>
                    <MenuItem value="any">宝箱</MenuItem>
                    <MenuItem value="any">しらべるポイント</MenuItem>
                    <MenuItem value="any">-----------</MenuItem>
                    <MenuItem value="any">イベントポイント</MenuItem>
                    <MenuItem value="any">-----------</MenuItem>
                    <MenuItem value="any">掲示板/本/ネット</MenuItem>
                  </Select>
                </FormControl>
                <Paper sx={{ flex: 1 }} />
              </Stack>
            </TabPanel>
            <TabPanel value={TilePaletteTab.History} sx={{ flex: 1 }}>
              <Stack spacing={2} height="100%">
                <ToggleCollision />
                <Paper sx={{ flex: 1 }} />
                <Box>ページネーション的なやつ</Box>
              </Stack>
            </TabPanel>
          </Stack>
        </PopupWindow>
      </TabContext>
    )
  );
}
