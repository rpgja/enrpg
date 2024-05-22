import { DQAnimationSpriteSurface } from "../types/sprite";
import { Direction, Position } from "../types/types";

export const getDQAnimationSpritePosition = (surface: DQAnimationSpriteSurface, direction: Direction, frame = 0): Position => {
  const half = surface / 2;
  const ySpacing = 15 + 15 * Math.round(half) + 17 * Math.floor(half);
  const directionYOffset = direction * 32;
  const y = directionYOffset + ySpacing + (16 * 7) * surface;
  const x = 4 + (16 + 32) * frame;

  return {
    x,
    y
  }
};
