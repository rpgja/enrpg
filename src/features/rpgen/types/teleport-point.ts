import { Position } from "./types";

export type TeleportPointDestination = {
  mapId: number,
  position: Position
};

export type TeleportPoint = {
  position: Position,
  destination: TeleportPointDestination
};
