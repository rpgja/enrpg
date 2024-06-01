export class RendererContext {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;

  constructor() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      // TODO
      throw new Error();
    }

    this.canvas = canvas;
    this.context = context;
  }
}
