import type { Position } from "@/features/rpgen/types/types";

export class Selection {
  static currentId = 0;

  readonly id = Selection.currentId++;

  constructor(
    readonly start: Position,
    readonly end: Position,
  ) {}
}

export class Pointer {
  #eventController: AbortController | undefined;

  attachElement(target: HTMLElement): void {
    this.detachElement();

    target.addEventListener("pointerdown", (event) => {});
  }

  detachElement(): void {
    this.#eventController?.abort();
    this.#eventController = undefined;
  }
}
