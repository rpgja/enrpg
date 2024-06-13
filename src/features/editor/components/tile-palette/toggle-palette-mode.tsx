import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { create } from "zustand";
export const TilePaletteMode = {
  Tile: "tile",
  NPC: "npc",
} as const;

export type TilePaletteMode =
  (typeof TilePaletteMode)[keyof typeof TilePaletteMode];

export type TogglePaletteModeStore = {
  currentTilePaletteMode: TilePaletteMode;
  setCurrentTilePaletteMode: (currentTilePaletteMode: TilePaletteMode) => void;
};

export const useTogglePaletteModeStore = create<TogglePaletteModeStore>(
  (set) => ({
    currentTilePaletteMode: TilePaletteMode.Tile,
    setCurrentTilePaletteMode: (currentTilePaletteMode) =>
      set({ currentTilePaletteMode }),
  }),
);

export default function TogglePaletteMode({
  onChange,
}: { onChange?: () => void }) {
  const { currentTilePaletteMode, setCurrentTilePaletteMode } =
    useTogglePaletteModeStore();

  return (
    <FormControl fullWidth>
      <FormLabel id="demo-row-radio-buttons-group-label">種類</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        value={currentTilePaletteMode}
        onChange={(_event, value) => {
          if (value === TilePaletteMode.Tile || value === TilePaletteMode.NPC) {
            setCurrentTilePaletteMode(value);
            if (onChange) {
              onChange();
            }
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
}
