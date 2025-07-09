import DisplayObjectContainer from "../display/DisplayObjectContainer.js";
import Shape from "../Component/Shape.js";
import ComponentEvent from "../core/ComponentEvent.js";
import Event from "../core/Event.js";

class Click extends DisplayObjectContainer {
    constructor(data) {
        super()

        this._type = 'componentInteractive';
        this._name = 'clickButton';

        this._data = data;
        this._images = [];
        this.areaClick = null;
        this._state = 'up';
        this._action = null;

        this._createImages();

        this.onmouseUp = this._onmouseUp.bind(this);
        this.onmouseDown = this._onmouseDown.bind(this);
        this.onmouseOver = this._onmouseOver.bind(this);
        this.onmouseClick = this._onmouseClick.bind(this);
        this.onmousedblClick = this._onmouseDblClick.bind(this);
        this.onmouseOut = this._onmouseOut.bind(this);

    }

    addAction(value){
        this._action = value;
    }

    on() {
        this.start();
    }

    off() {
        this._removeEvents();
    }

    start() {
        this._createComponents();
        this._addEvents()
    }

    _createImages() {
        for (var i = 0; i < this._data.object.length; i++) {
            let data = this._data.object[i].data;
            let image = new Image();
            image.src = this._data.object[i].image;
            this._images[data.name] = { image: image, data }
        }
    }

    _createComponents() {
        if (this.areaClick) return;

        var w = this._images['interation'].image.naturalWidth;
        var h = this._images['interation'].image.naturalHeight;

        var shape = new Shape();
        this.areaClick = shape.rectangle(this._images['interation'].data.x, this._images['interation'].data.y, w, h, '#ff0000');
        this.areaClick.alpha = 0;

        this._parent.addChild(this.areaClick);
    }

    _addEvents() {
        this.areaClick.addEventListener(Event.MOUSE_UP, this.onmouseUp);
        this.areaClick.addEventListener(Event.Mouse_DOWN, this.onmouseDown);
        this.areaClick.addEventListener(Event.MOUSE_OVER, this.onmouseOver);
        this.areaClick.addEventListener(Event.MOUSE_OUT, this.onmouseOut);
    }

    _removeEvents() {
        if(!this.areaClick) return;

        this.areaClick.removeEventListener(Event.MOUSE_UP, this.onmouseUp);
        this.areaClick.removeEventListener(Event.Mouse_DOWN, this.onmouseDown);
        this.areaClick.removeEventListener(Event.MOUSE_OVER, this.onmouseOver);
        this.areaClick.removeEventListener(Event.MOUSE_OUT, this.onmouseOut);
    }

    _onmouseUp(event) {
        this._state = 'up';
        this._onStateMouse();
    }
    _onmouseDown(event) {
        this._state = 'down';
        this._onStateMouse();
    }
    _onmouseOver(event) {
        this._state = 'over';
        this._onStateMouse();
    }
    _onmouseClick(event) {
        this._state = 'click';
        this._onStateMouse();
    }
    _onmouseDblClick(event) {
        this._state = 'dblClick';
        this._onStateMouse();
    }
    _onmouseOut(event) {
        this._state = 'out';
        //this._onStateMouse();
    }

    _onStateMouse(){
        if (!this._mouseEnabled) return; // usado para nã enviar a ação par ao player

        if(this._action == this._state){
            this.dispatchEvent({ type: ComponentEvent.ACTION, state: this._state });
        }

    }

    draw(context2d) {
        var state = this._state;
        context2d.drawImage(this._images['background'].image, 0, 0);

        if(state == 'out'){
            state = 'up';
        }
        context2d.drawImage(this._images[state].image, this._images[state].data.x, this._images[state].data.y);
    }


}

export default Click;