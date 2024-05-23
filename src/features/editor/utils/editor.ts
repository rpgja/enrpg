import { DQAnimationSprite, SpriteType } from "@/features/rpgen/types/sprite";
import { RPGMap } from "@/features/rpgen/utils/map";
import { TileMap } from "@/features/rpgen/utils/tile";
import { getDQAnimationSpritePosition } from "@/features/rpgen/utils/sprite";
import { requestImage } from "@/utils/image";

export class Editor {
  readonly #rpgMap: RPGMap;
  readonly #canvas = document.createElement("canvas");
  readonly #context = this.#canvas.getContext("2d")!;

  constructor(rpgMap: RPGMap) {
    this.#rpgMap = rpgMap;
    this.#canvas.style.imageRendering = "pixalated";
    this.#canvas.style.display = "block";
  }

  static readonly #BASE_TILE_SIZE = 64;

  #parentNode?: HTMLElement;
  #scale = 1;
  #currentTime = 0;
  #currentFrameFlip = 0;

  render(): void {
    if (!this.#mounted) {
      // TODO: brush up error message
      throw new Error("");
    }

    const dqStillSprites = requestImage("https://rpgen.site/dq/img/dq/map.png");
    const parentNode = this.#parentNode!;
    const canvas = this.#canvas;
    const context = this.#context;
    const tileSize = (Editor.#BASE_TILE_SIZE * this.#scale) | 0;
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

    const render = (tileMap: TileMap): void => {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const tile = tileMap.get(x, y);

          if (!tile) {
            continue;
          }

          switch (tile.sprite.type) {
            case SpriteType.DQStillSprite: {
              if (!dqStillSprites) {
                continue;
              }

              context.drawImage(
                dqStillSprites,
                tile.sprite.surface.x * 16,
                tile.sprite.surface.y * 16,
                16,
                16,
                tileSize * x,
                tileSize * y,
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

    const dqAnimationSprites = requestImage(
      "https://rpgen.site/dq/img/dq/char.png"
    );
    for (const human of rpgMap.humans) {
      if (human.sprite.type !== SpriteType.DQAnimationSprite) {
        return;
      }
      const surface = getDQAnimationSpritePosition(
        human.sprite.surface,
        human.direction,
        this.#currentFrameFlip
      );
      if (!dqAnimationSprites) {
        continue;
      }
      context.drawImage(
        dqAnimationSprites,
        surface.x,
        surface.y,
        16,
        16,
        tileSize * human.position.x,
        tileSize * human.position.y,
        tileSize,
        tileSize
      );
    }
  }

  #mounted = false;
  #resizeObserver?: ResizeObserver;

  static readonly #SCALE_UNIT = 0.07;

  async mount(parentNode: HTMLElement): Promise<void> {
    if (this.#mounted) {
      // TODO: brush up error message
      throw new Error("Already mounted");
    }

    const canvas = this.#canvas;

    canvas.width = parentNode.offsetWidth;
    canvas.height = parentNode.offsetHeight;

    canvas.addEventListener("wheel", (event) => {
      const newScale =
        event.deltaY > 0
          ? Math.max(Editor.#SCALE_UNIT, this.#scale - Editor.#SCALE_UNIT)
          : this.#scale + Editor.#SCALE_UNIT;

      if (Editor.#BASE_TILE_SIZE * newScale < 10) {
        return;
      }

      this.#scale = newScale;
    });

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

    this.#canvas.remove();
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = undefined;
  }
}
