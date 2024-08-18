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
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import bresenham from "bresenham/generator";
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

/* レイヤ定義 */

export const TilePaletteLayer = {
  Floor: "floor",
  Objects: "objects",
} as const;

export type TilePaletteLayer =
  (typeof TilePaletteLayer)[keyof typeof TilePaletteLayer];

/* ウィンドウ定義 */

export type EditWindowStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeTab: TilePaletteTab;
  setActiveTab: (activeTab: TilePaletteTab) => void;
  activeLayer: TilePaletteLayer;
  setActiveLayer: (activeLayer: TilePaletteLayer) => void;
};

export const useEditWindowStore = create<EditWindowStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  activeTab: TilePaletteTab.Mylist,
  setActiveTab: (activeTab) => set({ activeTab }),
  activeLayer: TilePaletteLayer.Floor,
  setActiveLayer: (activeLayer) => set({ activeLayer }),
}));

export default function EditWindow(): ReactNode {
  const { open, setOpen } = useEditWindowStore();
  const { activeTab, setActiveTab, activeLayer, setActiveLayer } =
    useEditWindowStore((store) => ({
      activeTab: store.activeTab,
      setActiveTab: store.setActiveTab,
      activeLayer: store.activeLayer,
      setActiveLayer: store.setActiveLayer,
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

      if (activeLayer === TilePaletteLayer.Floor) {
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
      } else if (activeLayer === TilePaletteLayer.Objects) {
        editor.putObjectTile({
          position: { x: tileX, y: tileY },
          collision,
          sprite,
        });

        if (prevX !== undefined && prevY !== undefined) {
          const line = bresenham(prevX, prevY, tileX, tileY);

          for (const p of line) {
            editor.putObjectTile({
              position: { x: p.x, y: p.y },
              collision,
              sprite,
            });
          }
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
  }, [editor, collision, activeLayer, sprite]);

  const MylistPalette = () => <Paper />; // TODO：別のブランチで実装

  /* 当たり判定のチェックボックス */

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

  /* レイヤのラジオボタン */

  const RadioActiveLayer = () => (
    <FormControl fullWidth>
      <FormLabel id="demo-row-radio-buttons-group-label">レイヤ</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        value={activeLayer}
        onChange={(_, value) => {
          if (
            value === TilePaletteLayer.Floor ||
            value === TilePaletteLayer.Objects
          ) {
            setActiveLayer(value);
          }
        }}
      >
        <FormControlLabel
          value={TilePaletteLayer.Floor}
          control={<Radio />}
          label="地面"
        />
        <FormControlLabel
          value={TilePaletteLayer.Objects}
          control={<Radio />}
          label="物"
        />
      </RadioGroup>
    </FormControl>
  );

  /* スプライトのプレビュー */
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
              <Tab value={TilePaletteTab.Mylist} label="マイリスト" />
              <Tab value={TilePaletteTab.Custom} label="カスタム素材" />
              <Tab value={TilePaletteTab.DQ} label="標準素材" />
              <Tab value={TilePaletteTab.History} label="履歴" />
            </TabList>
            <TabPanel value={TilePaletteTab.Mylist} sx={{ flex: 1 }}>
              <Stack spacing={2} height="100%">
                <ToggleCollision />
                <RadioActiveLayer />
                <MylistPalette />
                <Paper sx={{ flex: 1 }} />
              </Stack>
            </TabPanel>
            <TabPanel value={TilePaletteTab.Custom} sx={{ flex: 1 }}>
              <Stack spacing={2} height="100%">
                <ToggleCollision />
                <RadioActiveLayer />
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
                <RadioActiveLayer />
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
                <RadioActiveLayer />
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
