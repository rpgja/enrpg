import { LookPoint } from "../types/look-point";
import { Human, HumanBehavior } from "../types/human";
import { Direction, Position } from "../types/types";
import { DQAnimationSpriteSurface, Sprite, SpriteType } from "../types/sprite";
import { TreasureBoxPoint } from "../types/treasure-box-point";
import { TileMap } from "./tile";
import { TeleportPoint } from "../types/teleport-point";
import { EventPoint } from "../types/event-point";

export type RPGMapInit = {
  initialHeroPosition?: Position,
  backgroundImageUrl?: string,
  bgmUrl?: string,
  lookPoints?: LookPoint[],
  eventPoints?: EventPoint[],
  teleportPoints?: TeleportPoint[],
  humans?: Human[],
  treasureBoxPoints?: TreasureBoxPoint[],
  floor: TileMap,
  objects: TileMap
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

  static readonly #DEFAULT_BACKGROUND_IMAGE_URL = "http://i.imgur.com/qiN1und.jpg";

  constructor(init: RPGMapInit) {
    this.initialHeroPosition = init.initialHeroPosition ?? { x: 0, y: 0 };
    this.backgroundImageUrl = init.backgroundImageUrl ?? RPGMap.#DEFAULT_BACKGROUND_IMAGE_URL;
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

  static *#parseChunks(input: string, termination: string | ((chunkName: string) => string)): IterableIterator<[name: string, value: string]> {
    const len = input.length;
    const WHITESPACE = this.#WHITESPACE;
    const NON_WHITESPACE = this.#NON_WHITESPACE;

    for (let pos = 0; pos < len; pos++) {
      // skip whitespaces
      while (pos < len && WHITESPACE.test(input[pos]!)) {
        pos++;
      }

      if (input[pos] !== "#") {
        continue;
      }


      // skip "#"
      pos++;

      let name = "";

      while (pos < len && NON_WHITESPACE.test(input[pos]!)) {
        name += input[pos++];
      }

      let value = "";

      const term = typeof termination === "function" ? termination(name) : termination;
      const termLen = term.length;

      while (pos < len && input.slice(pos, pos + termLen) !== term) {
        value += input[pos++];
      }

      pos += termLen;

      yield [name, value];
    }
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
            y: Number(y)
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
          const [rawSprite, x, y, direction, behavior, speed, message = ""] = value.trim().split(",");
          let sprite: Sprite;

          switch (rawSprite?.[0]) {
            case "A": {
              sprite = {
                type: SpriteType.CustomAnimationSprite,
                id: Number(rawSprite.slice(1))
              }

              break;
            }

            case "-": {
              sprite = {
                type: SpriteType.CustomStillSprite,
                id: Number(rawSprite.slice(1))
              }

              break;
            }

            default: {
              sprite = {
                type: SpriteType.DQAnimationSprite,
                surface: Number(rawSprite) as DQAnimationSpriteSurface
              };

              break;
            }
          }

          humans.push({
            sprite,
            message,
            position: {
              x: Number(x),
              y: Number(y)
            },
            direction: Number(direction) as Direction,
            behavior: Number(behavior) as HumanBehavior,
            speed: Number(speed)
          });

          break;
        }

        case "TBOX": {
          const [x, y, message] = value.trimStart().split(",");

          treasureBoxPoints.push({
            position: {
              x: Number(x),
              y: Number(y)
            },
            message: message ?? ""
          });

          break;
        }

        case "SPOINT": {
          const [x, y, once, message] = value.trimStart().split(",");

          lookPoints.push({
            position: {
              x: Number(x),
              y: Number(y)
            },
            once: once === "1",
            message: message ?? ""
          });

          break;
        }

        case "MPOINT": {
          const [x, y, destMapId, destX, destY] = value.trim().split(",");

          teleportPoints.push({
            position: {
              x: Number(x),
              y: Number(y)
            },
            destination: {
              mapId: Number(destMapId),
              position: {
                x: Number(destX),
                y: Number(destY)
              }
            }
          });

          break;
        }

        case "EPOINT": {
          // TODO
          console.log(RPGMap.#parseChunks.bind(this));

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
          console.group("No Parser");
          // TODO: error message
          console.warn(`No parser for ${name}`);
          console.warn(value);
          console.groupEnd();

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
      floor
    });
  }
}
