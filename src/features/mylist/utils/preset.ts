import type { RawTile } from "@/features/rpgen/types/tile";
import type { TileChipMap } from "@/features/rpgen/utils/chip";

export type PresetInit = {
  name: string;
  floor?: TileChipMap;
  objects?: TileChipMap;
};

export class Preset {
  name: string;
  floor?: TileChipMap;
  objects?: TileChipMap;

  constructor(init: PresetInit) {
    this.name = init.name;
    this.floor = init.floor;
    this.objects = init.objects;
  }

  static #serializeTileChipMap(tileChipMap: TileChipMap): string {
    const { width, height } = tileChipMap.getSize();

    const rows = [];
    let longest = 0;

    for (let y = 0; y < height; y++) {
      const columns: RawTile[] = [];

      for (let x = 0; x < width; x++) {
        const rawTile = tileChipMap.getRaw(x, y) ?? "";

        if (rawTile.length > longest) {
          longest = rawTile.length;
        }

        columns.push(rawTile);
      }

      rows.push(columns);
    }

    let serialized = "";

    for (const [y, row] of rows.entries()) {
      if (y > 0) {
        serialized += "\n";
      }

      for (const [x, rawTile] of row.entries()) {
        if (x > 0) {
          serialized += ", ";
        }

        serialized += rawTile.padStart(longest, " ");
      }
    }

    return serialized;
  }

  serialize(): string {
    let serialized = "";

    serialized += `## ${this.name}`;

    if (this.floor) {
      serialized += `\n\n### floor\n${Preset.#serializeTileChipMap(
        this.floor,
      )}`;
    }

    if (this.objects) {
      serialized += `\n\n### objects\n${Preset.#serializeTileChipMap(
        this.objects,
      )}`;
    }

    return serialized;
  }

  static deserialize(): Preset {}
}
