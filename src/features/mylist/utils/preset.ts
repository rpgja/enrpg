import type { RawTile } from "@/features/rpgen/types/tile";
import { TileChipMap } from "@/features/rpgen/utils/chip";

export type PresetInit = {
  name?: string;
};

export class Preset {
  name?: string;

  constructor(init: PresetInit) {
    this.name = init.name;
  }

  static prefix = "## ";

  protected static *parseChunks(
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

  protected static parseTileChipMap(input: string) {
    const tileChipMap = new TileChipMap();
    for (const [y, row] of input.split("\n").entries()) {
      for (const [x, field] of row.split(",").entries()) {
        tileChipMap.set(x, y, field.trim());
      }
    }
    return tileChipMap;
  }

  protected static stringifyTileChipMap(tileChipMap: TileChipMap): string {
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

    let str = "";

    for (const [y, row] of rows.entries()) {
      if (y > 0) {
        str += "\n";
      }
      for (const [x, rawTile] of row.entries()) {
        if (x > 0) {
          str += ", ";
        }

        str += rawTile.padStart(longest, " ");
      }
    }
    return str;
  }
}
