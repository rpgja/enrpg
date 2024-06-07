import PopupWindow, { type PopupWindowProps } from "@/components/popup-window";
import SearchIcon from "@mui/icons-material/Search";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import { arrayFrom, execPipe, map } from "iter-tools";
import { type ReactNode, useState } from "react";
import { create } from "zustand";

export const TilePaletteTab = {
  Mylist: "mylist",
  Custom: "custom",
  DQ: "dq",
  History: "history",
} as const;

export type TilePaletteTab =
  (typeof TilePaletteTab)[keyof typeof TilePaletteTab];

export const TilePaletteMode = {
  Tile: "tile",
  NPC: "npc",
} as const;

export type TilePaletteMode =
  (typeof TilePaletteMode)[keyof typeof TilePaletteMode];

export const iterateTilePaletteTabs = (): IterableIterator<TilePaletteTab> =>
  Object.values(TilePaletteTab).values();

export const tilePaletteTabToDisplayName = (
  tilePaletteTab: TilePaletteTab,
): string => {
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

export type TilePaletteWindowStore = {
  currentTilePaletteTab: TilePaletteTab;
  setCurrentTilePaletteTab: (currentTilePaletteTab: TilePaletteTab) => void;
  currentTilePaletteMode: TilePaletteMode;
  setCurrentTilePaletteMode: (currentTilePaletteMode: TilePaletteMode) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useTilePlatteWindowStore = create<TilePaletteWindowStore>(
  (set) => ({
    currentTilePaletteTab: TilePaletteTab.Mylist,
    setCurrentTilePaletteTab: (currentTilePaletteTab) =>
      set({ currentTilePaletteTab }),
    currentTilePaletteMode: TilePaletteMode.Tile,
    setCurrentTilePaletteMode: (currentTilePaletteMode) =>
      set({ currentTilePaletteMode }),
    open: false,
    setOpen: (open) => set({ open }),
  }),
);

export type TilePaletteWindowProps = Pick<PopupWindowProps, "onClose">;

export default function TilePaletteWindow({
  onClose,
}: TilePaletteWindowProps): ReactNode {
  const { currentTilePaletteTab, setCurrentTilePaletteTab } =
    useTilePlatteWindowStore((store) => ({
      currentTilePaletteTab: store.currentTilePaletteTab,
      setCurrentTilePaletteTab: store.setCurrentTilePaletteTab,
    }));

  const { currentTilePaletteMode, setCurrentTilePaletteMode } =
    useTilePlatteWindowStore((store) => ({
      currentTilePaletteMode: store.currentTilePaletteMode,
      setCurrentTilePaletteMode: store.setCurrentTilePaletteMode,
    }));

  const tilePaletteModeSelectableUI = (
    <FormControl fullWidth>
      <FormLabel id="demo-row-radio-buttons-group-label">種類</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        value={currentTilePaletteMode}
        onChange={(_event, value) => {
          if (value === TilePaletteMode.Tile || value === TilePaletteMode.NPC) {
            setCurrentTilePaletteMode(value);
          }
        }}
      >
        <FormControlLabel
          value={TilePaletteMode.Tile}
          control={<Radio />}
          label="タイル"
        />
        <FormControlLabel
          value={TilePaletteMode.NPC}
          control={<Radio />}
          label="NPC"
        />
      </RadioGroup>
    </FormControl>
  );

  return (
    <TabContext value={currentTilePaletteTab}>
      <PopupWindow width={800} height={600} title="編集" onClose={onClose}>
        <Stack direction="row" height="100%">
          <TabList
            orientation="vertical"
            onChange={(_event, value) => setCurrentTilePaletteTab(value)}
          >
            {execPipe(
              iterateTilePaletteTabs(),
              map((tilePaletteTab) => (
                <Tab
                  value={tilePaletteTab}
                  key={tilePaletteTab}
                  label={tilePaletteTabToDisplayName(tilePaletteTab)}
                />
              )),
              arrayFrom,
            )}
          </TabList>
          <TabPanel value={TilePaletteTab.Mylist} sx={{ flex: 1 }}>
            <Stack spacing={2} height="100%">
              {tilePaletteModeSelectableUI}
              <FormControl fullWidth>
                <InputLabel htmlFor="grouped-select">マイリスト</InputLabel>
                <Select defaultValue="" id="grouped-select" label="Grouping">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <ListSubheader>お城</ListSubheader>
                  <MenuItem value={1}>姫路城</MenuItem>
                  <MenuItem value={2}>安土城</MenuItem>
                  <MenuItem value={3}>ダークパレス</MenuItem>
                  <ListSubheader>可愛いキャラ</ListSubheader>
                  <MenuItem value={4}>動物セット</MenuItem>
                  <MenuItem value={5}>人間セット</MenuItem>
                </Select>
              </FormControl>
              <Paper sx={{ flex: 1 }} />
            </Stack>
          </TabPanel>
          <TabPanel value={TilePaletteTab.Custom} sx={{ flex: 1 }}>
            <Stack spacing={2} height="100%">
              {tilePaletteModeSelectableUI}
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField fullWidth size="small" label="スプライト番号" />
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </Stack>
              <Paper sx={{ flex: 1 }} />
            </Stack>
          </TabPanel>
          <TabPanel value={TilePaletteTab.DQ} sx={{ flex: 1 }}>
            <Stack spacing={2} height="100%">
              {tilePaletteModeSelectableUI}
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
              {tilePaletteModeSelectableUI}
              <Paper sx={{ flex: 1 }} />
              <Box>ページネーション的なやつ</Box>
            </Stack>
          </TabPanel>
        </Stack>
      </PopupWindow>
    </TabContext>
  );
}
