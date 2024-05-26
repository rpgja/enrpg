import { logger } from "@/utils/logger";
import {
  type Command,
  CommandType,
  ManipulateGoldCommandOperation,
} from "../types/command";
import {
  type EventPoint,
  EventTiming,
  type SecondaryEventPhase,
} from "../types/event-point";
import type { Human, HumanBehavior } from "../types/human";
import type { LookPoint } from "../types/look-point";
import {
  type DQAnimationSpriteSurface,
  type Sprite,
  SpriteType,
} from "../types/sprite";
import type { TeleportPoint } from "../types/teleport-point";
import type { TreasureBoxPoint } from "../types/treasure-box-point";
import type { Direction, Position } from "../types/types";
import { escapeMetaChars, unescapeMetaChars } from "./escape";
import { TileMap } from "./tile";

export type RPGMapInit = {
  initialHeroPosition?: Position;
  backgroundImageUrl?: string;
  bgmUrl?: string;
  lookPoints?: LookPoint[];
  eventPoints?: EventPoint[];
  teleportPoints?: TeleportPoint[];
  humans?: Human[];
  treasureBoxPoints?: TreasureBoxPoint[];
  floor: TileMap;
  objects: TileMap;
};

export class RPGMap {
  readonly initialHeroPosition: Position;
  readonly backgroundImageUrl: string;
  readonly bgmUrl?: string;
  readonly teleportPoints: TeleportPoint[];
  readonly lookPoints: LookPoint[];
  readonly humans: Human[];
  readonly eventPoints: EventPoint[];
  readonly treasureBoxPoints: TreasureBoxPoint[];
  readonly objects: TileMap;
  readonly floor: TileMap;

  static readonly #DEFAULT_BACKGROUND_IMAGE_URL =
    "http://i.imgur.com/qiN1und.jpg";

  constructor(init: RPGMapInit) {
    this.initialHeroPosition = init.initialHeroPosition ?? { x: 0, y: 0 };
    this.backgroundImageUrl =
      init.backgroundImageUrl ?? RPGMap.#DEFAULT_BACKGROUND_IMAGE_URL;
    this.bgmUrl = init.bgmUrl;
    this.lookPoints = init.lookPoints ?? [];
    this.eventPoints = init.eventPoints ?? [];
    this.teleportPoints = init.teleportPoints ?? [];
    this.humans = init.humans ?? [];
    this.treasureBoxPoints = init.treasureBoxPoints ?? [];
    this.objects = init.objects;
    this.floor = init.floor;
  }

  static readonly #WHITESPACE = /\s/;
  static readonly #NON_WHITESPACE = /\S/;

