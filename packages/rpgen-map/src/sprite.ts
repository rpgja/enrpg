import type { DQAnimationSpriteSurface } from "@/types/sprite.js";
import type { Direction, Position } from "@/types/types.js";

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
  } as const;
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

const castRawTileToSurface = (rawTile: string): Position => {
  const surface = rawTile.split("_");
  if (surface.length === 2) {
    return {
      x: Number(surface[0]),
      y: Number(surface[1]),
    } as const;
  }
  return { x: 0, y: 0 } as const; // ToDo: 適切な異常値か検討の余地あり
};

export const TILE_OF_BBS = "11_13";
export const TILE_OF_BOOK = "6_9";
export const TILE_OF_INTERNET = "7_9";

export const TILE_OF_TELEPORT = "23_7";
export const TILE_OF_LOOK = "22_8";
export const TILE_OF_EVENT = "7_8";

export const tileOfTeleport = castRawTileToSurface(TILE_OF_TELEPORT);
export const tileOfLook = castRawTileToSurface(TILE_OF_LOOK);
export const tileOfEvent = castRawTileToSurface(TILE_OF_EVENT);

const teleportPointTiles = new Set(["13_8", "15_6", "15_10"]);
export const checkTeleportPointTile = (rawTile: string) =>
  teleportPointTiles.has(rawTile);

const movingFloorTiles = new Set(["16_13", "16_14", "17_13", "17_14"]);
export const checkMovingFloorTile = (rawTile: string) =>
  movingFloorTiles.has(rawTile);

