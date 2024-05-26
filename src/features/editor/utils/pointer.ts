import type { Position } from "@/features/rpgen/types/types";
import { MouseButton, isMouseDown } from "@/utils/mouse";

export class PointerSelection {
  static currentId = 0;

  readonly id = PointerSelection.currentId++;

  start: Position;
  end: Position;

  constructor(start: Position, end: Position) {
    this.start = start;
    this.end = end;
  }
}

export class Pointer {
  #eventController: AbortController | undefined;

  position?: Position;
  selecting = false;
  selection?: PointerSelection;

  attachElement(target: HTMLElement): void {
    this.detachElement();

    const eventController = new AbortController();
    const getElementPosition = (
      event: Pick<MouseEvent, "pageX" | "pageY">,
    ): [x: number, y: number] => [
      event.pageX - target.offsetLeft,
      event.pageY - target.offsetTop,
    ];

    target.addEventListener(
      "pointerdown",
      (event) => {
        const [x, y] = getElementPosition(event);
        const position: Position = { x, y };

        this.position = position;

        if (!isMouseDown(event, MouseButton.Primary)) {
          return;
        }

        if (event.getModifierState("Shift")) {
          this.position = position;
          this.selection = new PointerSelection(position, position);
          this.selecting = true;
          target.setPointerCapture(event.pointerId);
        } else {
          this.selection = undefined;
        }
      },
      {
        signal: eventController.signal,
      },
    );

    target.addEventListener(
      "pointermove",
      (event) => {
        const [x, y] = getElementPosition(event);
        const position: Position = { x, y };

        this.position = position;

        if (
          !isMouseDown(event, MouseButton.Primary) ||
          !event.getModifierState("Shift")
        ) {
          return;
        }

        if (this.selection) {
          this.selection.end = {
            x: this.position.x,
            y: this.position.y,
          };
        }
      },
      {
        signal: eventController.signal,
      },
    );

    target.addEventListener(
      "mouseup",
      (event) => {
        if (
          isMouseDown(event, MouseButton.Primary) &&
          event.getModifierState("Shift")
        ) {
          return;
        }

        if (
          this.selection &&
          this.selection.start.x === this.selection.end.x &&
          this.selection.start.y === this.selection.end.y
        ) {
          this.selection = undefined;
        }

        this.selecting = false;
      },
      {
        signal: eventController.signal,
      },
    );

    target.addEventListener(
      "pointerleave",
      () => {
        this.position = undefined;
      },
      {
        signal: eventController.signal,
      },
    );

    this.#eventController = eventController;
  }

  detachElement(): void {
    this.#eventController?.abort();
    this.#eventController = undefined;
  }
}
