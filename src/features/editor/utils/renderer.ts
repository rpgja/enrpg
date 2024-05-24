import type { RPGMap } from "@/features/rpgen/utils/map";
import { Camera } from "./camera";

export class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly camera = new Camera(0.07);

  constructor(readonly rpgMap: RPGMap) {
    const canvas = document.createElement("canvas");

    canvas.style.display = "block";
    canvas.style.imageRendering = "pixalated";

    const context = canvas.getContext("2d", {
      alpha: false,
    });

    if (!context) {
      // TODO
      throw new TypeError();
    }

    this.canvas = canvas;
    this.context = context;
  }

  resize(): void {
    const canvas = this.canvas;
    const parentElement = canvas.parentElement;

    if (!parentElement) {
      return;
    }

    if (canvas.width !== parentElement.offsetWidth) {
      canvas.width = parentElement.offsetWidth;
    }

    if (canvas.height !== parentElement.offsetHeight) {
      canvas.height = parentElement.offsetHeight;
    }
  }

  render(): void {
    this.resize();
  }

  ticking = false;

  startTicking(): void {
    this.ticking = true;

    const tick = (): void => {
      if (!this.ticking) {
        return;
      }

      this.render();
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  stopTicking(): void {
    this.ticking = false;
  }
}
