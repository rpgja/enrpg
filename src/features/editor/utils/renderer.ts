import type { EventPoint } from "@/features/rpgen/types/event-point";
import type { LookPoint } from "@/features/rpgen/types/look-point";
import { type DQStillSprite, SpriteType } from "@/features/rpgen/types/sprite";
import type { TeleportPoint } from "@/features/rpgen/types/teleport-point";
import type { RPGMap } from "@/features/rpgen/utils/map";
import { getDQAnimationSpritePosition } from "@/features/rpgen/utils/sprite";
import type { TileMap } from "@/features/rpgen/utils/tile";
import { requestImage } from "@/utils/image";
import { Camera } from "./camera";

export enum RPGENGridColor {
  Gaming = 0,
  Invert = 1,
}

export enum RPGENGridSize {
  Medium = 0,
  Large = 1,
  Largest = 2,
}

/**
 * ```js
 * [dq.CANVAS_WIDTH / (dq.CHIP_SIZE_X * (clip_s / dq.scaleMultiplier)), dq.CANVAS_HEIGHT / (dq.CHIP_SIZE_Y * (clip_s / dq.scaleMultiplier))]
 * ```
 */
export type RPGENGridSizeTuple = [cols: number, rows: number];

export const rpgenGridSizeToSizeTuple = (
  rpgenGridSize: RPGENGridSize,
): RPGENGridSizeTuple => {
  switch (rpgenGridSize) {
    case RPGENGridSize.Medium:
      return [15, 11.25];
    case RPGENGridSize.Large:
      return [30, 22.5];
    case RPGENGridSize.Largest:
      return [60, 45];
  }
};

