import { HumanPreset } from "@/features/mylist/utils/human-preset";
import type { Mylist } from "@/features/mylist/utils/mylist";
import { TilePreset } from "@/features/mylist/utils/tile-preset";
import {
  Autocomplete,
  FormControl,
  ImageList,
  ImageListItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { create } from "zustand";
import TogglePaletteMode, {
  TilePaletteMode,
  useTogglePaletteModeStore,
} from "./toggle-palette-mode";

export type MylistStore = {
  mylists?: Mylist[];
  setMylists: (mylists: Mylist[] | undefined) => void;
};

export const useMylistStore = create<MylistStore>((set) => ({
  setMylists: (mylists) => set({ mylists }),
}));

export default function MylistPalette() {
  const { mylists } = useMylistStore();
  if (!mylists) {
    return;
  }
  const { currentTilePaletteMode } = useTogglePaletteModeStore((store) => ({
    currentTilePaletteMode: store.currentTilePaletteMode,
  }));
  const calcOptions = () =>
    mylists.flatMap((mylist) =>
      mylist.presets
        .filter((preset) => {
          if (currentTilePaletteMode === TilePaletteMode.Tile) {
            return preset instanceof TilePreset;
          }
          if (currentTilePaletteMode === TilePaletteMode.NPC) {
            return preset instanceof HumanPreset;
          }
        })
        .map((preset) => ({
          mylistName: mylist.name,
          name: preset.name,
          value: `${mylist.name}_${preset.name}`,
        })),
    );
  let options = calcOptions();
  let pallet: [] = [];

  return (
    <Stack spacing={2} height="100%">
      <TogglePaletteMode
        onChange={() => {
          options = calcOptions();
          // ToDo: 選択値リセット
        }}
      />
      <FormControl fullWidth>
        <Autocomplete
          id="grouped-demo"
          options={options}
          groupBy={(option) => option.mylistName}
          getOptionLabel={(option) => option.name}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="With categories" />
          )}
          onChange={(event, value) => {
            if (!value) {
              return;
            }
            const arr = value.value.split("_"); // ToDo: 区切り文字よくない
            if (arr.length !== 2) {
              return;
            }
            const [mylistName, presetName] = arr;
            const preset = mylists
              .find((mylist) => mylist.name === mylistName)
              ?.presets.find((preset) => preset.name === presetName);
            if (preset) {
              pallet = [];
              if (preset instanceof TilePreset) {
                // ToDo: 1
              }
              if (preset instanceof HumanPreset) {
                // ToDo: 2
              }
            }
          }}
        />
      </FormControl>
      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {pallet.map((item) => (
          <ImageListItem key={item.img}>
            <img
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Stack>
  );
}
