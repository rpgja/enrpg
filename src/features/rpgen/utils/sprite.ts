import type { DQAnimationSpriteSurface } from "../types/sprite";
import type { Direction, Position } from "../types/types";

export const ANIMATION_SPRITE_FLIP_INTERVAL = 600;

export const RPGEN_CHIP_SIZE = 16;

export const getDQAnimationSpritePosition = (
  surface: DQAnimationSpriteSurface,
  direction: Direction,
  frame = 0,
): Position => {
  const half = surface / 2;
  const ySpacing = 15 + 15 * Math.round(half) + 17 * Math.floor(half);
  const directionYOffset = direction * 32;
  const y = directionYOffset + ySpacing + 16 * 7 * surface;
  const x = 4 + (16 + 32) * frame;

  return {
    x,
    y,
  };
};
