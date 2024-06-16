import type { Command, RawCommand } from "./command";
import type { Position } from "./types";

export type EventPoint = {
  position: Position;
  phases: [
    PrimaryEventPhase,
    SecondaryEventPhase,
    SecondaryEventPhase,
    SecondaryEventPhase,
  ];
};

export type PrimaryEventPhase = {
  timing: EventTiming;
  sequence: Command[];
};

export enum EventTiming {
  Look = 0,
  Touch = 1,
}

export type SecondaryEventPhaseCondition = {
  gold?: number;
  switch?: number;
};

export type SecondaryEventPhase = {
  timing: EventTiming;
  condition: SecondaryEventPhaseCondition;
  sequence: RawCommand[];
};
