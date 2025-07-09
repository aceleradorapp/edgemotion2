import Behavior from "./Behavior.js";

class MoveAndCollide extends Behavior {
  constructor() {
    super();
    this._speed = 0;
    this._direction = 0;
    this._canvasWidth = 0;
    this._canvasHeight = 0;
  }

  setSpeed(speed) {
    this._speed = speed;
  }

  setDirection(direction) {
    this._direction = direction;
  }

  setCanvasSize() {
    this._canvasWidth = object.parent.width;
    this._canvasHeight = object.parent.height;
  }

  execute(object) {
    if (!object.parent) return;

    this.setCanvasSize();

    // move the object
    const deltaX = Math.cos(this._direction * Math.PI / 180) * this._speed;
    const deltaY = Math.sin(this._direction * Math.PI / 180) * this._speed;
    object.x += deltaX;
    object.y += deltaY;

    // check if the object has collided with the canvas boundaries
    if (object.x < 0 || object.x > this._canvasWidth) {
      // reverse the direction horizontally
      this._direction = 180 - this._direction;
      object.x = object.x < 0 ? 0 : this._canvasWidth;
    }

    if (object.y < 0 || object.y > this._canvasHeight) {
      // reverse the direction vertically
      this._direction = 360 - this._direction;
      object.y = object.y < 0 ? 0 : this._canvasHeight;
    }
  }
}

export default MoveAndCollide;
