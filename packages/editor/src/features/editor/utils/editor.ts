import { Renderer } from "@/features/editor/utils/renderer";
import type { RPGMap } from "rpgen-map";

export class Editor {
  readonly renderer: Renderer;

  constructor(rpgMap: RPGMap) {
    this.renderer = new Renderer(rpgMap);
  }

  mounted = false;

  mount(parentElement: HTMLElement): void {
    if (this.mounted) {
      this.unmount();
    }

    const renderer = this.renderer;

    parentElement.append(renderer.canvas);
    renderer.startTicking();
    this.mounted = true;
  }

  unmount(): void {
    if (!this.mounted) {
      return;
    }

    const renderer = this.renderer;

    renderer.stopTicking();
    renderer.camera.detachElement();
    renderer.pointer.detachElement();
    renderer.canvas.remove();
    this.mounted = false;
  }
}
