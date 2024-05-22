import { RPGMap } from "@/features/rpgen/utils/map";

export class Editor {
  readonly #rpgMap: RPGMap;
  readonly #canvas = document.createElement("canvas");
  readonly #context = this.#canvas.getContext("2d")!;

  constructor(rpgMap: RPGMap) {
    this.#rpgMap = rpgMap;

    const canvas = this.#canvas;

    canvas.style.imageRendering = "pixalated";
    canvas.style.display = "block";
  }

  render(): void {
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
    });

    this.#resizeObserver = resizeObserver;

    resizeObserver.observe(parentNode);
    parentNode.append(canvas);
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
