import type { RPGMap } from "@/features/rpgen/utils/map";
import { RendererContext } from "./renderer";

export class Stage {
  readonly context: RendererContext;

  constructor(rpgMap: RPGMap) {
    const context = new RendererContext(rpgMap);

    this.context = context;
  }

  destroyed = false;

  destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
  }
}
