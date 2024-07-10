import type { Command } from "@/types/command.js";
import type { Position } from "@/types/types.js";

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
  sequence: Command[];
};