export class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly camera: Camera;
  #tileSize: number;

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

    const camera = new Camera(0.07);

    camera.attachElement(canvas);

    this.canvas = canvas;
    this.context = context;
    this.camera = camera;
    this.#tileSize = this.#calcTileSize();
  }

  #calcTileSize(): number {
    return (Renderer.#BASE_TILE_SIZE * this.camera.scale) | 0;
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

  static readonly #BASE_TILE_SIZE = 64;

  renderTileMap(tileMap: TileMap): void {
    const { canvas, context, camera } = this;

    const tileSize = this.#tileSize;
    const cols = canvas.width / tileSize;
    const rows = canvas.height / tileSize;

    const tileOffsetX = camera.x / tileSize;
    const tileOffsetY = camera.y / tileSize;

    for (let y = tileOffsetY | 0; y < rows + tileOffsetY; y++) {
      if (y < 0 || y >= 300) {
        continue;
      }

      for (let x = tileOffsetX | 0; x < cols + tileOffsetX; x++) {
        if (x < 0 || x >= 300) {
          continue;
        }

        const tile = tileMap.get(x, y);

        if (!tile) {
          continue;
        }

        switch (tile.sprite.type) {
          case SpriteType.DQStillSprite: {
            const dqStillSprites = requestImage(
              "https://rpgen.site/dq/img/dq/map.png",
            );

            if (!dqStillSprites) {
              break;
            }

            context.drawImage(
              dqStillSprites,
              tile.sprite.surface.x * 16,
              tile.sprite.surface.y * 16,
              16,
              16,
              tileSize * x - this.camera.x,
              tileSize * y - this.camera.y,
              tileSize,
              tileSize,
            );

            break;
          }

          case SpriteType.CustomStillSprite: {
            const customStillSprite = requestImage(
              `https://rpgen.site/dq/sprites/${tile.sprite.id}/sprite.png`,
            );

            if (!customStillSprite) {
              break;
            }

            context.drawImage(
              customStillSprite,
              0,
              0,
              16,
              16,
              tileSize * x - camera.x,
              tileSize * y - camera.y,
              tileSize,
              tileSize,
            );

            break;
          }
        }
      }
    }
  }

  #currentFrameFlip = 0;

  renderHumans(): void {
    const { context } = this;
    const currentFrameFlip = this.#currentFrameFlip;
    const tileSize = this.#tileSize;

    for (const human of this.rpgMap.humans) {
      switch (human.sprite.type) {
        case SpriteType.DQAnimationSprite: {
          const dqAnimationSprites = requestImage(
            "https://rpgen.site/dq/img/dq/char.png",
          );
          if (!dqAnimationSprites) {
            continue;
          }
          const surface = getDQAnimationSpritePosition(
            human.sprite.surface,
            human.direction,
            currentFrameFlip,
          );
          context.drawImage(
            dqAnimationSprites,
            surface.x,
            surface.y,
            16,
            16,
            tileSize * human.position.x - this.camera.x,
            tileSize * human.position.y - this.camera.y,
            tileSize,
            tileSize,
          );

          break;
        }
        case SpriteType.CustomAnimationSprite: {
          const customAnimationSprite = requestImage(
            `https://rpgen.pw/dq/sAnims/res/${human.sprite.id}.png`,
          );
          if (!customAnimationSprite) {
            continue;
          }
          context.drawImage(
            customAnimationSprite,
            16 * currentFrameFlip,
            16 * human.direction,
            16,
            16,
            tileSize * human.position.x - this.camera.x,
            tileSize * human.position.y - this.camera.y,
            tileSize,
            tileSize,
          );
          break;
        }
        case SpriteType.CustomStillSprite: {
          const customStillSprite = requestImage(
            `https://rpgen.site/dq/sprites/${human.sprite.id}/sprite.png`,
          );
          if (!customStillSprite) {
            continue;
          }
          context.drawImage(
            customStillSprite,
            0,
            0,
            16,
            16,
            tileSize * human.position.x - this.camera.x,
            tileSize * human.position.y - this.camera.y,
            tileSize,
            tileSize,
          );
          break;
        }
      }
    }
  }

  renderPoints(
    points: TeleportPoint[] | LookPoint[] | EventPoint[],
    surface: DQStillSprite["surface"],
  ): void {
    const dqStillSprites = requestImage("https://rpgen.site/dq/img/dq/map.png");

    if (!dqStillSprites) {
      return;
    }

    const { context, camera } = this;
    const tileSize = this.#tileSize;

    for (const point of points) {
      context.drawImage(
        dqStillSprites,
        surface.x * 16,
        surface.y * 16,
        16,
        16,
        tileSize * point.position.x - camera.x,
        tileSize * point.position.y - camera.y,
        tileSize,
        tileSize,
      );
    }
  }

  rpgenGridColor = RPGENGridColor.Gaming;

  #currentFrameHue = 0;

  setRPGENGridColor(rpgenGridColor: RPGENGridColor): void {
    this.rpgenGridColor = rpgenGridColor;
  }

  rpgenGridSize?: RPGENGridSize;

  setRPGENGridSize(rpgenGridSize: RPGENGridSize | undefined): void {
    this.rpgenGridSize = rpgenGridSize;
  }

  renderRPGENGrid(): void {
    const { context, camera, rpgenGridSize } = this;

    if (rpgenGridSize === undefined) {
      return;
    }
    const tileSize = this.#tileSize;
    const [cols, rows] = rpgenGridSizeToSizeTuple(rpgenGridSize);

    context.save();

    if (this.rpgenGridColor === RPGENGridColor.Gaming) {
      context.strokeStyle = `hsl(${this.#currentFrameHue} 100% 50%)`;
    } else {
      context.strokeStyle = "#fff";
      context.globalCompositeOperation = "difference";
    }

    context.lineWidth = 2 * camera.scale;
    context.strokeRect(
      camera.x > 0
        ? tileSize - (camera.x % tileSize)
        : Math.abs(camera.x % tileSize),
      camera.y > 0
        ? tileSize - (camera.y % tileSize)
        : Math.abs(camera.y % tileSize),
      cols * tileSize,
      rows * tileSize,
    );

    context.restore();
  }

  renderOutline(): void {
    const { context, camera } = this;
    const tileSize = this.#tileSize;

    context.strokeStyle = "#f00";
    context.strokeRect(
      0 - camera.x,
      0 - camera.y,
      tileSize * 300,
      tileSize * 300,
    );
  }

  clear(): void {
    const canvas = this.canvas;

    this.context.clearRect(0, 0, canvas.width, canvas.height);
  }

  render(): void {
    this.resize();
    this.clear();

    this.context.imageSmoothingEnabled = false;

    this.renderTileMap(this.rpgMap.floor);
    this.renderTileMap(this.rpgMap.objects);

    this.renderHumans();

    const { rpgMap } = this;

    this.renderPoints(rpgMap.teleportPoints, { x: 23, y: 7 });
    this.renderPoints(rpgMap.lookPoints, { x: 22, y: 8 });
    this.renderPoints(rpgMap.eventPoints, { x: 7, y: 8 });

    this.renderRPGENGrid();

    this.renderOutline();
  }

  ticking = false;

  startTicking(): void {
    if (this.ticking) {
      return;
    }

    this.ticking = true;

    const tick: FrameRequestCallback = (now) => {
      if (!this.ticking) {
        return;
      }

      this.#currentFrameFlip = ((now / 500) | 0) % 2;

      if (this.#currentFrameHue >= 360) {
        this.#currentFrameHue = 0;
      }

      this.#currentFrameHue++;

      this.#tileSize = this.#calcTileSize();
      this.render();
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  stopTicking(): void {
    this.ticking = false;
  }
}
