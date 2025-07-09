import Event from "../../core/Event.js";
import DisplayObjectContainer from "../../display/DisplayObjectContainer.js";

class Button extends DisplayObjectContainer {
    /**
     * Classe que abstrai as funcionalidades do botão. (Button)
     */
    constructor() {
        super()

        this._name = 'button';
        this._state = 'up';
        this.mouseEnabled = true;

        this._onMouseOverOriginal = this._onMouseOver.bind(this);
        this._onMouseUPOriginal = this._onMouseUP.bind(this);
        this._onMouseDOWNOriginal = this._onMouseDOWN.bind(this);
        this._onMouseOutOriginal = this._onMouseOut.bind(this);

        this.addEvents();
    }

    /**
     * Valor do estado do botão (up. down, over, out)
     */
    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }

    removeEvents() {
        this.removeEventListener(Event.MOUSE_OVER, this._onMouseOverOriginal);
        this.removeEventListener(Event.MOUSE_UP, this._onMouseUPOriginal);
        this.removeEventListener(Event.Mouse_DOWN, this._onMouseDOWNOriginal);
        this.removeEventListener(Event.MOUSE_OUT, this._onMouseOutOriginal);
    }

    addEvents() {
        this.addEventListener(Event.MOUSE_OVER, this._onMouseOverOriginal);
        this.addEventListener(Event.MOUSE_UP, this._onMouseUPOriginal);
        this.addEventListener(Event.Mouse_DOWN, this._onMouseDOWNOriginal);
        this.addEventListener(Event.MOUSE_OUT, this._onMouseOutOriginal);
    }


    _onMouseOver(event) {
        this._state = 'over';
        this._updateState();
    }

    _onMouseUP(event) {
        this._state = 'up';
        this._updateState();
    }

    _onMouseDOWN(event) {
        this._state = 'down';
        this._updateState();
    }

    _onMouseOut(event) {
        this._state = 'out';
        this._updateState();
    }

    _updateState() {
        this.dispatchEvent({ type: Event.MOUSE_STATE, target: this, state: this._state });
    }

}

export default Button;