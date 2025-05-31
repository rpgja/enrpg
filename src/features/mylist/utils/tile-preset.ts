import type { TileChipMap } from "@rpgja/rpgen-map";
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
    return (
      input.includes(Preset.makeHeader("FLOOR")) ||
      input.includes(Preset.makeHeader("MAP"))
    );
  }

  static parseInit(input: string): {
    floor?: TileChipMap;
    objects?: TileChipMap;
  } {
    let floor: TileChipMap | undefined;
    let objects: TileChipMap | undefined;
    for (const [layerName, tileChipMapStr] of Preset.parseChunks(input)) {
      switch (layerName) {
        case "FLOOR":
          floor = Preset.parseTileChipMap(tileChipMapStr);
          break;
        case "MAP":
          objects = Preset.parseTileChipMap(tileChipMapStr);
          break;
      }
    }
    return { floor, objects };
  }

  static stringify(preset: TilePreset): string {
    let str = "";
    str += `${Preset.prefix}${preset.name}`;
    if (preset.floor) {
      str += `\n\n${Preset.makeHeader("FLOOR")}${Preset.stringifyTileChipMap(
        preset.floor,
      )}`;
    }
    if (preset.objects) {
      str += `\n\n${Preset.makeHeader("MAP")}${Preset.stringifyTileChipMap(
        preset.objects,
      )}`;
    }
    return str;
  }
}
