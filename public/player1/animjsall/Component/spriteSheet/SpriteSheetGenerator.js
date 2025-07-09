import Event from "../../core/Event.js";
import EventDispatcher from "../../core/EventDispatcher.js";
import Packer from "./Packer.js";

class SpriteSheetGenerator extends EventDispatcher {
    constructor(imagePaths) {
        super()

        this.images = [];
        this.imageCount = imagePaths.length;
        this.loadedImages = 0;
        this.spritesheet = null;
        this.json = null;
        this.sprites = {
            frames: [],
            spritesheet: null
        };
        this.loadImages(imagePaths);
    }

    loadImages(imagePaths) {
        imagePaths.forEach((data, index) => {
            const image = new Image();
            image.onload = () => {
                this.loadedImages++;
                this.images[index] = image;
                if (this.loadedImages === this.imageCount) {
                    this.createSpritesheet();
                    this.createJSON();
                    this.dispatchEvent({type:Event.LOAD_COMPLETE, target:this});
                }
            };
            image.data = data.data;
            image.src = data.image;
        });
    }

    createSpritesheet() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
    
        // Ordena as imagens pela largura
        this.images.sort((a, b) => a.width - b.width);
    
        // Define o tamanho do canvas
        let width = 0;
        let height = 0;
        this.images.forEach((image) => {
            width += image.width;
            height = Math.max(height, image.height);
        });
        canvas.width = width;
        canvas.height = height;
    
        let x = 0;
        let y = 0;
        this.images.forEach((image, index) => {
            ctx.drawImage(image, x, y); // desenha a imagem no canvas
            const frame = {
                filename: image.data.name,
                frame: { x, y, w: image.width, h: image.height },
                rotated: false,
                trimmed: false,
                spriteSourceSize: { x, y, w: image.width, h: image.height },
                sourceSize: { w: image.width, h: image.height },
                width: image.width,
                height: image.height,
                index:index,
                origin: {x:image.data.x, y:image.data.y, w: image.width, h: image.height},
            };
            this.sprites.frames.push(frame);
            x += image.width;
        });
    
        this.spritesheet = canvas.toDataURL("image/png");
    }
    
      

    // createSpritesheet() {
    //     const canvas = document.createElement("canvas");
    //     const ctx = canvas.getContext("2d");

    //     // Ordena as imagens pela largura
    //     this.images.sort((a, b) => a.width - b.width);

    //     // Define o tamanho do canvas
    //     let width = 0;
    //     let height = 0;
    //     this.images.forEach((image) => {
    //         width += image.width;
    //         height = Math.max(height, image.height);
    //     });
    //     canvas.width = width;
    //     canvas.height = height;

    //     let x = 0;
    //     let y = 0;
    //     this.images.forEach((image, index) => {
    //         ctx.drawImage(image, x, y);
    //         const frame = {
    //             filename: image.data.name,
    //             frame: { x, y, w: image.width, h: image.height },
    //             rotated: false,
    //             trimmed: false,
    //             spriteSourceSize: { x, y, w: image.width, h: image.height },
    //             sourceSize: { w: image.width, h: image.height },
    //             width: image.width,
    //             height: image.height,
    //             index:index,
    //             origin: {x:image.data.x, y:image.data.y, w: image.width, h: image.height},
    //         };
    //         this.sprites.frames.push(frame);
    //         x += image.width;
    //     });

    //     this.spritesheet = canvas.toDataURL("image/png");
    // }

    createJSON() {
        this.sprites.spritesheet = this.spritesheet;
        this.json = JSON.stringify(this.sprites);
    }
}

export default SpriteSheetGenerator;

