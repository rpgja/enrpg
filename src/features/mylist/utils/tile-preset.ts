import type { TileChipMap } from "@/features/rpgen/utils/chip";
import { Preset } from "./preset";
import type { PresetInit } from "./preset";

export type TilePresetInit = PresetInit & {
  floor?: TileChipMap;
  objects?: TileChipMap;
};

export class TilePreset extends Preset {
  floor?: TileChipMap;
  objects?: TileChipMap;

  constructor(init: TilePresetInit) {
    super(init);
    this.floor = init.floor;
    this.objects = init.objects;
  }

  static lookLike(input: string): boolean {
    return input.includes("FLOOR") || input.includes("MAP");
  }

  static parse(input: string): TilePreset {
    let floor: TileChipMap | undefined;
    let objects: TileChipMap | undefined;
    for (const [layerName, tileChipMapStr] of Preset.parseChunks(
      input,
      "\n### ",
    )) {
      switch (layerName) {
        case "FLOOR":
          floor = Preset.parseTileChipMap(tileChipMapStr);
          break;
        case "MAP":
          objects = Preset.parseTileChipMap(tileChipMapStr);
          break;
      }
    }
    return new TilePreset({ floor, objects });
  }

  static stringify(preset: TilePreset): string {
    let str = "";
    str += Preset.prefix + preset.name;
    if (preset.floor) {
      str += `\n\n### FLOOR\n${Preset.stringifyTileChipMap(preset.floor)}`;
    }
    if (preset.objects) {
      str += `\n\n### MAP\n${Preset.stringifyTileChipMap(preset.objects)}`;
    }
    return str;
  }
}
