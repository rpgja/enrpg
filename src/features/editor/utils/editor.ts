import { SpriteType } from "@/features/rpgen/types/sprite";
import { Position } from "@/features/rpgen/types/types";
import { RPGMap } from "@/features/rpgen/utils/map";
import { TileMap } from "@/features/rpgen/utils/tile";
import { getDQAnimationSpritePosition } from "@/features/rpgen/utils/sprite";
import { requestImage } from "@/utils/image";

export enum RPGENGrid {
  Medium,
  Large,
  Largest
}

/**
 * ```js
 * [dq.CANVAS_WIDTH / (dq.CHIP_SIZE_X * (clip_s / dq.scaleMultiplier)), dq.CANVAS_HEIGHT / (dq.CHIP_SIZE_Y * (clip_s / dq.scaleMultiplier))]
 * ```
 */
export type RPGENGridSize = [cols: number, rows: number];

export const rpgenGridToSize = (rpgenGrid: RPGENGrid): RPGENGridSize => {
  switch (rpgenGrid) {
    case RPGENGrid.Medium: return [15, 11.25];
    case RPGENGrid.Large: return [30, 22.5];
    case RPGENGrid.Largest: return [60, 45];
  }
};

export type Camera = Position & {
  scale: number;
  scaleUnit: number;
};

export class Editor {
  readonly #rpgMap: RPGMap;
  readonly #canvas = document.createElement("canvas");
  readonly #context = this.#canvas.getContext("2d")!;
  readonly #eventController = new AbortController();
  readonly camera: Camera = {
    scale: 1,
    scaleUnit: 0.07,
    x: 0,
    y: 0,
  };

  constructor(rpgMap: RPGMap) {
    this.#rpgMap = rpgMap;
    this.#canvas.style.imageRendering = "pixalated";
    this.#canvas.style.display = "block";
  }

  static readonly #BASE_TILE_SIZE = 64;

  #parentNode?: HTMLElement;
  #currentTime = 0;
  #currentFrameFlip = 0;

  rpgenGrid?: RPGENGrid

  setRPGENGrid(rpgenGrid: RPGENGrid | undefined): void {
    this.rpgenGrid = rpgenGrid;
  }

  #frames = 0n;

