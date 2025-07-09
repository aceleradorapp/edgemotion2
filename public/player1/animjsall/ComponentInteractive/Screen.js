import DisplayObjectContainer from "../display/DisplayObjectContainer.js";
import EventDispatcher from "../core/EventDispatcher.js";
import ComponentEvent from "../core/ComponentEvent.js";

class Screen extends DisplayObjectContainer{

    constructor(url){
        super()

        this._type = 'componentInteractive';
        this._name = 'screen';
        
        this._url = url;
        this._onloadComplete = false;
        this._image = new Image();
        this._image.src = this._url;
        this._image.addEventListener('load', this._onloadHandler.bind(this));
        this._image.addEventListener("error", this._onError.bind(this));

        this.timeAction = 0;
        this._timeoutId = null;
        this.eventDispatcher = new EventDispatcher();
    }

    draw(context2d){
        if (this._onloadComplete) {
            context2d.drawImage(this._image, this._parentContainerX, this._parentContainerY, this._width, this._height);
        }
    }

    on() {
        if (this.timeAction == 0) return;


        this._timeoutId = setTimeout(() => {
            this.dispatchEvent({ type: ComponentEvent.ACTION, state: 'up' });
        }, this.timeAction);
    }

    off() {
        clearTimeout(this._timeoutId);
        this._timeoutId = 0;
    }

    _onloadHandler(image) {
        this._onloadComplete = true;
        this._width = image.target.width;
        this._height = image.target.height;
        this._calculatePivot();
        this.dispatchEvent({ type: Event.LOAD_COMPLETE, target:this }, ); 
    }

    _onError(event){
        var message = "Erro ao carregar a imagem: " + event.target.src +" tipo de erro " + event.type;
        this.error(this, message);
    }
}

export default Screen