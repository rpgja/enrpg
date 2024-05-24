import { Renderer } from "@/features/editor/utils/renderer";
import type { RPGMap } from "@/features/rpgen/utils/map";

export class Editor {
  readonly renderer: Renderer;

  constructor(rpgMap: RPGMap) {
    this.renderer = new Renderer(rpgMap);
    this.renderer.startTicking();
  }
}
