import type { RawTile } from "@/features/rpgen/types/tile";
import { TileChipMap } from "@/features/rpgen/utils/chip";

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

  static deserialize(input: string): Preset {
    const index = input.indexOf("\n");
    const name = input.slice("## ".length, index);
    let floor: TileChipMap | undefined;
    let objects: TileChipMap | undefined;
    for (const [layerName, tileChipMapStr] of Preset.#parseChunks(
      input.slice(index + 1),
      "\n### ",
    )) {
      switch (layerName) {
        case "floor":
          floor = Preset.#parseTileChipMap(tileChipMapStr);
          break;
        case "objects":
          objects = Preset.#parseTileChipMap(tileChipMapStr);
          break;
        default:
          break;
      }
    }
    return new Preset({ name, floor, objects });
  }

  static *#parseChunks(
    input: string,
    termination: string,
  ): IterableIterator<[layerName: string, tileChipMapStr: string]> {
    let currentIndex = input.indexOf(termination);
    while (currentIndex !== -1) {
      const index = input
        .slice(currentIndex + termination.length)
        .indexOf(termination);
      let chunk: string;
      if (index === -1) {
        chunk = input.slice(currentIndex + termination.length);
      } else {
        chunk = input.slice(currentIndex + termination.length, index);
      }
      const index2 = chunk.indexOf("\n");
      if (index2 !== -1) {
        yield [chunk.slice(0, index2), chunk.slice(index2 + 1)];
      }
      currentIndex = index;
    }
  }

  static #parseTileChipMap(input: string) {
    const tileChipMap = new TileChipMap();
    for (const [y, row] of input.split("\n").entries()) {
      for (const [x, field] of row.split(",").entries()) {
        tileChipMap.set(x, y, field.trim());
      }
    }
    return tileChipMap;
  }
}