  static *#parseChunks(
    input: string,
    termination: string | ((chunkName: string) => string),
  ): IterableIterator<[name: string, value: string]> {
    const len = input.length;
    const WHITESPACE = RPGMap.#WHITESPACE;
    const NON_WHITESPACE = RPGMap.#NON_WHITESPACE;

    for (let pos = 0; pos < len; pos++) {
      // skip whitespaces
      while (pos < len && WHITESPACE.test(input[pos] as string)) {
        pos++;
      }

      if (input[pos] !== "#") {
        continue;
      }

      // skip "#"
      pos++;

      let name = "";

      while (pos < len && NON_WHITESPACE.test(input[pos] as string)) {
        name += input[pos++];
      }

      let value = "";

      const term =
        typeof termination === "function" ? termination(name) : termination;
      const termLen = term.length;

      while (pos < len && input.slice(pos, pos + termLen) !== term) {
        value += input[pos++];
      }

      pos += termLen;

      yield [name, value];
    }
  }

  static #parseCommaSeparatedParams(input: string): Record<string, string> {
    const params: Partial<Record<string, string>> = {};

    for (const [name, value = ""] of input
      .split(",")
      .map((v) => v.split(":"))) {
      if (!name) {
        continue;
      }

      params[name] = value;
    }

    return params as Record<string, string>;
  }

  static #parseCommands(input: string): Command[] {
    const commands: Command[] = [];

    for (const [name, value] of RPGMap.#parseChunks(input, "#ED")) {
      const params = RPGMap.#parseCommaSeparatedParams(value.trimStart());

      // TODO
      switch (name) {
        case "MSG": {
          commands.push({
            type: CommandType.DisplayMessage,
            message: params.m ?? "",
          });

          break;
        }

        case "PL_GALD": {
          commands.push({
            type: CommandType.ManipulateGold,
            operation: ManipulateGoldCommandOperation.Addition,
            value: Number(params.v),
          });

          break;
        }

        default: {
          // TODO: error message
          logger.warn(`No command parser\n---${name}---\n${value}`);

          break;
        }
      }
    }

    return commands;
  }

  static parse(input: string): RPGMap {
    const lookPoints: LookPoint[] = [];
    const treasureBoxPoints: TreasureBoxPoint[] = [];
    const teleportPoints: TeleportPoint[] = [];
    const eventPoints: EventPoint[] = [];
    const floor = new TileMap();
    const objects = new TileMap();
    const humans: Human[] = [];
    let bgmUrl: string | undefined;
    let backgroundImageUrl: string | undefined;
    let initialHeroPosition: Position | undefined;

    for (const [name, value] of RPGMap.#parseChunks(input, "#END")) {
      switch (name) {
        case "HERO": {
          const [x, y] = value.trim().split(",");

          initialHeroPosition = {
            x: Number(x),
            y: Number(y),
          };

          break;
        }

        case "BGM": {
          bgmUrl = value.trim();

          break;
        }

        case "BGIMG": {
          backgroundImageUrl = value.trim();

          break;
        }

        case "HUMAN": {
          const [rawSprite, x, y, direction, behavior, speed, message = ""] =
            value.trim().split(",");
          let sprite: Sprite;

          switch (rawSprite?.[0]) {
            case "A": {
              sprite = {
                type: SpriteType.CustomAnimationSprite,
                id: Number(rawSprite.slice(1)),
              };

              break;
            }

            case "-": {
              sprite = {
                type: SpriteType.CustomStillSprite,
                id: Number(rawSprite.slice(1)),
              };

              break;
            }

            default: {
              sprite = {
                type: SpriteType.DQAnimationSprite,
                surface: Number(rawSprite) as DQAnimationSpriteSurface,
              };

              break;
            }
          }

          humans.push({
            sprite,
            message: unescapeMetaChars(message),
            position: {
              x: Number(x),
              y: Number(y),
            },
            direction: Number(direction) as Direction,
            behavior: Number(behavior) as HumanBehavior,
            speed: Number(speed),
          });

          break;
        }

        case "TBOX": {
          const [x, y, message] = value.trimStart().split(",");

          treasureBoxPoints.push({
            position: {
              x: Number(x),
              y: Number(y),
            },
            message: unescapeMetaChars(message ?? ""),
          });

          break;
        }

        case "SPOINT": {
          const [x, y, once, message] = value.trimStart().split(",");

          lookPoints.push({
            position: {
              x: Number(x),
              y: Number(y),
            },
            once: once === "1",
            message: unescapeMetaChars(message ?? ""),
          });

          break;
        }

        case "MPOINT": {
          const [x, y, destMapId, destX, destY] = value.trim().split(",");

          teleportPoints.push({
            position: {
              x: Number(x),
              y: Number(y),
            },
            destination: {
              mapId: Number(destMapId),
              position: {
                x: Number(destX),
                y: Number(destY),
              },
            },
          });

          break;
        }

        // TODO
        case "EPOINT": {
          const [, pos = "", body = ""] =
            value.trimStart().match(/^(tx:\d+,ty:\d+),\r?\n(.+)$/s) ?? [];
          const { tx, ty } = RPGMap.#parseCommaSeparatedParams(pos);
          const eventPoint: EventPoint = {
            position: {
              x: Number(tx),
              y: Number(ty),
            },
            phases: [
              {
                timing: EventTiming.Look,
                sequence: [],
              },
              {
                timing: EventTiming.Look,
                condition: {},
                sequence: [],
              },
              {
                timing: EventTiming.Look,
                condition: {},
                sequence: [],
              },
              {
                timing: EventTiming.Look,
                condition: {},
                sequence: [],
              },
            ],
          };

          for (const [name, value] of RPGMap.#parseChunks(
            body,
            (name) => `#PHEND${name.at(-1)}`,
          )) {
            const phase = eventPoint.phases[Number(name.at(-1))];

            if (!phase) {
              continue;
            }

            const [, cond = "", body = ""] =
              value.trimStart().match(/(.+?),\r?\n(.+)/s) ?? [];
            const { tm, sw, g } = RPGMap.#parseCommaSeparatedParams(cond);

            if (tm) {
              phase.timing = Number(tm);
            }

            // Non primary phase and has phase condition
            if (name !== "PH0") {
              if (sw) {
                (phase as SecondaryEventPhase).condition.switch = Number(sw);
              }

              if (g) {
                (phase as SecondaryEventPhase).condition.gold = Number(g);
              }
            }

            phase.sequence = RPGMap.#parseCommands(body);
          }

          eventPoints.push(eventPoint);

          break;
        }

        case "FLOOR":
        case "MAP": {
          const tileMap = name === "FLOOR" ? floor : objects;
          const body = value.replace(/^\r?\n/, "");

          for (const [y, line] of body.split(/\r?\n/).entries()) {
            for (const [x, rawTile] of line.split(" ").entries()) {
              tileMap.set(x, y, rawTile);
            }
          }

          break;
        }

        default: {
          // TODO: error message
          logger.warn(`No parser\n---${name}---\n${value}`);

          break;
        }
      }
    }

    return new RPGMap({
      initialHeroPosition,
      humans,
      lookPoints,
      bgmUrl,
      eventPoints,
      backgroundImageUrl,
      treasureBoxPoints,
      teleportPoints,
      objects,
      floor,
    });
  }

  toString(): string {
    let str = "";
    if (this.initialHeroPosition) {
      str += "#HERO\n";
      str += `${this.initialHeroPosition.x},${this.initialHeroPosition.y}#END\n`;
      str += "\n";
    }
    if (this.bgmUrl) {
      str += "#BGM\n";
      str += `${this.bgmUrl}#END\n`;
      str += "\n";
    }
    if (this.backgroundImageUrl) {
      str += "#BGIMG\n";
      str += `${this.backgroundImageUrl}#END\n`;
      str += "\n";
    }
    if (this.floor) {
      // ToDo: 実装
    }
    if (this.objects) {
      // ToDo: 実装
    }
    if (this.humans) {
      for (const human of this.humans) {
        str += "#HUMAN\n";
        const id = (() => {
          switch (human.sprite.type) {
            case SpriteType.DQAnimationSprite:
              return human.sprite.surface;
            case SpriteType.CustomAnimationSprite:
              return `A${human.sprite.id}`;
            case SpriteType.CustomStillSprite:
              return `-${human.sprite.id}`;
          }
        })();
        str += `${id},${human.position.x},${human.position.y},${
          human.direction
        },${human.behavior},${human.speed},${escapeMetaChars(
          human.message,
        )}#END\n`;
        str += "\n";
      }
    }
    if (this.treasureBoxPoints) {
      for (const p of this.treasureBoxPoints) {
        str += "#TBOX\n";
        str += `${p.position.x},${p.position.y},${escapeMetaChars(
          p.message,
        )}#END\n`;
        str += "\n";
      }
    }
    if (this.teleportPoints) {
      for (const p of this.teleportPoints) {
        str += "#MPOINT\n";
        str += `${p.position.x},${p.position.y},${p.destination.mapId},${p.position.x},${p.position.y}#END\n`;
        str += "\n";
      }
    }
    if (this.lookPoints) {
      for (const p of this.lookPoints) {
        str += "#SPOINT\n";
        str += `${p.position.x},${p.position.y},${
          p.once ? 1 : 0
        },${escapeMetaChars(p.message)}#END\n`;
        str += "\n";
      }
    }
    if (this.eventPoints) {
      // ToDo: 実装
    }
    return str;
  }
}
