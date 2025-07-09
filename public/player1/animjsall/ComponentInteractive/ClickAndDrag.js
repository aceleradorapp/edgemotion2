import DisplayObjectContainer from "../display/DisplayObjectContainer.js";
import Shape from "../Component/Shape.js";
import ComponentEvent from "../core/ComponentEvent.js";
import Event from "../core/Event.js";

class ClickAndDrag extends DisplayObjectContainer {
    constructor(data) {
        super()

        this._type = 'componentInteractive';
        this._name = 'clickAndDrag';
        this._width = 1440;
        this._height = 900;
        this._data = data;

        this.background = '';
        this.sequence = [];
        this.bounce = { x: 0, y: 0 };
        this.shapeEnd;
        this.shapeInit;
        this.distanceInitial = 0;
        this.positionInitial = { x: 0, y: 0 };
        this.sequenceFinal = false;

        this._currentIndex = 0;

        this.mouseUpHandle = this._mouseUpHandle.bind(this);

        this._prepareImages();
    }

    on() {        
        this.start();
    }

    off() {
        //this._removeEvents();
    }

    start() {
        this._createComponents();
        this._addEvents()
        this._currentIndex = 0;
    }

    initDebug() {
        this.shapeInit.debug = true;
        this.shapeEnd.debug = true;
    }

    _prepareImages() {
        this.background = new Image();
        this.background.src = this._data.object.imageBackground;

        for (var i = 0; i < this._data.object.imageSequence.length; i++) {
            let imagem = new Image();
            imagem.src = this._data.object.imageSequence[i].image;
            this.bounce.x = this._data.object.imageSequence[i].x;
            this.bounce.y = this._data.object.imageSequence[i].y;
            this.sequence.push(imagem);
        }
    }

    _createComponents(){
        if(this.shapeInit) return;

        var shape = new Shape();
        var positionInit = this._data.object.positionInit;
        var positionEnd = this._data.object.positionEnd
        this.shapeInit = shape.rectangle(positionInit.x, positionInit.y, positionInit.width, positionInit.height, '#00ff00');
        this.shapeInit.startDrag = true;
        this.shapeEnd = shape.rectangle(positionEnd.x, positionEnd.y, positionEnd.width, positionEnd.height, '#00ff00');

        this._parent.addChild(this.shapeEnd);
        this._parent.addChild(this.shapeInit);

        this.shapeInit.alpha = 0;
        this.shapeEnd.alpha = 0;

        this.distanceInitial = this._calculateDistance(this.shapeInit, this.shapeEnd);
        this.positionInitial.x = this.shapeInit.x;
        this.positionInitial.y = this.shapeInit.y;
    }

    _addEvents() {        
        this.shapeInit.addEventListener(Event.MOUSE_UP, this.mouseUpHandle);
    }

    _removeEvents() {
        this.shapeInit.removeEventListener(Event.MOUSE_UP, this.mouseUpHandle);
    }

    _mouseUpHandle(event){
        if (this.sequenceFinal) {
            this.sequenceFinal = false;
            this._removeEvents();
            this.onFinished();            
        }

        this.shapeInit.x = this.positionInitial.x;
        this.shapeInit.y = this.positionInitial.y;
    }

    _controlSequenceImage() {
        if(!this.shapeInit) return;

        var distance = this._calculateDistance(this.shapeInit, this.shapeEnd);
        this._currentIndex = Math.floor(this._map(distance - 50, 0, this.distanceInitial, this.sequence.length, 0));

        if (this._currentIndex >= this.sequence.length - 1) {
            this.sequenceFinal = true;
        } else {
            this.sequenceFinal = false;
        }        
    }

    onFinished() {
        console.log('Acabou - enviar a ação');
        this._removeEvents();
        this.dispatchEvent({ type: ComponentEvent.ACTION, state: 'up' });
    }

    draw(context2d) {

        if (this._currentIndex > (this.sequence.length - 1)) {
            this._currentIndex = this.sequence.length - 1;
        } else if (this._currentIndex < 0) {
            this._currentIndex = 0;
        }

        context2d.drawImage(this.background, 0, 0);
        context2d.drawImage(this.sequence[this._currentIndex], this.bounce.x, this.bounce.y);

        this._controlSequenceImage();
    }

    _calculateDistance(obj1, obj2) {
        var x1 = obj1.x + obj1.width / 2;
        var y1 = obj1.y + obj1.height / 2;
        var x2 = obj2.x + obj2.width / 2;
        var y2 = obj2.y + obj2.height / 2;

        var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

        return distance;
    }

    _calculateMousePositionRelativeToObj(event, obj) {
        var retangulo = objeto.getBoundingClientRect();
        var posicaoMouse = {
            x: evento.clientX - retangulo.left,
            y: evento.clientY - retangulo.top
        };
        var distancia = Math.sqrt(Math.pow(posicaoMouse.x, 2) + Math.pow(posicaoMouse.y, 2));
        return distancia;
    }



    _map(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }


}

export default ClickAndDrag