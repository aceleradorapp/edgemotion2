import Event from "../core/Event.js";
import Sprite from "../display/Sprite.js";

class BitmapData extends Sprite {
    /**
     * A classe BitmapData foi criada para permitir a renderização de imagens em um canvas utilizando JavaScript.
     * Essa classe é capaz de carregar imagens a partir de uma URL ou de uma representação em base64, 
     * e oferece diversas funcionalidades para manipulação dessas imagens.
     * 
     * var bitmapData = new BitmapData('./assets./image/img.png');
     * 
     * @param {String} url  
     */
    constructor(url) {
        super();

        this._type = 'bitmapData';
        this._url = url;
        this._onloadComplete = false;
        this._image = new Image();
        this._image.src = this._url;
        this._image.addEventListener('load', this._onloadHandler.bind(this));
        this._image.addEventListener("error", this._onError.bind(this));
    }
    
    draw(context2d) {
        if (this._onloadComplete) {
            context2d.drawImage(this._image, this._parentContainerX, this._parentContainerY, this._width, this._height);
        }
    }

    _onloadHandler(image) {
        this._onloadComplete = true;
        this._width = image.target.width;
        this._height = image.target.height;
        this._calculatePivot();
        this.dispatchEvent(Object.assign({}, { type: Event.LOAD_COMPLETE }, this)); 
    }

    _onError(event){
        var message = "Erro ao carregar a imagem: " + event.target.src +" tipo de erro " + event.type;
        this.error(this, message);
    }

    crop(x, y, width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.drawImage(this._image, -x, -y);
        const croppedImage = new BitmapData(canvas.toDataURL());
        return croppedImage;
    }

    _getPixel(x, y) {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext('2d');
        context.drawImage(this._image, -x, -y);
        const imageData = context.getImageData(0, 0, 1, 1);
        return {
            r: imageData.data[0],
            g: imageData.data[1],
            b: imageData.data[2],
            a: imageData.data[3],
        };
    }



}

export default BitmapData;