  render(): void {
    if (!this.#mounted) {
      // TODO: brush up error message
      throw new Error("");
    }

    const parentNode = this.#parentNode!;
    const canvas = this.#canvas;
    const context = this.#context;
    const tileSize = (Editor.#BASE_TILE_SIZE * this.camera.scale) | 0;
    const cols = canvas.width / tileSize;
    const rows = canvas.height / tileSize;
    const rpgMap = this.#rpgMap;

    if (canvas.width !== parentNode.offsetWidth) {
      canvas.width = parentNode.offsetWidth;
    }

    if (canvas.height !== parentNode.offsetHeight) {
      canvas.height = parentNode.offsetHeight;
    }

    context.imageSmoothingEnabled = false;

    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const tileOffsetX = this.camera.x / tileSize;
    const tileOffsetY = this.camera.y / tileSize;

    const render = (tileMap: TileMap): void => {
      for (let y = tileOffsetY | 0; y < rows + tileOffsetY; y++) {
        for (let x = tileOffsetX | 0; x < cols + tileOffsetX; x++) {
          const tile = tileMap.get(x, y);

          if (!tile) {
            continue;
          }

          switch (tile.sprite.type) {
            case SpriteType.DQStillSprite: {
              const dqStillSprites = requestImage(
                "https://rpgen.site/dq/img/dq/map.png"
              );
              if (!dqStillSprites) {
                continue;
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
                tileSize
              );

              break;
            }
            case SpriteType.CustomStillSprite: {
              const customStillSprite = requestImage(
                `https://rpgen.site/dq/sprites/${tile.sprite.id}/sprite.png`
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
                tileSize * x - this.camera.x,
                tileSize * y - this.camera.y,
                tileSize,
                tileSize
              );
              break;
            }
          }
        }
      }
    };

    render(rpgMap.floor);
    render(rpgMap.objects);

    for (const human of rpgMap.humans) {
      switch (human.sprite.type) {
        case SpriteType.DQAnimationSprite: {
          const dqAnimationSprites = requestImage(
            "https://rpgen.site/dq/img/dq/char.png"
          );
          if (!dqAnimationSprites) {
            continue;
          }
          const surface = getDQAnimationSpritePosition(
            human.sprite.surface,
            human.direction,
            this.#currentFrameFlip
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
            tileSize
          );

          break;
        }
        case SpriteType.CustomAnimationSprite: {
          const customAnimationSprite = requestImage(
            `https://rpgen.pw/dq/sAnims/res/${human.sprite.id}.png`
          );
          if (!customAnimationSprite) {
            continue;
          }
          context.drawImage(
            customAnimationSprite,
            16 * this.#currentFrameFlip,
            16 * human.direction,
            16,
            16,
            tileSize * human.position.x - this.camera.x,
            tileSize * human.position.y - this.camera.y,
            tileSize,
            tileSize
          );
          break;
        }
        case SpriteType.CustomStillSprite: {
          const customStillSprite = requestImage(
            `https://rpgen.site/dq/sprites/${human.sprite.id}/sprite.png`
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
            tileSize
          );
          break;
        }
      }
    }

    if (this.rpgenGrid !== undefined) {
      const [cols, rows] = rpgenGridToSize(this.rpgenGrid);
      const camera = this.camera;

      context.imageSmoothingEnabled = false;
      context.strokeStyle = `hsl(${this.#frames % 360n} 100% 50%)`;
      context.lineWidth = 2 * camera.scale;
      context.strokeRect(
        camera.x > 0 ? tileSize - camera.x % tileSize : Math.abs(camera.x % tileSize),
        camera.y > 0 ? tileSize - camera.y % tileSize : Math.abs(camera.y % tileSize),
        cols * tileSize, rows * tileSize
      );
    }

    this.#frames++;
  }

  #mounted = false;
  #resizeObserver?: ResizeObserver;

  async mount(parentNode: HTMLElement): Promise<void> {
    if (this.#mounted) {
      // TODO: brush up error message
      throw new Error("Already mounted");
    }

    const canvas = this.#canvas;

    canvas.width = parentNode.offsetWidth;
    canvas.height = parentNode.offsetHeight;

    canvas.addEventListener(
      "wheel",
      (event) => {
        const newScale =
          event.deltaY > 0
            ? Math.max(
              this.camera.scaleUnit,
              this.camera.scale - this.camera.scaleUnit
            )
            : this.camera.scale + this.camera.scaleUnit;

        if (Editor.#BASE_TILE_SIZE * newScale < 10) {
          return;
        }

        this.camera.scale = newScale;
      },
      {
        signal: this.#eventController.signal,
      }
    );

    let movingCamera = false;

    canvas.addEventListener(
      "pointerdown",
      (event) => {
        if (event.button !== 2) {
          return;
        }

        movingCamera = true;
        canvas.setPointerCapture(event.pointerId);
      },
      {
        signal: this.#eventController.signal,
      }
    );

    canvas.addEventListener(
      "pointermove",
      (event) => {
        if (!movingCamera) {
          return;
        }

        this.camera.x -= event.movementX;
        this.camera.y -= event.movementY;
      },
      {
        signal: this.#eventController.signal,
      }
    );

    canvas.addEventListener(
      "pointerup",
      () => {
        if (!movingCamera) {
          return;
        }

        movingCamera = false;
      },
      {
        signal: this.#eventController.signal,
      }
    );

    canvas.addEventListener(
      "contextmenu",
      (event) => {
        event.preventDefault();
      },
      {
        signal: this.#eventController.signal,
      }
    );

    const render = () => {
      this.#currentTime = performance.now();
      this.#currentFrameFlip = ((this.#currentTime / 500) | 0) % 2;
      this.render();
      requestAnimationFrame(render);
    };

    this.#parentNode = parentNode;
    parentNode.append(canvas);
    this.#mounted = true;
    requestAnimationFrame(render);
  }

  unmount(): void {
    if (!this.#mounted) {
      // TODO: brush up error message
      throw new Error("");
    }

    this.#eventController.abort();
    this.#canvas.remove();
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = undefined;
  }
}
