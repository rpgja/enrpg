import { mapGetOrInit } from "@/utils/collections";
import { LookPoint } from "../types/look-point";
import { Human, HumanBehavior } from "../types/human";
import { Direction } from "../types/types";
import { DQAnimationSpriteSurface, Sprite, SpriteType, DQStillSprite } from "../types/sprite";
import { TreasureBoxPoint } from "../types/treasure-box-point";
import { TileMap } from "./tile";

type RPGMapChunks = Map<string, string[]>;

export type RPGMapInit = {
  lookPoints?: LookPoint[],
  humans?: Human[],
  treasureBoxPoints?: TreasureBoxPoint[],
  floor: TileMap,
  objects: TileMap
};

export class RPGMap {
  readonly lookPoints: LookPoint[];
  readonly humans: Human[];
  readonly treasureBoxPoints: TreasureBoxPoint[];
  readonly objects: TileMap;
  readonly floor: TileMap;

  constructor(init: RPGMapInit) {
    this.lookPoints = init.lookPoints ?? [];
    this.humans = init.humans ?? [];
    this.treasureBoxPoints = init.treasureBoxPoints ?? [];
    this.objects = init.objects;
    this.floor = init.floor;
  }

  static #parseChunks(input: string): RPGMapChunks {
    const inputLength = input.length;
    const chunks: RPGMapChunks = new Map();
    const readToken = (position: number, condition: (ch: string, position: number) => boolean): string => {
      let token = "";

      while (condition(input[position]!, position) && position < inputLength) {
        token += input[position++]!;
      }

      return token;
    };

    for (let position = 0; position < inputLength; position++) {
      // skip whitespaces
      position += readToken(position, ch => /\s/.test(ch)).length;

      if (input[position] !== "#") {
        continue;
      }

      // skip "#"
      position++;

      const chunkName = readToken(position, ch => /\S/.test(ch));

      position += chunkName.length;

      const value = readToken(position, (ch, position) => {
        if (ch !== "#") {
          return true;
        }

        return input.slice(position, position + 4) !== "#END";
      });

      position += value.length;

      const values = mapGetOrInit(chunks, chunkName, []);

      values.push(value.trim());
    }

    return chunks;
  }

  static #parseLookPoints(chunks: RPGMapChunks): LookPoint[] | undefined {
    return chunks.get("SPOINT")?.map(v => {
      const [x, y, once, message = ""] = v.split(",");

      return {
        position: {
          x: Number(x),
          y: Number(y)
        },
        message,
        once: once === "1"
      }
    })
  }

  static #parseHumans(chunks: RPGMapChunks): Human[] | undefined {
    return chunks.get("HUMAN")?.map(v => {
      const [rawSprite, x, y, direction, behavior, speed, message = ""] = v.split(",");
      let sprite: Sprite;

      switch (rawSprite?.[0]) {
        case "A": {
          sprite = {
            type: SpriteType.CustomAnimationSprite,
            id: Number(rawSprite)
          }

          break;
        }

        case "-": {
          sprite = {
            type: SpriteType.CustomStillSprite,
            id: Number(rawSprite)
          }

          break;
        }

        default: {
          sprite = {
            type: SpriteType.DQAnimationSprite,
            surface: Number(rawSprite) as DQAnimationSpriteSurface
          };

          break;
        }
      }

      return {
        sprite,
        message,
        position: {
          x: Number(x),
          y: Number(y)
        },
        direction: Number(direction) as Direction,
        behavior: Number(behavior) as HumanBehavior,
        speed: Number(speed)
      }
    })
  }

  static #parseTreasureBoxPoints(chunks: RPGMapChunks): TreasureBoxPoint[] | undefined {
    return chunks.get("TBOX")?.map(v => {
      const [x, y, message = ""] = v.split(",");

      return {
        position: {
          x: Number(x),
          y: Number(y),
        },
        message
      };
    })
  }

  static #parseTileMap(chunks: RPGMapChunks, chunkName: string): TileMap {
    const lines = chunks.get(chunkName)?.[0]?.split(/\r?\n/);
    const tileMap = new TileMap();

    if (lines) {
      for (const [y, line] of lines.entries()) {
        for (const [x, rawTile] of line.split(" ").entries()) {
          tileMap.set(x, y, rawTile);
        }
      }
    }

    return tileMap;
  }

  static parse(input: string): RPGMap {
    const chunks = RPGMap.#parseChunks(input);
    const lookPoints = RPGMap.#parseLookPoints(chunks);
    const humans = RPGMap.#parseHumans(chunks);
    const treasureBoxPoints = RPGMap.#parseTreasureBoxPoints(chunks);
    const objects = RPGMap.#parseTileMap(chunks, "MAP");
    const floor = RPGMap.#parseTileMap(chunks, "FLOOR");

    return new RPGMap({
      humans,
      lookPoints,
      treasureBoxPoints,
      objects,
      floor
    });
  }
}
