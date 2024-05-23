import { HumanSprite, Sprite } from "./sprite";
import { Direction, Position } from "./types";

export enum HumanBehavior {
  Still = 0,
  RandomMove = 1,
  RandomDirection = 2,
  RandomMoveHorizontal = 3,
  RandomMoveVertical = 4,
  GoNear = 5,
  RunAway = 6
}

export type Human = {
  sprite: HumanSprite,
  position: Position,
  direction: Direction,
  behavior: HumanBehavior,
  speed: number,
  message: string
};
