import type { TileChipMap } from "@/features/rpgen/utils/chip";
import { Preset } from "./preset";
import type { PresetInit } from "./preset";

export type SoundPresetInit = PresetInit & {
  sounds: TileChipMap;
};

export class SoundPreset extends Preset {
  sounds: TileChipMap;

  constructor(init: SoundPresetInit) {
    super(init);
    this.sounds = init.sounds;
  }

  static lookLike(input: string): boolean {
    return input.includes("SOUND");
  }

  static parseInit(input: string): {
    sounds?: TileChipMap;
  } {
    let sounds: TileChipMap | undefined;
    for (const [layerName, tileChipMapStr] of Preset.parseChunks(
      input,
      "\n### ",
    )) {
      switch (layerName) {
        case "SOUND":
          sounds = Preset.parseTileChipMap(tileChipMapStr);
          break;
      }
    }
    return { sounds };
  }

  static stringify(preset: SoundPreset): string {
    let str = "";
    str += Preset.prefix + preset.name;
    if (preset.sounds) {
      str += `\n\n### SOUND\n${Preset.stringifyTileChipMap(preset.sounds)}`;
    }
    return str;
  }
}
