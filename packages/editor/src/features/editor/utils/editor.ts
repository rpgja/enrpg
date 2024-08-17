import { Renderer } from "@/features/editor/utils/renderer";
import { type RPGMap, SpriteType, type Tile } from "rpgen-map";

export class Editor {
  readonly renderer: Renderer;

  constructor(rpgMap: RPGMap) {
    this.renderer = new Renderer(rpgMap);
  }

  mounted = false;

  #eventController: AbortController | undefined;

  readonly #mouseDownListeners = new Set<
    (tileX: number, tileY: number) => void
  >();

  readonly #mouseMoveListeners = new Set<
    (tileX: number, tileY: number) => void
  >();

  readonly #mouseUpListeners = new Set<() => void>();

  putFloorTile(tile: Tile): void {
    let rawTile = "";

    switch (tile.sprite.type) {
      case SpriteType.CustomStillSprite: {
        rawTile += tile.sprite.id;

        if (tile.collision) {
          rawTile += "C";
        }

        break;
      }
      // case SpriteType.DQStillSprite:
      default: {
        throw "unimpl";
      }
    }

    this.renderer.rpgMap.floor.set(tile.position.x, tile.position.y, rawTile);
  }

  onMouseDown(listener: (tileX: number, tileY: number) => void): () => void {
    this.#mouseDownListeners.add(listener);

    return () => {
      this.#mouseDownListeners.delete(listener);
    };
  }

  onMouseMove(listener: (tileX: number, tileY: number) => void): () => void {
    this.#mouseMoveListeners.add(listener);

    return () => {
      this.#mouseMoveListeners.delete(listener);
    };
  }

  onMouseUp(listener: () => void): () => void {
    this.#mouseUpListeners.add(listener);

    return () => {
      this.#mouseUpListeners.delete(listener);
    };
  }

  mount(parentElement: HTMLElement): void {
    if (this.mounted) {
      this.unmount();
    }

    const renderer = this.renderer;
    const eventController = new AbortController();

    renderer.canvas.addEventListener(
      "pointerdown",
      (event) => {
        if ((event.buttons & 1) === 0) {
          return;
        }

        for (const listener of this.#mouseDownListeners) {
          listener(
            Math.floor(
              (event.pageX - renderer.canvas.offsetLeft + renderer.camera.x) /
                renderer.chipSize,
            ),
            Math.floor(
              (event.pageY - renderer.canvas.offsetTop + renderer.camera.y) /
                renderer.chipSize,
            ),
          );
        }
      },
      {
        signal: eventController.signal,
      },
    );

    renderer.canvas.addEventListener(
      "mousemove",
      (event) => {
        for (const listener of this.#mouseMoveListeners) {
          listener(
            Math.floor(
              (event.pageX - renderer.canvas.offsetLeft + renderer.camera.x) /
                renderer.chipSize,
            ),
            Math.floor(
              (event.pageY - renderer.canvas.offsetTop + renderer.camera.y) /
                renderer.chipSize,
            ),
          );
        }
      },
      {
        signal: eventController.signal,
      },
    );

    renderer.canvas.addEventListener(
      "mouseup",
      (event) => {
        if ((event.buttons & 1) !== 0) {
          return;
        }

        for (const listener of this.#mouseUpListeners) {
          listener();
        }
      },
      {
        signal: eventController.signal,
      },
    );

    parentElement.append(renderer.canvas);
    renderer.startTicking();
    this.#eventController = eventController;
    this.mounted = true;
  }

  unmount(): void {
    if (!this.mounted) {
      return;
    }

    this.#eventController?.abort();
    this.#eventController = undefined;

    const renderer = this.renderer;

    renderer.stopTicking();
    renderer.camera.detachElement();
    renderer.pointer.detachElement();
    renderer.canvas.remove();
    this.mounted = false;
  }
}
