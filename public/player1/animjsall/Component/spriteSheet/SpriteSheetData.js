import Event from "../../core/Event.js";
import EventDispatcher from "../../core/EventDispatcher.js";

class SpriteSheetData extends EventDispatcher {
    /**
     * Está classe carrega uma spriteshet e o json de dados.
     * 
     * @param {String} imagePath 
     * @param {String} jsonPath 
     * @param {Bollean} jsonFormated 
     */
    constructor(imagePath, jsonPath, jsonFormated = false) {
        super()

        this._image = new Image();
        this._image.src = imagePath;
        this._json = jsonPath;
        this._images = [];
        this.loaded = false;

        this._image.onload = () => {
            if (jsonFormated == false) {
                this._loadJson(jsonPath);
            }else{
                this.loaded = true;
                this.dispatchEvent({type:Event.LOAD_COMPLETE, target:this});
            }
        }
    }

    _loadJson(jsonPath) {
        fetch(jsonPath)
            .then(response => response.json())
            .then(data => {
                this._json = data;
                this.loaded = true;
                this.dispatchEvent({type:Event.LOAD_COMPLETE, target:this});
            });
    }

    /**
     * Retorna uma imagem do tipo canvas.
     * ex:
     * context.drawImage(this.image, frame.x, frame.y);
     * 
     * @param {Int} key image
     * @returns 
     */
    getImage(key) {
        const frame = this._json.frames[key].frame;
        const image = document.createElement('canvas');
        image.width = frame.w;
        image.height = frame.h;
        
        const context = image.getContext('2d'); 
        context.drawImage(image, frame.x, frame.y);       

        return image;
    }

    /**
     * Retorna uma imagem do tipo canvas usando o nome como base de busca.
     * @param {String} name 
     * @returns 
     */
    getImageByName(name){
        var index = null;

        for (let i = 0; i < this._json.frames.length; i++) {            
            if (this._json.frames[i].filename === name) {
                index = i;
                break;
            }
        }

        if(index == null)return; 
                             
        const frame = this._json.frames[index].frame;
        const image = document.createElement('canvas');
        image.width = frame.w;
        image.height = frame.h;
        
        const context = image.getContext('2d'); 
        context.drawImage(this._image, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);       

        return {image:image, frame:frame};
    }

    /**
     * Retorna uma imagem do tipo canvas usando o nome como base de busca.
     * @param {String} name 
     * @returns 
     */
    getIndexByName(name){
        var index = null;

        for (let i = 0; i < this._json.frames.length; i++) {            
            if (this._json.frames[i].filename === name) {
                index = i;
                break;
            }
        }

        if(index == null)return;
        return {index:index, origin:this._json.frames[index].origin};
    }

    /**
     * Retorna um objeto com todos os parâmetros da imagem
     * 
     * @param {Int} key Object
     * @returns 
     */
    getDataImage(key) {
        if (!this.loaded) return { x: 0, y: 0, w: 0, h: 0 };;

        const frame = this._json.frames[key].frame;
        return frame;
    }

    /**
     * Metodo resonsável em desenhar uma imagem do spritesheet no canvas.
     * 
     * @param {Int} key 
     * @param {COntext2d} context 
     * @param {Number} x 
     * @param {Number} y 
     * @returns 
     */
    drawImage(key, context, x, y) {
        if (!this.loaded) return;

        const frame = this._json.frames[key].frame;
        context.drawImage(this._image, frame.x, frame.y, frame.w, frame.h, x, y, frame.w, frame.h);
    }

}

export default SpriteSheetData;