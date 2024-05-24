import type { StillSprite } from "./sprite";
import type { Position } from "./types";

/**
 * e.g. "123", "123C"
 */
export type RawTile = string;

export type Tile = {
  sprite: StillSprite;
  position: Position;
  collision: boolean;
};
