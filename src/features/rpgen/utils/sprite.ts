import type { DQAnimationSpriteSurface } from "../types/sprite";
import type { Direction, Position } from "../types/types";

export const ANIMATION_SPRITE_FLIP_INTERVAL = 600;

export const RPGEN_CHIP_SIZE = 16;

export const getDQAnimationSpritePosition = (
  surface: DQAnimationSpriteSurface,
  direction: Direction,
  frame = 0,
): Position => {
  const half = surface / 2;
  const ySpacing = 15 + 15 * Math.round(half) + 17 * Math.floor(half);
  const directionYOffset = direction * 32;
  const y = directionYOffset + ySpacing + 16 * 7 * surface;
  const x = 4 + (16 + 32) * frame;

  return {
    x,
    y,
  };
};

const walkableTiles = new Set([
  "0_8",
  "0_12",
  "1_12",
  "2_15",
  "3_8",
  "3_12",
  "4_12",
  "4_13",
  "4_14",
  "4_15",
  "5_12",
  "5_13",
  "5_14",
  "6_0",
  "6_10",
  "6_11",
  "7_13",
  "7_14",
  "8_13",
  "9_0",
  "9_8",
  "9_12",
  "12_1",
  "12_4",
  "12_9",
  "12_10",
  "13_0",
  "13_1",
  "13_2",
  "13_3",
  "13_4",
  "13_6",
  "13_7",
  "13_8",
  "13_9",
  "13_10",
  "14_0",
  "14_2",
  "14_3",
  "14_4",
  "14_5",
  "14_9",
  "14_10",
  "15_1",
  "15_2",
  "15_4",
  "15_5",
  "15_6",
  "15_7",
  "15_10",
  "16_1",
  "16_4",
  "16_5",
  "16_6",
  "16_13",
  "16_14",
  "17_4",
  "17_6",
  "17_7",
  "17_13",
  "17_14",
  "22_2",
  "1_10",
  "1_11",
  "5_15",
  "6_13",
  "6_15",
  "8_12",
  "9_10",
  "10_9",
  "10_12",
  "10_13",
  "10_14",
  "14_8",
  "17_0",
  "17_1",
  "17_5",
  "18_11",
  "19_10",
  "24_12",
  "24_13",
  "25_4",
  "26_4",
  "26_14",
  "26_15",
  "29_0",
  "29_1",
  "10_10",
  "10_11",
  "19_1",
  "20_1",
  "21_9",
  "22_9",
  "24_14",
  "24_15",
  "25_14",
  "25_15",
  "26_6",
  "27_6",
  "28_2",
  "28_3",
  "28_15",
  "29_2",
  "29_3",
  "26_2",
  "26_3",
  "27_2",
  "27_3",
  "2_12",
  "9_15",
  "10_15",
  "11_9",
  "11_10",
  "15_0",
  "16_0",
  "17_2",
  "24_4",
  "26_10",
  "26_11",
  "27_10",
  "27_11",
  "28_5",
  "28_6",
  "28_10",
  "28_11",
  "28_12",
  "28_13",
  "29_5",
  "29_6",
  "29_10",
  "29_11",
  "29_12",
  "29_13",
]);
export const checkWalkableTile = (rawTile: string) =>
  walkableTiles.has(rawTile);

const damageTiles = new Set(["6_0", "12_1", "13_6", "13_7"]);
export const checkDamageTile = (rawTile: string) => damageTiles.has(rawTile);

const tableTiles = new Set([
  "14_1",
  "21_14",
  "22_13",
  "23_13",
  "20_9",
  "29_9",
  "29_15",
]);
export const checkTableTile = (rawTile: string) => tableTiles.has(rawTile);

const treasureBoxTiles = new Set([
  "16_2",
  "22_15",
  "24_5",
  "24_6",
  "25_5",
  "26_5",
  "27_5",
  "18_15",
  "20_15",
  "22_15",
  "22_14",
  "24_7",
  "26_7",
  "29_7",
  "24_8",
  "19_15",
  "21_15",
  "23_15",
  "23_14",
  "25_7",
  "27_7",
  "28_7",
  "25_8",
]);
export const checkTreasureBoxTile = (rawTile: string) =>
  treasureBoxTiles.has(rawTile);

const doorTiles = new Set([
  "12_2",
  "18_13",
  "19_13",
  "25_10",
  "27_14",
  "20_13",
  "21_13",
  "25_11",
  "25_12",
  "24_3",
  "25_3",
]);
export const checkDoorTile = (rawTile: string) => doorTiles.has(rawTile);

export const TILE_OF_BBS = "11_13";
export const TILE_OF_BOOK = "6_9";
export const TILE_OF_INTERNET = "7_9";

const teleportPointTiles = new Set(["13_8", "15_6", "15_10"]);
export const checkTeleportPointTile = (rawTile: string) =>
  teleportPointTiles.has(rawTile);
