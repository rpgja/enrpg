import PopupWindow, { type PopupWindowProps } from "@/components/popup-window";
import SearchIcon from "@mui/icons-material/Search";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
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
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useTilePlatteWindowStore = create<TilePaletteWindowStore>(
  (set) => ({
    currentTilePaletteTab: TilePaletteTab.Mylist,
    setCurrentTilePaletteTab: (currentTilePaletteTab) =>
      set({ currentTilePaletteTab }),
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
          <TabPanel value={TilePaletteTab.Custom} sx={{ flex: 1 }}>
            <Stack spacing={2} height="100%">
              <FormControl fullWidth>
                <InputLabel>種類</InputLabel>
                <Select value="human" label="種類">
                  <MenuItem value="human">人</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField fullWidth size="small" label="スプライト番号" />
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </Stack>
              <Paper sx={{ flex: 1 }} />
            </Stack>
          </TabPanel>
        </Stack>
      </PopupWindow>
    </TabContext>
  );
}