export const tilesLogicalName = {
  "0_0": "海（四方囲まれ）",
  "0_1": "海（左右囲まれ）",
  "0_2": "海（上下囲まれ）",
  "0_3": "海",
  "0_4": "夜の海（四方囲まれ）",
  "0_5": "夜の海（左右囲まれ）",
  "0_6": "夜の海（上下囲まれ）",
  "0_7": "夜の海",
  "0_8": "野原",
  "0_9": "透明",
  "0_10": "台座（左上）",
  "0_11": "台座（左下）",
  "0_12": "大樹　野原",
  "0_13": "ピラミッドパーツ（左上）",
  "0_14": "ピラミッドパーツ（左）",
  "0_15": "ピラミッドパーツ（左下）",

  "1_0": "赤い海（四方囲まれ）",
  "1_1": "赤い海（左右囲まれ）",
  "1_2": "赤い海（上下囲まれ）",
  "1_3": "赤い海",
  "1_4": "夜の海（四方囲まれ）",
  "1_5": "夜の海（左右囲まれ）",
  "1_6": "夜の海（上下囲まれ）",
  "1_7": "夜の海",
  "1_8": "透明",
  "1_9": "透明",
  "1_10": "台座（上）",
  "1_11": "台座（下）",
  "1_12": "がいこつ",
  "1_13": "ピラミッドパーツ（右上）",
  "1_14": "ピラミッドパーツ（中央）",
  "1_15": "ピラミッドパーツ（右下）",

  "2_0": "海（四方囲まれ）",
  "2_1": "海（左右囲まれ）",
  "2_2": "海（上下囲まれ）",
  "2_3": "海",
  "2_4": "夜の海（四方囲まれ）",
  "2_5": "夜の海（左右囲まれ）",
  "2_6": "夜の海（上下囲まれ）",
  "2_7": "夜の海",
  "2_8": "透明",
  "2_9": "透明",
  "2_10": "台座（右上）",
  "2_11": "台座（右下）",
  "2_12": "ピラミッド",
  "2_13": "ピラミッドパーツ（壁上）",
  "2_14": "ピラミッドパーツ（壁）",
  "2_15": "灰色野原",

  "3_0": "海（明るめ・四方囲まれ）",
  "3_1": "海（明るめ・左右囲まれ）",
  "3_2": "海（明るめ・上下囲まれ）",
  "3_3": "海（明るめ）",
  "3_4": "海（より明るめ）",
  "3_5": "海（より明るめ）",
  "3_6": "海（より明るめ）",
  "3_7": "海（より明るめ）",
  "3_8": "草原　野原",
  "3_9": "1マスベッド（左向き）",
  "3_10": "岩（上）",
  "3_11": "岩（下）",
  "3_12": "山　野原",
  "3_13": "ピラミッドパーツ（左）",
  "3_14": "ピラミッドパーツ（右）",
  "3_15": "ピラミッドパーツ（右下）",

  "4_0": "海（明るめ・四方囲まれ）",
  "4_1": "海（明るめ・左右囲まれ）",
  "4_2": "海（明るめ・上下囲まれ）",
  "4_3": "海（明るめ）",
  "4_4": "炎",
  "4_5": "炎",
  "4_6": "炎",
  "4_7": "炎",
  "4_8": "野原",
  "4_9": "1マスベッド（右向き）",
  "4_10": "石像（左上）",
  "4_11": "石像（左下）",
  "4_12": "大樹　雪の大地",
  "4_13": "青い床",
  "4_14": "灰色の床",
  "4_15": "紺碧の床",

  "5_0": "海（明るめ・四方囲まれ）",
  "5_1": "海（明るめ・左右囲まれ）",
  "5_2": "海（明るめ・上下囲まれ）",
  "5_3": "海（明るめ）",
  "5_4": "海（より明るめ）",
  "5_5": "海（より明るめ）",
  "5_6": "海（より明るめ）",
  "5_7": "海（より明るめ）",
  "5_8": "草原　野原",
  "5_9": "1マスベッド（上向き）",
  "5_10": "石像（右上）",
  "5_11": "石像（右下）",
  "5_12": "朱色地面",
  "5_13": "朱色床",
  "5_14": "水色床",
  "5_15": "大階段（左）",

  "6_0": "毒",
  "6_1": "毒",
  "6_2": "毒",
  "6_3": "毒",
  "6_4": "石壁（左）",
  "6_5": "石壁（左上）",
  "6_6": "石壁（左中）",
  "6_7": "石壁（左下）",
  "6_8": "岩山　野原",
  "6_9": "本",
  "6_10": "空",
  "6_11": "濃い水色",
  "6_12": "石の机",
  "6_13": "板チョコ床",
  "6_14": "砕け岩",
  "6_15": "大階段（右）",

  "7_0": "野原",
  "7_1": "毒",
  "7_2": "毒",
  "7_3": "毒",
  "7_4": "野原",
  "7_5": "石壁（中上）",
  "7_6": "石壁（中中）",
  "7_7": "石壁（中下）",
  "7_8": "透明",
  "7_9": "インターネット",
  "7_10": "氷壁（上）",
  "7_11": "氷壁（下）",
  "7_12": "井戸1",
  "7_13": "網目床",
  "7_14": "石　土",
  "7_15": "岩礁",

  "8_0": "毒",
  "8_1": "毒",
  "8_2": "毒",
  "8_3": "毒",
  "8_4": "石壁（右）",
  "8_5": "石壁（右上）",
  "8_6": "石壁（右中）",
  "8_7": "石壁（右下）",
  "8_8": "透明",
  "8_9": "透明",
  "8_10": "氷壁（上）",
  "8_11": "氷壁（下）",
  "8_12": "階段（上）",
  "8_13": "模様床",
  "8_14": "岩",
  "8_15": "大海",

  "9_0": "砂漠",
  "9_1": "砂漠",
  "9_2": "砂漠",
  "9_3": "砂漠",
  "9_4": "城壁（左）",
  "9_5": "城壁（左上）",
  "9_6": "城壁（左中）",
  "9_7": "城壁（左下）",
  "9_8": "森　野原",
  "9_9": "杯",
  "9_10": "アーチ（上）",
  "9_11": "アーチ（下）",
  "9_12": "亀の甲",
  "9_13": "緑壁（上）",
  "9_14": "緑壁（下）",
  "9_15": "大洞窟（左）",

  "10_0": "野原",
  "10_1": "砂漠",
  "10_2": "砂漠",
  "10_3": "砂漠",
  "10_4": "野原",
  "10_5": "城壁（中上）",
  "10_6": "城壁（中中）",
  "10_7": "城壁（中下）",
  "10_8": "かがり火",
  "10_9": "金の躯",
  "10_10": "梯子（上）",
  "10_11": "梯子（下）",
  "10_12": "葉っぱ",
  "10_13": "葉っぱ（多い）",
  "10_14": "葉っぱ（少ない）",
  "10_15": "大洞窟（右）",

  "11_0": "砂漠",
  "11_1": "砂漠",
  "11_2": "砂漠",
  "11_3": "砂漠",
  "11_4": "城壁（右）",
  "11_5": "城壁（右上）",
  "11_6": "城壁（右中）",
  "11_7": "城壁（右下）",
  "11_8": "杭",
  "11_9": "町",
  "11_10": "洞窟",
  "11_11": "鎧像（上半身）",
  "11_12": "鎧像（下半身）",
  "11_13": "BBS",
  "11_14": "緑の像（上半身）",
  "11_15": "緑の像（下半身）",

  "12_0": "三角台座",
  "12_1": "ダメージ床（青）",
  "12_2": "扉（観音開き）",
  "12_3": "黒",
  "12_4": "赤レンガ",
  "12_5": "赤レンガ",
  "12_6": "波模様の壁",
  "12_7": "モザイクの壁",
  "12_8": "窓",
  "12_9": "草原　野原（濃い）",
  "12_10": "赤茶色の床",
  "12_11": "大岩（左上）",
  "12_12": "大岩（左下）",
  "12_13": "城壁（上）",
  "12_14": "城壁（中）",
  "12_15": "城壁（下）",

  "13_0": "壁っぽい床",
  "13_1": "橙色の土",
  "13_2": "葉っぱ（一面）",
  "13_3": "緑",
  "13_4": "赤紫",
  "13_5": "赤紫",
  "13_6": "ダメージ床（黒）",
  "13_7": "バリア",
  "13_8": "星（小）",
  "13_9": "雪の大地",
  "13_10": "草原　雪の大地",
  "13_11": "大岩（右上）",
  "13_12": "大岩（右下）",
  "13_13": "大柱（左上）",
  "13_14": "大柱（左下）",
  "13_15": "城壁（下・旗つき）",

  "14_0": "3本の木",
  "14_1": "台",
  "14_2": "肌色の床",
  "14_3": "水色",
  "14_4": "木の板の床",
  "14_5": "積木",
  "14_6": "肘かけ（上）",
  "14_7": "肘かけ（下）",
  "14_8": "板（縦）",
  "14_9": "森　雪の大地",
  "14_10": "山　雪の大地",
  "14_11": "木の壁（左上）",
  "14_12": "木の壁（左下）",
  "14_13": "大柱（右上）",
  "14_14": "大柱（右下）",
  "14_15": "幕",

  "15_0": "白い城",
  "15_1": "大山",
  "15_2": "4本の木",
  "15_3": "海（明るめ）",
  "15_4": "土",
  "15_5": "黒い野原",
  "15_6": "旅のトビラ",
  "15_7": "氷の床",
  "15_8": "木の板の床",
  "15_9": "岩山　雪の大地",
  "15_10": "星（大）",
  "15_11": "木の壁（右上）",
  "15_12": "木の壁（右下）",
  "15_13": "黄土色の壁（上）",
  "15_14": "黄土色の壁（下）",
  "15_15": "ライオンの立像",

  "16_0": "氷の洞窟",
  "16_1": "緑（ノイズあり）",
  "16_2": "宝箱（緑・正面・変化無）",
  "16_3": "海",
  "16_4": "赤紫色の床",
  "16_5": "絨毯",
  "16_6": "野原（濃い）",
  "16_7": "大海",
  "16_8": "看板（小）",
  "16_9": "複数の岩1",
  "16_10": "複数の岩2",
  "16_11": "土壁（上1）",
  "16_12": "土壁（下1）",
  "16_13": "動く床（上）",
  "16_14": "動く床（左）",
  "16_15": "マグマ",

  "17_0": "蛇（尾）",
  "17_1": "蛇（頭）",
  "17_2": "家",
  "17_3": "☓の壁",
  "17_4": "チェックの床",
  "17_5": "板（オレンジ）",
  "17_6": "大樹　野原（濃）",
  "17_7": "砂地",
  "17_8": "看板（大）",
  "17_9": "複数の岩3",
  "17_10": "複数の岩4",
  "17_11": "土壁（上2）",
  "17_12": "土壁（下2）",
  "17_13": "動く床（右）",
  "17_14": "動く床（下）",
  "17_15": "檻",

  "18_0": "機械（青1）",
  "18_1": "切り株（上）",
  "18_2": "切り株（下）",
  "18_3": "鳥居（左上）",
  "18_4": "鳥居（左下）",
  "18_5": "機械パーツ1",
  "18_6": "機械1（緑・左上）",
  "18_7": "機械1（緑・左下）",
  "18_8": "作",
  "18_9": "ライオン（右）",
  "18_10": "ライオン（左）",
  "18_11": "板（横）",
  "18_12": "ベッド（白・左向き・上）",
  "18_13": "扉（ドアノブつき）",
  "18_14": "植木",
  "18_15": "宝箱（黄色・正面・未開）",

  "19_0": "機械（青2）",
  "19_1": "木の階段（右）",
  "19_2": "木の板",
  "19_3": "鳥居（右上）",
  "19_4": "鳥居（右下）",
  "19_5": "機械パーツ2",
  "19_6": "機械1（緑・右上）",
  "19_7": "機械1（緑・右下）",
  "19_8": "者:",
  "19_9": "米俵",
  "19_10": "壊れた床",
  "19_11": "板（横）",
  "19_12": "ベッド（白・左向き・下）",
  "19_13": "扉（左右対称）",
  "19_14": "椅子",
  "19_15": "宝箱（黄色・正面・既開）",

  "20_0": "機械の壁（灰色）",
  "20_1": "木の階段（左）",
  "20_2": "木の壁（丁字）",
  "20_3": "木の壁（縦）",
  "20_4": "機械1（緑・左）",
  "20_5": "機械パーツ3",
  "20_6": "機械パーツ（左）",
  "20_7": "機械2（緑・左）",
  "20_8": "Felix",
  "20_9": "机（赤茶色）",
  "20_10": "道具屋の看板",
  "20_11": "玉座（左）",
  "20_12": "ベッド（白・右向き・下）",
  "20_13": "鉄の赤い扉",
  "20_14": "スロットマシン",
  "20_15": "宝箱（緑色・正面・未開）",

  "21_0": "機械の壁（緑色・横）",
  "21_1": "機械の壁（緑色・縦）",
  "21_2": "木の壁（横）",
  "21_3": "木の壁（横・下）",
  "21_4": "機械1（緑・右）",
  "21_5": "緑の壁",
  "21_6": "機械パーツ（中央）",
  "21_7": "機械2（緑・右）",
  "21_8": "さん",
  "21_9": "階段1（右）",
  "21_10": "武器屋の看板",
  "21_11": "玉座（中央）",
  "21_12": "ベッド（白・右向き・上）",
  "21_13": "檻の扉（濃い）",
  "21_14": "テーブル",
  "21_15": "宝箱（緑色・正面・既開）",

  "22_0": "機械2（緑・左上）",
  "22_1": "機械2（緑・左下）",
  "22_2": "木の床",
  "22_3": "壁",
  "22_4": "機械3（緑・左上）",
  "22_5": "機械3（緑・左下）",
  "22_6": "機械パーツ（右）",
  "22_7": "虎縞",
  "22_8": "しらべるポイント",
  "22_9": "階段1（左）",
  "22_10": "防具屋の看板",
  "22_11": "玉座（右）",
  "22_12": "肘かけ",
  "22_13": "大テーブル（左）",
  "22_14": "宝箱（赤色・正面・未開）",
  "22_15": "宝箱（青色・正面・未開）",

  "23_0": "機械2（緑・右上）",
  "23_1": "機械2（緑・右下）",
  "23_2": "不明",
  "23_3": "土壁",
  "23_4": "機械3（緑・右上）",
  "23_5": "機械3（緑・右下）",
  "23_6": "機械パーツ（縦）",
  "23_7": "マップ移動ポイント",
  "23_8": "女神（上半身）",
  "23_9": "女神（下半身）",
  "23_10": "宿屋の看板1",
  "23_11": "エンタシス（上）",
  "23_12": "エンタシス（下）",
  "23_13": "大テーブル（右）",
  "23_14": "宝箱（赤色・正面・既開）",
  "23_15": "宝箱（青色・正面・既開）",

  "24_0": "ベッド（赤縞・左向き・上）",
  "24_1": "鎧",
  "24_2": "大扉（左上・未開）",
  "24_3": "大扉（左下・未開）",
  "24_4": "村",
  "24_5": "宝箱（橙色・斜め・変化無）",
  "24_6": "宝箱（赤色・斜め・変化無）",
  "24_7": "宝箱（赤色・横・未開）",
  "24_8": "宝箱（青色・横・未開）",
  "24_9": "炎",
  "24_10": "宿屋の看板2",
  "24_11": "武器防具屋の看板1",
  "24_12": "椅子（背もたれあり）",
  "24_13": "椅子（背もたれなし）",
  "24_14": "階段1（上り・右）",
  "24_15": "階段1（下り・左）",

  "25_0": "ベッド（赤縞・左向き・下）",
  "25_1": "井戸2",
  "25_2": "大扉（右上・未開）",
  "25_3": "大扉（右下・未開）",
  "25_4": "花1",
  "25_5": "宝箱（黄色・斜め・変化無）",
  "25_6": "ひび",
  "25_7": "宝箱（赤色・横・既開）",
  "25_8": "宝箱（青色・横・既開）",
  "25_9": "炎",
  "25_10": "木の赤い扉",
  "25_11": "檻の扉（薄い）",
  "25_12": "鉄の扉",
  "25_13": "ベッド（赤・左向き・上）",
  "25_14": "階段1（上り・左）",
  "25_15": "階段1（下り・右）",

  "26_0": "ベッド（赤縞・右向き・下）",
  "26_1": "石の台1",
  "26_2": "大扉（左上・既開）",
  "26_3": "大扉（左下・既開）",
  "26_4": "花2",
  "26_5": "宝箱（緑色・斜め・変化無）",
  "26_6": "階段2（左）",
  "26_7": "宝箱（黄色・横・未開）",
  "26_8": "丸い装置（左上）",
  "26_9": "壺",
  "26_10": "城（薄い・左上）",
  "26_11": "城（薄い・左下）",
  "26_12": "本棚",
  "26_13": "ベッド（赤・左向き・下）",
  "26_14": "橋（横）",
  "26_15": "橋（縦）",

  "27_0": "ベッド（赤縞・右向き・上）",
  "27_1": "箪笥",
  "27_2": "大扉（右上・既開）",
  "27_3": "大扉（右下・既開）",
  "27_4": "ライオン（正面）",
  "27_5": "宝箱（青色・斜め・変化無）",
  "27_6": "階段2（右）",
  "27_7": "宝箱（黄色・横・既開）",
  "27_8": "丸い装置（右上）",
  "27_9": "石の台2",
  "27_10": "城（薄い・右上）",
  "27_11": "城（薄い・右下）",
  "27_12": "抽斗",
  "27_13": "テーブルクロスつきテーブル",
  "27_14": "穴あき扉",
  "27_15": "丸岩",

  "28_0": "通行止め",
  "28_1": "丸いテーブル",
  "28_2": "階段2（下り・左）",
  "28_3": "階段2（上り・右）",
  "28_4": "水桶",
  "28_5": "城（左上）",
  "28_6": "城（左下）",
  "28_7": "宝箱（緑色・横・未開）",
  "28_8": "丸い装置（左下）",
  "28_9": "椅子",
  "28_10": "1マスの塔",
  "28_11": "洞窟",
  "28_12": "お墓",
  "28_13": "町（左）",
  "28_14": "武器防具屋の看板2",
  "28_15": "階段3",

  "29_0": "橋（白・横）",
  "29_1": "小さな椅子",
  "29_2": "階段2（下り・右）",
  "29_3": "階段2（上り・左）",
  "29_4": "窯",
  "29_5": "城（右上）",
  "29_6": "城（右下）",
  "29_7": "宝箱（緑色・横・既開）",
  "29_8": "丸い装置（右下）",
  "29_9": "カウンター",
  "29_10": "塔（上）",
  "29_11": "塔（下）",
  "29_12": "祠",
  "29_13": "町（右）",
  "29_14": "宿屋の看板3",
  "29_15": "木の机",
} as const;