import { StillSprite } from "./sprite";
import { Position } from "./types";

/**
 * e.g. "123", "123C"
 */
export type RawTile = string;

export type Tile = {
  sprite: StillSprite,
  position: Position,
  collision: boolean
};
