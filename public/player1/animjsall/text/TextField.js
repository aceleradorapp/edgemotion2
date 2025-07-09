import Event from "../core/Event.js";
import Sprite from "../display/Sprite.js";

class TextField extends Sprite {
    constructor(text, font, color) {
      super();
  
      this._text = text;
      this._font = font || "16px Arial";
      this._color = color || "#000000";
      this._width = 0;
      this._height = 0;
    }

    set text(text) {
        this._text = text;
    }
    get text() {
        return this._text;
    }

    set font(font) {
     this._font = font;
    }
    get font() {
        return this._font;
    }

    set color(color) {
        this._color = color;
    }
    get color() {
        return this._color;
    }
  
    draw(context2d) {
      this._measureText(context2d);
      context2d.font = this._font;
      context2d.fillStyle = this._color;
      context2d.textAlign = "left";
      context2d.textBaseline = "top";
      context2d.fillText(this._text, this._parentContainerX, this._parentContainerY);
    } 
       
    _measureText(context2d) {
      context2d.font = this._font;
      const metrics = context2d.measureText(this._text);
      this._width = metrics.width;
      this._height = parseInt(this._font);
      this._calculatePivot();
      this.dispatchEvent(Object.assign({}, {type:Event.LOAD_COMPLETE}, this));
    }
  
  }
  
  export default TextField;
  