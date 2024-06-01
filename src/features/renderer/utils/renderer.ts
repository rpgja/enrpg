import { Camera } from "@/features/renderer/utils/camera";
import type { RPGMap } from "@/features/rpgen/utils/map";
import { requestImage } from "@/utils/image";

export type RendererConstructor = {
  ID: string;
  new (context: RendererContext): Renderer;
};

export type Renderer = {
  render(): void;
  tick?(time: DOMHighResTimeStamp): void;
};

export class RendererContext {
  static readonly RPGEN_BASE_CHIP_SIZE = 16;
  static readonly BASE_CHIP_SIZE = 64;

  chipSize: number;
  readonly rpgMap: RPGMap;
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly camera: Camera;

  calcChipSize(): number {
    return (RendererContext.BASE_CHIP_SIZE * this.camera.scale) | 0;
  }

  constructor(rpgMap: RPGMap) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      // TODO
      throw new Error();
    }

    const camera = new Camera();

    this.rpgMap = rpgMap;
    this.canvas = canvas;
    this.context = context;
    this.camera = camera;
    this.chipSize = this.calcChipSize();
  }

  static readonly #NOT_FOUND_CHIP_IMAGE_SRC =
    "https://rpgen.site/dq/sprites/img/404Chip.png";

  #renderNotFoundChip(dx: number, dy: number, dw: number, dh: number): void {
    const notFoundChipImage = requestImage(
      RendererContext.#NOT_FOUND_CHIP_IMAGE_SRC,
    );

    if (!notFoundChipImage) {
      return;
    }

    this.context.drawImage(notFoundChipImage, 0, 0, 16, 16, dx, dy, dw, dh);
  }

  renderImage(
    src: string,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ): void {
    const image = requestImage(src);
    if (image === null) {
      this.#renderNotFoundChip(dx, dy, dw, dh);
      return;
    }

    if (image === undefined) {
      return;
    }

    this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  renderChip(
    src: string,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    destTileX: number,
    destTileY: number,
  ): void {
    const { chipSize, camera } = this;
    const dx = chipSize * destTileX * camera.x;
    const dy = chipSize * destTileY * camera.y;

    this.renderImage(src, sx, sy, sw, sh, dx, dy, chipSize, chipSize);
  }
}
