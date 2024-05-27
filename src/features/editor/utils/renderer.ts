import type { EventPoint } from "@/features/rpgen/types/event-point";
import type { LookPoint } from "@/features/rpgen/types/look-point";
import { type DQStillSprite, SpriteType } from "@/features/rpgen/types/sprite";
import type { TeleportPoint } from "@/features/rpgen/types/teleport-point";
import type { Position } from "@/features/rpgen/types/types";
import { type InfinityChipMap, TileChipMap } from "@/features/rpgen/utils/chip";
import type { RPGMap } from "@/features/rpgen/utils/map";
import {
  ANIMATION_SPRITE_FLIP_INTERVAL,
  RPGEN_CHIP_SIZE,
  getDQAnimationSpritePosition,
} from "@/features/rpgen/utils/sprite";
import { requestImage } from "@/utils/image";
import { Camera } from "./camera";
import { Pointer, type PointerSelection } from "./pointer";

export enum OverlayContentColor {
  Gaming = 0,
  Invert = 1,
}

export enum RPGENGrid {
  Medium = 0,
  Large = 1,
  Largest = 2,
}

/**
 * ```js
 * [dq.CANVAS_WIDTH / (dq.CHIP_SIZE_X * (clip_s / dq.scaleMultiplier)), dq.CANVAS_HEIGHT / (dq.CHIP_SIZE_Y * (clip_s / dq.scaleMultiplier))]
 * ```
 */
export type RPGENGridSize = [cols: number, rows: number];

export const rpgenGridToSize = (rpgenGrid: RPGENGrid): RPGENGridSize => {
  switch (rpgenGrid) {
    case RPGENGrid.Medium:
      return [15, 11.25];
    case RPGENGrid.Large:
      return [30, 22.5];
    case RPGENGrid.Largest:
      return [60, 45];
  }
};

export type RendererLayers = {
  floor: boolean;
  objects: boolean;
  humans: boolean;
  teleportPoints: boolean;
  lookPoints: boolean;
  eventPoints: boolean;
};

export type TileSelection = {
  start: Position;
  end: Position;
};

