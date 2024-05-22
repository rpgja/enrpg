import { SpriteType } from "@/features/rpgen/types/sprite";
import { RPGMap } from "@/features/rpgen/utils/map";
import { loadImage } from "@/utils/image";

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

  async render(): Promise<void> {
    if (!this.#mounted) {
      // TODO: brush up error message
      throw new Error("");
    }

    const canvas = this.#canvas;
    const context = this.#context;
    const cols = canvas.width / Editor.#BASE_TILE_SIZE;
    const rows = canvas.height / Editor.#BASE_TILE_SIZE;
    const rpgMap = this.#rpgMap;

    context.imageSmoothingEnabled = false;
    //context.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tile = rpgMap.floor.get(x, y);

        switch (tile.sprite.type) {
          case SpriteType.DQStillSprite: {
            const dqStillSprites = await loadImage("https://rpgen.site/dq/img/dq/map.png");

            context.drawImage(
              dqStillSprites,
              tile.sprite.surface.x * 16, tile.sprite.surface.y * 16,
              16, 16,
              Editor.#BASE_TILE_SIZE * x, Editor.#BASE_TILE_SIZE * y,
              Editor.#BASE_TILE_SIZE, Editor.#BASE_TILE_SIZE
            );

            break;
          }
        }
      }
    }

    console.log(canvas.width / Editor.#BASE_TILE_SIZE);
  }

  #mounted = false;
  #resizeObserver?: ResizeObserver;

  mount(parentNode: HTMLElement): void {
    if (this.#mounted) {
      // TODO: brush up error message
      throw new Error("Already mounted");
    }

    const canvas = this.#canvas;

    canvas.width = parentNode.offsetWidth;
    canvas.height = parentNode.offsetHeight;

    const resizeObserver = new ResizeObserver(([record]) => {
      if (!record) {
        return;
      }

      canvas.width = record.contentRect.width;
      canvas.height = record.contentRect.height;
      requestAnimationFrame(() => this.render());
    });

    this.#resizeObserver = resizeObserver;

    resizeObserver.observe(parentNode);
    parentNode.append(canvas);
    this.#mounted = true;
    requestAnimationFrame(() => this.render());
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
