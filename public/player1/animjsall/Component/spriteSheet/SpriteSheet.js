import Sprite from "../../display/Sprite.js";
import SpriteSheetData from "./SpriteSheetData.js";

class SpriteSheet extends Sprite {
     constructor(spriteSheetData=null) {
        super()

        this._spriteShetData = spriteSheetData;
        this._key = 0;        
    }

    /**
     * Método responável em carregar os arquivos de imagem e json em uma determinada pasta.
     * 
     * @param {String} imagePath 
     * @param {String} jsonPath 
     * @param {Boolean} jsonFormated 
     */
    source(imagePath, jsonPath, jsonFormated = false){
        this._spriteShetData = new SpriteSheetData(imagePath, jsonPath, jsonFormated);
    }

    getImageName(name){
        return this._spriteShetData.getImageByName(name);
    }

    get key(){
        return this._key;
    }

    set key(value){
        this._key = value;
    }

    draw(context2d){
        var frame = this._spriteShetData.getDataImage(this._key);
        this.width = frame.w;
        this.height= frame.h;        

        this._spriteShetData.drawImage(this._key,context2d, this._parentContainerX, this._parentContainerY);
    }
}

export default SpriteSheet