export class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly camera: Camera;
  readonly pointer: Pointer;
  #chipSize: number;

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
    const pointer = new Pointer();

    camera.attachElement(canvas);
    pointer.attachElement(canvas);

    this.canvas = canvas;
    this.context = context;
    this.camera = camera;
    this.pointer = pointer;
    this.#chipSize = this.#calcChipSize();
  }

  layers: RendererLayers = {
    floor: true,
    objects: true,
    humans: true,
    teleportPoints: true,
    lookPoints: true,
    eventPoints: true,
  };

  setLayers(layers: Partial<RendererLayers>): void {
    this.layers = {
      ...this.layers,
      ...layers,
    };
  }

  #calcChipSize(): number {
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

  renderNotFound(x: number, y: number): void {
    const notFound = requestImage(
      "https://rpgen.site/dq/sprites/img/404Chip.png",
    );

    if (!notFound) {
      return;
    }

    const { context, camera } = this;
    const chipSize = this.#chipSize;

    context.drawImage(
      notFound,
      chipSize * x - camera.x,
      chipSize * y - camera.y,
      chipSize,
      chipSize,
    );
  }

  static readonly #BASE_TILE_SIZE = 64;

  renderTileMap(tileMap: TileChipMap): void {
    const { canvas, context, camera } = this;

    const chipSize = this.#chipSize;
    const cols = canvas.width / chipSize;
    const rows = canvas.height / chipSize;

    const tileOffsetX = camera.x / chipSize;
    const tileOffsetY = camera.y / chipSize;

    for (let y = tileOffsetY | 0; y < rows + tileOffsetY; y++) {
      if (y < 0 || y >= TileChipMap.MAX_WIDTH) {
        continue;
      }

      for (let x = tileOffsetX | 0; x < cols + tileOffsetX; x++) {
        if (x < 0 || x >= TileChipMap.MAX_WIDTH) {
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

            if (dqStillSprites === null) {
              this.renderNotFound(x, y);

              break;
            }

            if (dqStillSprites === undefined) {
              break;
            }

            context.drawImage(
              dqStillSprites,
              tile.sprite.surface.x * RPGEN_CHIP_SIZE,
              tile.sprite.surface.y * RPGEN_CHIP_SIZE,
              RPGEN_CHIP_SIZE,
              RPGEN_CHIP_SIZE,
              chipSize * x - camera.x,
              chipSize * y - camera.y,
              chipSize,
              chipSize,
            );

            break;
          }

          case SpriteType.CustomStillSprite: {
            const customStillSprite = requestImage(
              `https://rpgen.site/dq/sprites/${tile.sprite.id}/sprite.png`,
            );

            if (customStillSprite === null) {
              this.renderNotFound(x, y);

              break;
            }

            if (customStillSprite === undefined) {
              break;
            }

            context.drawImage(
              customStillSprite,
              0,
              0,
              RPGEN_CHIP_SIZE,
              RPGEN_CHIP_SIZE,
              chipSize * x - camera.x,
              chipSize * y - camera.y,
              chipSize,
              chipSize,
            );

            break;
          }
        }
      }
    }
  }

  #currentFrameFlip = 0;

  renderHumans(): void {
    const { context, camera } = this;
    const currentFrameFlip = this.#currentFrameFlip;
    const chipSize = this.#chipSize;

    for (const human of this.rpgMap.humans) {
      switch (human.sprite.type) {
        case SpriteType.DQAnimationSprite: {
          const dqAnimationSprites = requestImage(
            "https://rpgen.site/dq/img/dq/char.png",
          );

          if (dqAnimationSprites === null) {
            this.renderNotFound(human.position.x, human.position.y);

            break;
          }

          if (dqAnimationSprites === undefined) {
            break;
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
            RPGEN_CHIP_SIZE,
            RPGEN_CHIP_SIZE,
            chipSize * human.position.x - camera.x,
            chipSize * human.position.y - camera.y,
            chipSize,
            chipSize,
          );

          break;
        }
        case SpriteType.CustomAnimationSprite: {
          const customAnimationSprite = requestImage(
            `https://rpgen.pw/dq/sAnims/res/${human.sprite.id}.png`,
          );

          if (customAnimationSprite === null) {
            this.renderNotFound(human.position.x, human.position.y);

            break;
          }

          if (customAnimationSprite === undefined) {
            break;
          }

          context.drawImage(
            customAnimationSprite,
            RPGEN_CHIP_SIZE * currentFrameFlip,
            RPGEN_CHIP_SIZE * human.direction,
            RPGEN_CHIP_SIZE,
            RPGEN_CHIP_SIZE,
            chipSize * human.position.x - camera.x,
            chipSize * human.position.y - camera.y,
            chipSize,
            chipSize,
          );
          break;
        }

        case SpriteType.CustomStillSprite: {
          const customStillSprite = requestImage(
            `https://rpgen.site/dq/sprites/${human.sprite.id}/sprite.png`,
          );

          if (customStillSprite === null) {
            this.renderNotFound(human.position.x, human.position.y);

            break;
          }

          if (customStillSprite === undefined) {
            break;
          }

          context.drawImage(
            customStillSprite,
            0,
            0,
            RPGEN_CHIP_SIZE,
            RPGEN_CHIP_SIZE,
            chipSize * human.position.x - camera.x,
            chipSize * human.position.y - camera.y,
            chipSize,
            chipSize,
          );
          break;
        }
      }
    }
  }

  renderPoints(
    points:
      | InfinityChipMap<TeleportPoint>
      | InfinityChipMap<LookPoint>
      | InfinityChipMap<EventPoint>,
    surface: DQStillSprite["surface"],
  ): void {
    const dqStillSprites = requestImage("https://rpgen.site/dq/img/dq/map.png");

    if (!dqStillSprites) {
      return;
    }

    const { context, camera } = this;
    const chipSize = this.#chipSize;

    for (const point of points) {
      context.drawImage(
        dqStillSprites,
        surface.x * RPGEN_CHIP_SIZE,
        surface.y * RPGEN_CHIP_SIZE,
        RPGEN_CHIP_SIZE,
        RPGEN_CHIP_SIZE,
        chipSize * point.position.x - camera.x,
        chipSize * point.position.y - camera.y,
        chipSize,
        chipSize,
      );
    }
  }

  renderingCollisionDetection = false;
  renderCollisionDetection(): void {
    if (!this.renderingCollisionDetection) {
      return;
    }
    const { canvas, context, camera } = this;

    const chipSize = this.#chipSize;
    const cols = canvas.width / chipSize;
    const rows = canvas.height / chipSize;

    const tileOffsetX = camera.x / chipSize;
    const tileOffsetY = camera.y / chipSize;

    context.save();
    this.#setOverlayContentStyle(0.2);

    for (let y = tileOffsetY | 0; y < rows + tileOffsetY; y++) {
      if (y < 0 || y >= TileChipMap.MAX_WIDTH) {
        continue;
      }

      const halfChipSize = chipSize >> 1;
      for (let x = tileOffsetX | 0; x < cols + tileOffsetX; x++) {
        if (x < 0 || x >= TileChipMap.MAX_WIDTH) {
          continue;
        }

        const human = this.rpgMap.humans.get(x, y);
        const object = this.rpgMap.objects.get(x, y);
        const floor = this.rpgMap.floor.get(x, y);

        if (
          human ||
          object?.collision ||
          (!object?.collision && floor?.collision)
        ) {
          context.beginPath();
          context.arc(
            chipSize * x - camera.x + halfChipSize,
            chipSize * y - camera.y + halfChipSize,
            halfChipSize,
            0,
            2 * Math.PI,
          );
          context.closePath();
          context.fill();
        }
      }
    }

    context.restore();
  }

  overlayContentColor = OverlayContentColor.Gaming;

  #currentFrameHue = 0;

  setOverlayContentColor(overlayContentColor: OverlayContentColor): void {
    this.overlayContentColor = overlayContentColor;
  }

  #setOverlayContentStyle(alpha = 1): void {
    const { context } = this;

    context.globalAlpha = alpha;

    switch (this.overlayContentColor) {
      case OverlayContentColor.Gaming: {
        context.strokeStyle =
          context.fillStyle = `hsla(${this.#currentFrameHue} 100% 50% / ${alpha})`;

        break;
      }

      case OverlayContentColor.Invert: {
        context.strokeStyle =
          context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        context.globalCompositeOperation = "difference";

        break;
      }
    }
  }

  rpgenGrid?: RPGENGrid;

  setRPGENGrid(rpgenGrid: RPGENGrid | undefined): void {
    this.rpgenGrid = rpgenGrid;
  }

  renderRPGENGrid(): void {
    const { context, camera, rpgenGrid } = this;

    if (rpgenGrid === undefined) {
      return;
    }

    const chipSize = this.#chipSize;
    const [cols, rows] = rpgenGridToSize(rpgenGrid);

    context.save();

    this.#setOverlayContentStyle();

    context.lineWidth = 2 * camera.scale;
    context.strokeRect(
      camera.x > 0
        ? chipSize - (camera.x % chipSize)
        : Math.abs(camera.x % chipSize),
      camera.y > 0
        ? chipSize - (camera.y % chipSize)
        : Math.abs(camera.y % chipSize),
      cols * chipSize,
      rows * chipSize,
    );

    context.restore();
  }

  renderOutline(): void {
    const { context, camera } = this;
    const chipSize = this.#chipSize;

    context.save();
    this.#setOverlayContentStyle();
    context.strokeRect(
      0 - camera.x,
      0 - camera.y,
      chipSize * TileChipMap.MAX_WIDTH,
      chipSize * TileChipMap.MAX_WIDTH,
    );
    context.restore();
  }

  #previousCameraX?: number;
  #previousCameraY?: number;
  #previousCameraScale?: number;

  cameraMoved = false;

  #calcCameraMoved(): void {
    // not moved
    if (
      this.#previousCameraX === this.camera.x &&
      this.#previousCameraY === this.camera.y &&
      this.#previousCameraScale === this.camera.scale
    ) {
      this.cameraMoved = false;

      return;
    }

    this.#previousCameraX = this.camera.x;
    this.#previousCameraY = this.camera.y;
    this.#previousCameraScale = this.camera.scale;
    this.cameraMoved = true;
  }

  #tileSelection: TileSelection | undefined;
  #previousPointerSelection: PointerSelection | undefined;
  #selectionId: number | undefined;

  #calcTileSelection(): void {
    const { camera, pointer } = this;

    if (!pointer.selection) {
      this.#tileSelection = undefined;

      return;
    }

    const previousPointerSelection = this.#previousPointerSelection;

    if (!pointer.selecting) {
      return;
    }

    if (this.#selectionId !== pointer.selection.id) {
      this.#tileSelection = undefined;
    }

    if (
      // this.#selectionId === pointer.selection.id &&
      previousPointerSelection &&
      previousPointerSelection.start.x === pointer.selection.start.x &&
      previousPointerSelection.start.y === pointer.selection.start.y &&
      previousPointerSelection.end.x === pointer.selection.end.x &&
      previousPointerSelection.end.y === pointer.selection.end.y &&
      !this.cameraMoved
    ) {
      return;
    }

    // TODO
    // NOTE: requires clone
    this.#previousPointerSelection = {
      ...pointer.selection,
    };

    const chipSize = this.#chipSize;

    this.#tileSelection = {
      start:
        (this.#selectionId === pointer.selection.id || pointer.selecting) &&
        this.#tileSelection
          ? this.#tileSelection.start
          : {
              x: Math.floor(
                pointer.selection.start.x / chipSize + camera.x / chipSize,
              ),
              y: Math.floor(
                pointer.selection.start.y / chipSize + camera.y / chipSize,
              ),
            },
      end: {
        x: Math.floor(pointer.selection.end.x / chipSize + camera.x / chipSize),
        y: Math.floor(pointer.selection.end.y / chipSize + camera.y / chipSize),
      },
    };

    this.#selectionId = pointer.selection.id;
  }

  renderPointer(): void {
    const { pointer, context, camera } = this;
    const chipSize = this.#chipSize;

    context.save();

    context.fillStyle = "#fff";
    context.globalAlpha = 0.5;

    if (pointer.position) {
      const focusTileX = Math.floor(
        pointer.position.x / chipSize + this.camera.x / chipSize,
      );
      const focusTileY = Math.floor(
        pointer.position.y / chipSize + this.camera.y / chipSize,
      );

      context.fillRect(
        chipSize * focusTileX - camera.x,
        chipSize * focusTileY - camera.y,
        chipSize,
        chipSize,
      );
    }

    const tileSelection = this.#tileSelection;

    if (tileSelection) {
      const startX = Math.min(tileSelection.start.x, tileSelection.end.x);
      const startY = Math.min(tileSelection.start.y, tileSelection.end.y);
      const endX = Math.max(tileSelection.start.x, tileSelection.end.x);
      const endY = Math.max(tileSelection.start.y, tileSelection.end.y);

      context.fillStyle = "red";

      context.fillRect(
        chipSize * startX - camera.x,
        chipSize * startY - camera.y,
        chipSize * (endX - startX + 1),
        chipSize * (endY - startY + 1),
      );
    }

    context.restore();
  }

  clear(): void {
    const canvas = this.canvas;

    this.context.clearRect(0, 0, canvas.width, canvas.height);
  }

  render(): void {
    this.resize();
    this.clear();

    this.context.imageSmoothingEnabled = false;

    const layers = this.layers;

    if (layers.floor) {
      this.renderTileMap(this.rpgMap.floor);
    }

    if (layers.objects) {
      this.renderTileMap(this.rpgMap.objects);
    }

    if (layers.humans) {
      this.renderHumans();
    }

    const { rpgMap } = this;

    if (layers.teleportPoints) {
      this.renderPoints(rpgMap.teleportPoints, { x: 23, y: 7 });
    }

    if (layers.lookPoints) {
      this.renderPoints(rpgMap.lookPoints, { x: 22, y: 8 });
    }

    if (layers.eventPoints) {
      this.renderPoints(rpgMap.eventPoints, { x: 7, y: 8 });
    }

    this.renderCollisionDetection();
    this.renderRPGENGrid();
    this.renderOutline();
    this.renderPointer();
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

      this.#currentFrameFlip = ((now / ANIMATION_SPRITE_FLIP_INTERVAL) | 0) % 2;

      if (this.#currentFrameHue >= 360) {
        this.#currentFrameHue = 0;
      }

      this.#currentFrameHue++;

      this.#chipSize = this.#calcChipSize();
      this.#calcCameraMoved();
      this.#calcTileSelection();
      this.render();
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  stopTicking(): void {
    this.ticking = false;
  }
}
