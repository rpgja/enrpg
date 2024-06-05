import type { TileChipMap } from "@/features/rpgen/utils/chip";
import { Preset } from "./preset";
import type { PresetInit } from "./preset";

export type HumanPresetInit = PresetInit & {
  humans: TileChipMap;
};

export class HumanPreset extends Preset {
  humans: TileChipMap;

  constructor(init: HumanPresetInit) {
    super(init);
    this.humans = init.humans;
  }

  static lookLike(input: string): boolean {
    return input.includes("HUMAN");
  }

  static parseInit(input: string): {
    humans?: TileChipMap;
  } {
    let humans: TileChipMap | undefined;
    for (const [layerName, tileChipMapStr] of Preset.parseChunks(
      input,
      "\n### ",
    )) {
      switch (layerName) {
        case "HUMAN":
          humans = Preset.parseTileChipMap(tileChipMapStr);
          break;
      }
    }
    return { humans };
  }

  static stringify(preset: HumanPreset): string {
    let str = "";
    str += Preset.prefix + preset.name;
    if (preset.humans) {
      str += `\n\n### HUMAN\n${Preset.stringifyTileChipMap(preset.humans)}`;
    }
    return str;
  }
}
