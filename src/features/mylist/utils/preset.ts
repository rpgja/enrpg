import { TileChipMap } from "@rpgja/rpgen-map";
import type { RawTile } from "@rpgja/rpgen-map";

export type PresetInit = {
  name: string;
};

export class Preset {
  name: string;

  constructor(init: PresetInit) {
    this.name = init.name;
  }

  static prefix = "## ";
  static prefix2 = "### ";

  protected static makeHeader(str: string) {
    return `${Preset.prefix2}${str}\n`;
  }

  protected static *parseChunks(
    input: string,
  ): IterableIterator<[layerName: string, tileChipMapStr: string]> {
    let currentIndex = input.indexOf(Preset.prefix2);
    while (currentIndex !== -1) {
      const index = input
        .slice(currentIndex + Preset.prefix2.length)
        .indexOf(Preset.prefix2);
      let chunk: string;
      if (index === -1) {
        chunk = input.slice(currentIndex + Preset.prefix2.length);
      } else {
        chunk = input.slice(currentIndex + Preset.prefix2.length, index);
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
