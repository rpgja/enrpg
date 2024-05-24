export class Camera {
  x = 0;
  y = 0;
  scale = 1;

  #eventController: AbortController | undefined;

  constructor(readonly scaleUnit: number) {}

  setX(x: number): void {
    this.x = x;
  }

  setY(y: number): void {
    this.y = y;
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  setScale(scale: number): void {
    this.scale = scale;
  }

  attachElement(
    target: HTMLElement,
    cameraSpeed = 15,
    maxCameraSpeedScale = 5,
  ): void {
    this.detachElement();

    const eventController = new AbortController();

    target.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    let movingCamera = false;

    target.addEventListener(
      "pointerdown",
      (event) => {
        if (event.button !== 2) {
          return;
        }

        movingCamera = true;
        target.setPointerCapture(event.pointerId);
      },
      {
        signal: eventController.signal,
      },
    );

    target.addEventListener(
      "pointermove",
      (event) => {
        if (!movingCamera) {
          return;
        }

        this.x -= event.movementX;
        this.y -= event.movementY;
      },
      {
        signal: eventController.signal,
      },
    );

    target.addEventListener(
      "pointerup",
      () => {
        if (!movingCamera) {
          return;
        }

        movingCamera = false;
      },
      {
        signal: eventController.signal,
      },
    );

    target.tabIndex = 1;

    let cameraSpeedScale = 1;

    target.addEventListener("keyup", () => {
      cameraSpeedScale = 1;
    });

    target.addEventListener(
      "keydown",
      (event) => {
        if (event.repeat && cameraSpeedScale < maxCameraSpeedScale) {
          cameraSpeedScale += 0.01;

          if (cameraSpeedScale > maxCameraSpeedScale) {
            cameraSpeedScale = maxCameraSpeedScale;
          }
        }

        switch (event.code) {
          case "KeyW":
          case "ArrowUp": {
            this.y -= (cameraSpeed * cameraSpeedScale) | 0;

            break;
          }

          case "KeyS":
          case "ArrowDown": {
            this.y += (cameraSpeed * cameraSpeedScale) | 0;

            break;
          }

          case "KeyA":
          case "ArrowLeft": {
            this.x -= (cameraSpeed * cameraSpeedScale) | 0;

            break;
          }

          case "KeyD":
          case "ArrowRight": {
            this.x += (cameraSpeed * cameraSpeedScale) | 0;

            break;
          }
        }
      },
      {
        signal: eventController.signal,
      },
    );

    target.addEventListener(
      "wheel",
      (event) => {
        const scaleUnit = this.scaleUnit;

        const newScale =
          event.deltaY > 0
            ? Math.max(scaleUnit, this.scale - scaleUnit)
            : this.scale + scaleUnit;

        if (newScale > this.scaleUnit) {
          this.scale = newScale;
        }
      },
      {
        signal: eventController.signal,
      },
    );

    this.#eventController = eventController;
  }

  detachElement() {
    this.#eventController?.abort();
    this.#eventController = undefined;
  }
}
