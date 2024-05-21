import { SpriteType, StillSprite } from "../types/sprite";
import { RawTile, Tile } from "../types/tile";

export class TileMap {
  static readonly #MAX_WIDTH = 300;
  static readonly #MAX_HEIGHT = 300;
  static readonly #MAX_SIZE = TileMap.#MAX_WIDTH * TileMap.#MAX_HEIGHT;

  readonly #tiles: RawTile[] = [];

  constructor() {
    while (this.#tiles.length < TileMap.#MAX_SIZE) {
      this.#tiles.push("");
    }
  }

  static #positionToIndex(x: number, y: number): number {
    return y * TileMap.#MAX_HEIGHT + x;
  }

  set(x: number, y: number, rawTile: RawTile): void {
    this.#tiles[TileMap.#positionToIndex(x, y)] = rawTile;
  }

  get(x: number, y: number): Tile {
    let rawTile = this.#tiles[TileMap.#positionToIndex(x, y)]!;
    const collision = rawTile.endsWith("C");

    // TODO: DQSprite
    if (collision) {
      rawTile = rawTile.replace(/C$/, "");
    }

    const surface = rawTile.split("_");
    let sprite: StillSprite;

    if (surface.length === 2) {
      sprite = {
        type: SpriteType.DQStillSprite,
        surface: {
          x: Number(surface[0]),
          y: Number(surface[1])
        }
      };
    } else {
      sprite = {
        type: SpriteType.CustomStillSprite,
        id: Number(rawTile)
      }
    }

    return {
      sprite,
      collision,
      position: {
        x,
        y
      }
    };
  }
}
