import type { Position } from "@/features/rpgen/types/types";

/**
 * Classification of Sprite.
 */
export enum SpriteType {
  /**
   * Standard still DQ material.
   */
  DQStillSprite,
  /**
   * Standard animation DQ material.
   */
  DQAnimationSprite,
  /**
   * User-created still material.
   */
  CustomStillSprite,
  /**
   * User-created animation material.
   */
  CustomAnimationSprite,
}

export enum DQAnimationSpriteSurface {
  /**
   * 勇者
   */
  Hero = 0,
  /**
   * 王様
   */
  King = 20,
  /**
   * 姫
   */
  Princess = 8,
  /**
   * 兵士A
   */
  SoldierA = 18,
  /**
   * 兵士B
   */
  SoldierB = 1,
  /**
   * 商人
   */
  Merchant = 2,
  /**
   * 武器商人
   */
  WeaponMerchant = 7,
  /**
   * 防具商人
   */
  ArmorMerchant = 13,
  /**
   * 戦士A
   */
  WarriorA = 6,
  /**
   * 戦士B
   */
  WarriorB = 12,
  /**
   * 老人A
   */
  ElderlyA = 3,
  /**
   * 老人B
   */
  ElderlyB = 5,
  /**
   * 老人C
   */
  ElderlyC = 10,
  /**
   * 女A
   */
  WomanA = 9,
  /**
   * 女B
   */
  WomanB = 11,
  /**
   * 女C
   */
  WomanC = 15,
  /**
   * 女D
   */
  WomanD = 17,
  /**
   * 男A
   */
  ManA = 14,
  /**
   * 男B
   */
  ManB = 16,
  /**
   * 尼
   */
  Bhikkhuni = 21,
  /**
   * 子供
   */
  Child = 4
}

export type DQAnimationSprite = {
  type: SpriteType.DQAnimationSprite,
  surface: DQAnimationSpriteSurface
};

export type DQStillSprite = {
  type: SpriteType.DQStillSprite,
  surface: Position
};

export type CustomAnimationSprite = {
  type: SpriteType.CustomAnimationSprite,
  id: number
};

export type CustomStillSprite = {
  type: SpriteType.CustomStillSprite,
  id: number
};

export type DQSprite = DQAnimationSprite | DQStillSprite;

export type CustomSprite = CustomAnimationSprite | CustomStillSprite;

export type AnimationSprite = DQAnimationSprite | CustomAnimationSprite;

export type StillSprite = DQStillSprite | CustomStillSprite;

export type Sprite = AnimationSprite | StillSprite;

export type HumanSprite = DQAnimationSprite | CustomSprite;
