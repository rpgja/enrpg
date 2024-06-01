import type { RPGMap } from "@/features/rpgen/utils/map";
import { ANIMATION_SPRITE_FLIP_INTERVAL } from "@/features/rpgen/utils/sprite";

export type RendererContext = {
  context: CanvasRenderingContext2D;
  chipSize: number;
  rpgMap: RPGMap;
};

export class HumanRenderer {
  static readonly ID = "human";

  static readonly #FLIPS = 2;

  readonly #context: RendererContext;

  constructor(context: RendererContext) {
    this.#context = context;
  }

  #flip = 0;

  render(): void {
    const flip = this.#flip;
    const { context, chipSize, rpgMap } = this.#context;

    for (const human of rpgMap.humans) {
    }
  }

  tick(time: DOMHighResTimeStamp): void {
    this.#flip =
      ((time / ANIMATION_SPRITE_FLIP_INTERVAL) | 0) % HumanRenderer.#FLIPS;
  }
}
