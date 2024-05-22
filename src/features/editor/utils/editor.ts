import { SpriteType } from "@/features/rpgen/types/sprite";
import { RPGMap } from "@/features/rpgen/utils/map";
import { getImage, loadImage } from "@/utils/image";

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

  render(): void {
    if (!this.#mounted) {
      // TODO: brush up error message
      throw new Error("");
    }

    const dqStillSprites = getImage("https://rpgen.site/dq/img/dq/map.png")!;
    const parentNode = this.#parentNode!;
    const canvas = this.#canvas;
    const context = this.#context;
    const tileSize = Editor.#BASE_TILE_SIZE * this.#scale | 0;
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

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tile = rpgMap.floor.get(x, y);

        if (!tile) {
          continue;
        }

        switch (tile.sprite.type) {
          case SpriteType.DQStillSprite: {
            context.drawImage(
              dqStillSprites,
              tile.sprite.surface.x * 16, tile.sprite.surface.y * 16,
              16, 16,
              tileSize * x, tileSize * y,
              tileSize, tileSize
            );

            break;
          }
        }
      }
    }
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

    canvas.addEventListener("wheel", event => {
      if (event.deltaY > 0) {
        this.#scale = Math.max(0.2, this.#scale - 0.2)
      } else {
        this.#scale += 0.2;
      }

      render();
    })

    const render = () => {
      this.render();
    };

    this.#parentNode = parentNode;
    parentNode.append(canvas);
    this.#mounted = true;
    await loadImage("https://rpgen.site/dq/img/dq/map.png");
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
