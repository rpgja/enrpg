export class Camera {
  x = 0;
  y = 0;
  scale = 1;
  #eventController?: AbortController;

  setX(x: number): void {
    this.x = x;
  }

  setY(y: number): void {
    this.y = y;
  }

  setPosition(x: number, y: number): void {
    this.setX(x);
    this.setY(y);
  }

  attachTo(target: HTMLElement): void {
    this.detach();

    const eventController = new AbortController();
    const { signal } = eventController;

    // TODO: add event handlers

    this.#eventController = eventController;
  }

  detach(): void {
    this.#eventController?.abort();
    this.#eventController = undefined;
  }
}
