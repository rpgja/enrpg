import { Position } from "./types.js";

export enum CommandType {
  // Message
  DisplayMessage,
  DisplayConfirm,
  DisplaySelect,
  ChangeMessageFont,
  DisplayGold,
  HideGold,

  // Screen control
  Wait,
  ScreenEffect,
  ChangeWeather,

  // Graphics
  ChangeObjectSprite,
  ChangeHumanSprite,
  ChangeSpriteColor,
  DisplayImage,
  DisplayAnimation,

  ChangeBackgroundImage,
  ChangeDistantView,

  // Movement
  ChangeDirection,
  MoveParty,
  MoveNPC,
  ChangeNPCBehavior,
  ChangeMap,
  MoveCamera,

  // Sound
  ChangeBGM,
  PlaySound,

  // Switch
  SwitchOn,
  SwitchOff,

  // Number
  ManipulateGold,

  // Events
  SaveAndLoad,
  EndEvent,
  DeleteEvent,
  Goto,
  Comment
};

export type DisplayMessageCommand = {
  type: CommandType.DisplayMessage,
  message: string
};

// TODO
export type DisplayConfirmCommand = {};

// TODO
export type DisplaySelectCommand = {
  type: CommandType.DisplaySelect
};

// TODO
export type ChangeMessageFontCommand = {
  type: CommandType.ChangeMessageFont
};

export type DisplayGoldCommand = {
  type: CommandType.DisplayGold
};

export type HideGoldCommand = {
  type: CommandType.HideGold
};

// Screen control
// TODO
export type WaitCommand = {
  type: CommandType.Wait
};

// TODO
export type ScreenEffectCommand = {
  type: CommandType.ScreenEffect
};

// TODO
export type ChangeWeatherCommand = {
  type: CommandType.ChangeWeather
};


// Graphics
// TODO
export type ChangeObjectSpriteCommand = {
  type: CommandType.ChangeObjectSprite
};

// TODO
export type ChangeHumanSpriteCommand = {
  type: CommandType.ChangeHumanSprite
};

// TODO
export type ChangeSpriteColorCommand = {
  type: CommandType.ChangeSpriteColor
};

// TODO
export type DisplayImageCommand = {
  type: CommandType.DisplayImage
};

// TODO
export type DisplayAnimationCommand = {
  type: CommandType.DisplayAnimation
};


export type ChangeBackgroundImageCommand = {
  type: CommandType.ChangeBackgroundImage,
  backgroundImageUrl: string
};

// TODO
export type ChangeDistantViewCommand = {
  type: CommandType.ChangeDistantView
};


// Movement
// TODO
export type ChangeDirectionCommand = {
  type: CommandType.ChangeDirection
};

// TODO
export type MovePartyCommand = {
  type: CommandType.MoveParty
};

// TODO
export type MoveNPCCommand = {
  type: CommandType.MoveNPC
};

// TODO
export type ChangeNPCBehaviorCommand = {
  type: CommandType.ChangeNPCBehavior
};

// TODO
export type ChangeMapCommand = {
  type: CommandType.ChangeMap
};

// TODO
export type MoveCameraCommand = {
  type: CommandType.MoveCamera
};


// Sound
// TODO
export type ChangeBGMCommand = {
  type: CommandType.ChangeBGM
};

export enum PlaySoundCommandOperation {
  Play = "PL",
  Stop = "ST"
}

export type PlaySoundCommandFade = {
  progressAt: number,
  volumeFrom: number,
  voluteTo: number
};

export type PlaySoundCommand = {
  type: CommandType.PlaySound,
  soundEffectId: number,
  volume: number,
  loop: boolean,
  fade?: PlaySoundCommandFade,
  operation: PlaySoundCommandOperation.Play
} | {
  type: CommandType.PlaySound,
  operation: PlaySoundCommandOperation.Stop
};

// Switch

export type SwitchOnCommand = {
  type: CommandType.SwitchOn,
  switch: number
};

export type SwitchOffCommand = {
  type: CommandType.SwitchOff,
  switch: number
};

// Number

export enum ManipulateGoldCommandOperation {
  Addition,
  Subtraction,
  Double,
  Set
};

export type ManipulateGoldCommand = {
  type: CommandType.ManipulateGold,
  value: string,
  operation: ManipulateGoldCommandOperation
};


// Events
// TODO
export type SaveAndLoadCommand = {
  type: CommandType.SaveAndLoad
};

export type EndEventCommand = {
  type: CommandType.EndEvent
};

export type DeleteEventCommand = {
  type: CommandType.DeleteEvent
};

export type GotoCommand = {
  type: CommandType.Goto,
  phase: number,
  eventPosition?: Position
};

// TODO
export type CommentCommand = {
  type: CommandType.Comment
};

export type Command =
  // Message
  DisplayMessageCommand |
  DisplayConfirmCommand |
  DisplaySelectCommand |
  ChangeMessageFontCommand |
  DisplayGoldCommand |
  HideGoldCommand |

  // Screen control
  WaitCommand |
  ScreenEffectCommand |
  ChangeWeatherCommand |

  // Graphics
  ChangeObjectSpriteCommand |
  ChangeHumanSpriteCommand |
  ChangeSpriteColorCommand |
  DisplayImageCommand |
  DisplayAnimationCommand |

  ChangeBackgroundImageCommand |
  ChangeDistantViewCommand |

  // Movement
  ChangeDirectionCommand |
  MovePartyCommand |
  MoveNPCCommand |
  ChangeNPCBehaviorCommand |
  ChangeMapCommand |
  MoveCameraCommand |

  // Sound
  ChangeBGMCommand |
  PlaySoundCommand |

  // Switch
  SwitchOnCommand |
  SwitchOffCommand |

  // Number
  ManipulateGoldCommand |

  // Events
  SaveAndLoadCommand |
  EndEventCommand |
  DeleteEventCommand |
  GotoCommand |
  CommentCommand;
