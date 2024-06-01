import { SpriteType } from "@/features/rpgen/types/sprite";
import {
  ANIMATION_SPRITE_FLIP_INTERVAL,
  getDQAnimationSpritePosition,
} from "@/features/rpgen/utils/sprite";
import { type Renderer, RendererContext } from "../utils/renderer";

export class HumanRenderer implements Renderer {
  static readonly ID = "human";

  static readonly #FLIPS = 2;

  readonly #context: RendererContext;

  constructor(context: RendererContext) {
    this.#context = context;
  }

  #flip = 0;

  static readonly #DQ_ANIMATION_SPRITE_IMAGE_SRC =
    "https://rpgen.site/dq/img/dq/char.png";

  static readonly #CUSTOM_ANIMATION_SPRITE_IMAGE_SRC =
    "https://rpgen.pw/dq/sAnims/res/{}.png";

  static readonly #CUSTOM_STILL_SPRITE_IMAGE_SRC =
    "https://rpgen.site/dq/sprites/{}/sprite.png";

  render(): void {
    const flip = this.#flip;
    const context = this.#context;
    const { chipSize, rpgMap, camera } = context;

    for (const human of rpgMap.humans) {
      switch (human.sprite.type) {
        case SpriteType.DQAnimationSprite: {
          const surface = getDQAnimationSpritePosition(
            human.sprite.surface,
            human.direction,
            flip,
          );

          context.renderChip(
            HumanRenderer.#DQ_ANIMATION_SPRITE_IMAGE_SRC,
            surface.x,
            surface.y,
            RendererContext.RPGEN_BASE_CHIP_SIZE,
            RendererContext.RPGEN_BASE_CHIP_SIZE,
            human.position.x,
            human.position.y,
          );

          break;
        }

        case SpriteType.CustomStillSprite: {
          context.renderChip(
            HumanRenderer.#CUSTOM_STILL_SPRITE_IMAGE_SRC
              .split("{}")
              .join(human.sprite.id.toString()),
            0,
            0,
            RendererContext.RPGEN_BASE_CHIP_SIZE,
            RendererContext.RPGEN_BASE_CHIP_SIZE,
            human.position.x,
            human.position.y,
          );

          break;
        }

        case SpriteType.CustomAnimationSprite: {
          context.renderChip(
            HumanRenderer.#CUSTOM_ANIMATION_SPRITE_IMAGE_SRC
              .split("{}")
              .join(human.sprite.id.toString()),
            0,
            0,
            RendererContext.RPGEN_BASE_CHIP_SIZE * flip,
            RendererContext.RPGEN_BASE_CHIP_SIZE * human.direction,
            human.position.x,
            human.position.y,
          );

          break;
        }
      }
    }
  }

  tick(time: DOMHighResTimeStamp): void {
    this.#flip =
      ((time / ANIMATION_SPRITE_FLIP_INTERVAL) | 0) % HumanRenderer.#FLIPS;
  }
}
