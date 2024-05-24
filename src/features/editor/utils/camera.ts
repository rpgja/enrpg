export class Camera {
  x = 0;
  y = 0;
  scale = 1;

  constructor(readonly scaleUnit: number) {}

  setX(x: number): void {
    this.x = x;
  }

  setY(y: number): void {
    this.y = y;
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  setScale(scale: number): void {
    this.scale = scale;
  }
}
