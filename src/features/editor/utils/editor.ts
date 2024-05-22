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

  render(): void {
    if (!this.#mounted) {
      // TODO: brush up error message
      throw new Error("");
    }

    const dqStillSprites = getImage("https://rpgen.site/dq/img/dq/map.png")!;

    const canvas = this.#canvas;
    const context = this.#context;
    const cols = canvas.width / Editor.#BASE_TILE_SIZE;
    const rows = canvas.height / Editor.#BASE_TILE_SIZE;
    const rpgMap = this.#rpgMap;

    context.imageSmoothingEnabled = false;

    console.log("DQ", dqStillSprites)

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tile = rpgMap.floor.get(x, y);

        switch (tile.sprite.type) {
          case SpriteType.DQStillSprite: {
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

    const dqStillSprites = await loadImage("https://rpgen.site/dq/img/dq/map.png")!;
    const context = this.#context;

    const render = () => {
      const cols = canvas.width / Editor.#BASE_TILE_SIZE;
      const rows = canvas.height / Editor.#BASE_TILE_SIZE;
      const rpgMap = this.#rpgMap;

      context.imageSmoothingEnabled = false;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const tile = rpgMap.floor.get(x, y);

          switch (tile.sprite.type) {
            case SpriteType.DQStillSprite: {
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
    };

    const resizeObserver = new ResizeObserver(([record]) => {
      if (!record) {
        return;
      }

      // canvas.width = record.contentRect.width;
      // canvas.height = record.contentRect.height;
    });

    window.onresize = () => {
      canvas.width = parentNode.offsetWidth;
      canvas.height = parentNode.offsetHeight;
      requestAnimationFrame(render);
    }

    this.#resizeObserver = resizeObserver;
    parentNode.append(canvas);
    this.#mounted = true;
    await loadImage("https://rpgen.site/dq/img/dq/map.png");
    resizeObserver.observe(parentNode);

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
