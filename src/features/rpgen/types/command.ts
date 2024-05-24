import type { HumanSprite, StillSprite } from "./sprite.js";
import type { Position } from "./types.js";

export enum CommandType {
  // Message
  DisplayMessage = 0,
  DisplayConfirm = 1,
  DisplaySelect = 2,
  ChangeMessageFont = 3,
  DisplayGold = 4,
  HideGold = 5,

  // Screen control
  Wait = 6,
  ScreenEffect = 7,
  ChangeWeather = 8,

  // Graphics
  ChangeObjectSprite = 9,
  ChangeHumanSprite = 10,
  ChangeSpriteColor = 11,
  DisplayImage = 12,
  DisplayAnimation = 13,

  ChangeBackgroundImage = 14,
  ChangeDistantView = 15,

  // Movement
  ChangeDirection = 16,
  MoveParty = 17,
  MoveNPC = 18,
  ChangeNPCBehavior = 19,
  ChangeMap = 20,
  MoveCamera = 21,

  // Sound
  ChangeBGM = 22,
  PlaySound = 23,

  // Switch
  SwitchOn = 24,
  SwitchOff = 25,

  // Number
  ManipulateGold = 26,

  // Events
  SaveAndLoad = 27,
  EndEvent = 28,
  DeleteEvent = 29,
  Goto = 30,
  Comment = 31,
}

export type DisplayMessageCommand = {
  type: CommandType.DisplayMessage;
  message: string;
};

export type DisplayConfirmCommand = {
  choices: [
    string, // yes
    string, // no
    ...string[], // additional choice
  ];
  displayPosition: Position;
  /**
   * 直前のメッセージを消さない
   */
  keepPreviousMessage: boolean;
};

// TODO
export type DisplaySelectCommand = {
  type: CommandType.DisplaySelect;
};

export type ChangeMessageFontCommand = {
  type: CommandType.ChangeMessageFont;
  fontFamily: string;
};

export type DisplayGoldCommand = {
  type: CommandType.DisplayGold;
};

export type HideGoldCommand = {
  type: CommandType.HideGold;
};

// Screen control

export type WaitCommand = {
  type: CommandType.Wait;
  delay: number;
};

// TODO
export type ScreenEffectCommand = {
  type: CommandType.ScreenEffect;
};

// TODO
export type ChangeWeatherCommand = {
  type: CommandType.ChangeWeather;
};

// Graphics

export type ChangeObjectSpriteCommand = {
  type: CommandType.ChangeObjectSprite;
  targetPosition: Position;
  sprite: StillSprite;
};

export type ChangeHumanSpriteCommand = {
  type: CommandType.ChangeHumanSprite;
  targetPosition?: Position;
  sprite: HumanSprite;
};

// TODO
export type ChangeSpriteColorCommand = {
  type: CommandType.ChangeSpriteColor;
};

// TODO
export type DisplayImageCommand = {
  type: CommandType.DisplayImage;
};

// TODO
export type DisplayAnimationCommand = {
  type: CommandType.DisplayAnimation;
};

export type ChangeBackgroundImageCommand = {
  type: CommandType.ChangeBackgroundImage;
  backgroundImageUrl: string;
};

// TODO
export type ChangeDistantViewCommand = {
  type: CommandType.ChangeDistantView;
};

// Movement
// TODO
export type ChangeDirectionCommand = {
  type: CommandType.ChangeDirection;
};

// TODO
export type MovePartyCommand = {
  type: CommandType.MoveParty;
};

// TODO
export type MoveNPCCommand = {
  type: CommandType.MoveNPC;
};

// TODO
export type ChangeNPCBehaviorCommand = {
  type: CommandType.ChangeNPCBehavior;
};

// TODO
export type ChangeMapCommand = {
  type: CommandType.ChangeMap;
};

// TODO
export type MoveCameraCommand = {
  type: CommandType.MoveCamera;
};

// Sound
// TODO
export type ChangeBGMCommand = {
  type: CommandType.ChangeBGM;
};

export enum PlaySoundCommandOperation {
  Play = "PL",
  Stop = "ST",
}

export type PlaySoundCommandFade = {
  progressAt: number;
  volumeFrom: number;
  voluteTo: number;
};

export type PlaySoundCommand =
  | {
      type: CommandType.PlaySound;
      soundEffectId: number;
      volume: number;
      loop: boolean;
      fade?: PlaySoundCommandFade;
      operation: PlaySoundCommandOperation.Play;
    }
  | {
      type: CommandType.PlaySound;
      operation: PlaySoundCommandOperation.Stop;
    };

// Switch

export type SwitchOnCommand = {
  type: CommandType.SwitchOn;
  switch: number;
};

export type SwitchOffCommand = {
  type: CommandType.SwitchOff;
  switch: number;
};

// Number

export enum ManipulateGoldCommandOperation {
  Addition = 0,
  Subtraction = 1,
  Double = 2,
  Set = 3,
}

export type ManipulateGoldCommand = {
  type: CommandType.ManipulateGold;
  value: number;
  operation: ManipulateGoldCommandOperation;
};

// Events

export type SaveAndLoadCommandCondition = {
  switch: boolean;
  gold: boolean;
  party: boolean;
  npc: boolean;
};

export enum SaveAndLoadCommandOperation {
  Save = 0,
  Load = 1,
}

export type SaveAndLoadCommand = {
  type: CommandType.SaveAndLoad;
  operation: SaveAndLoadCommandOperation;
  condition: SaveAndLoadCommandCondition;
};

export type EndEventCommand = {
  type: CommandType.EndEvent;
};

export type DeleteEventCommand = {
  type: CommandType.DeleteEvent;
};

export type GotoCommand = {
  type: CommandType.Goto;
  phase: number;
  eventPosition?: Position;
};

export type CommentCommand = {
  type: CommandType.Comment;
  message: string;
};

export type Command =
  // Message
  | DisplayMessageCommand
  | DisplayConfirmCommand
  | DisplaySelectCommand
  | ChangeMessageFontCommand
  | DisplayGoldCommand
  | HideGoldCommand

  // Screen control
  | WaitCommand
  | ScreenEffectCommand
  | ChangeWeatherCommand

  // Graphics
  | ChangeObjectSpriteCommand
  | ChangeHumanSpriteCommand
  | ChangeSpriteColorCommand
  | DisplayImageCommand
  | DisplayAnimationCommand
  | ChangeBackgroundImageCommand
  | ChangeDistantViewCommand

  // Movement
  | ChangeDirectionCommand
  | MovePartyCommand
  | MoveNPCCommand
  | ChangeNPCBehaviorCommand
  | ChangeMapCommand
  | MoveCameraCommand

  // Sound
  | ChangeBGMCommand
  | PlaySoundCommand

  // Switch
  | SwitchOnCommand
  | SwitchOffCommand

  // Number
  | ManipulateGoldCommand

  // Events
  | SaveAndLoadCommand
  | EndEventCommand
  | DeleteEventCommand
  | GotoCommand
  | CommentCommand;
