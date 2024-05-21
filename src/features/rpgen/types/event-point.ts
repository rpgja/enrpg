import { Command } from "./command";
import { Position } from "./types";

export type EventPoint = {
  position: Position,
  phases: [
    PrimaryEventPhase,
    SecondaryEventPhase,
    SecondaryEventPhase,
    SecondaryEventPhase
  ]
};

export type PrimaryEventPhase = {
  sequence: Command[]
};

export enum UserAction {
  Look = 0,
  Touch = 1
};

export type SecondaryEventPhaseCondition = {
  gold?: number,
  switch?: number,
  userAction: UserAction
};

export type SecondaryEventPhase = {
  condition: SecondaryEventPhaseCondition,
  sequence: Command[]
};
