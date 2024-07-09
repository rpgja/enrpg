import { MouseButton, isMouseDown } from "@/utils/mouse";

export class Camera {
  x = 0;
  y = 0;
  scale = 1;
  zoomRate = 1.07;

  #eventController: AbortController | undefined;

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

  setZoomRate(zoomRate: number): void {
    this.zoomRate = zoomRate;
  }

  setScale(scale: number, mouseX: number, mouseY: number): void {
    const oldScale = this.scale;
    const newScale = scale;

    const gameX = (this.x + mouseX) / oldScale;
    const gameY = (this.y + mouseY) / oldScale;
    const x = Math.round(gameX * newScale - mouseX);
    const y = Math.round(gameY * newScale - mouseY);
    this.setPosition(x, y);

    this.scale = newScale;
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
        if (!isMouseDown(event, MouseButton.Secondary)) {
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

        this.setPosition(this.x - event.movementX, this.y - event.movementY);
      },
      {
        signal: eventController.signal,
      },
    );

    target.addEventListener(
      "mouseup",
      (event) => {
        if (isMouseDown(event, MouseButton.Secondary)) {
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

        const actualSpeed = (cameraSpeed * cameraSpeedScale) | 0;

        switch (event.code) {
          case "KeyW":
          case "ArrowUp": {
            this.setY(this.y - actualSpeed);

            break;
          }

          case "KeyS":
          case "ArrowDown": {
            this.setY(this.y + actualSpeed);

            break;
          }

          case "KeyA":
          case "ArrowLeft": {
            this.setX(this.x - actualSpeed);

            break;
          }

          case "KeyD":
          case "ArrowRight": {
            this.setX(this.x + actualSpeed);

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
        const newScale =
          event.deltaY > 0
            ? this.scale / this.zoomRate // 縮小
            : this.scale * this.zoomRate; // 拡大

        const rect = target.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        this.setScale(newScale, mouseX, mouseY);
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
