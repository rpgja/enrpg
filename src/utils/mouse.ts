export enum MouseButton {
  Uninitialized = 0,
  Primary = 1 << 0,
  Secondary = 1 << 1,
  Auxiliary = 1 << 2,
  Fourth = 1 << 3,
  Fifth = 1 << 4,
}

export const isMouseDown = (
  event: Pick<MouseEvent, "buttons">,
  buttons: number,
): boolean => (event.buttons & buttons) !== 0;
