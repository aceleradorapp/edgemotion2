class SpritesheetPacker {
    constructor(images) {
        this.images = images;
        this.positions = [];
        this.width = 0;
        this.height = 0;
    }

    pack() {
        const remainingImages = [...this.images];
        let currentX = 0;
        let currentY = 0;
        let currentRowHeight = 0;

        while (remainingImages.length > 0) {
            const nextImage = remainingImages.shift();

            if (currentX + nextImage.width > this.width) {
                this.width = currentX + nextImage.width;
            }

            if (currentY + nextImage.height > this.height) {
                this.height = currentY + nextImage.height;
            }

            if (currentX + nextImage.width > this.width) {
                currentX = 0;
                currentY += currentRowHeight;
                currentRowHeight = 0;
            }

            if (currentY + nextImage.height > this.height) {
                throw new Error("Spritesheet too small");
            }

            this.positions.push({
                x: currentX,
                y: currentY,
                width: nextImage.width,
                height: nextImage.height,
            });

            currentX += nextImage.width;
            currentRowHeight = Math.max(currentRowHeight, nextImage.height);
        }
    }

    export() {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        const context = canvas.getContext("2d");

        this.positions.forEach((position, index) => {
            context.drawImage(this.images[index], position.x, position.y);
        });

        const imageData = canvas.toDataURL("image/png");
        const data = {
            frames: {},
            meta: {
                app: "spritesheet-packer",
                version: "1.0",
                image: "spritesheet.png",
            },
        };

        this.positions.forEach((position, index) => {
            data.frames[index] = {
                frame: { x: position.x, y: position.y, w: position.width, h: position.height },
                rotated: false,
                trimmed: false,
                spriteSourceSize: { x: 0, y: 0, w: position.width, h: position.height },
                sourceSize: { w: position.width, h: position.height },
            };
        });

        const json = JSON.stringify(data);
        const base64Image = imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

        return {
            json,
            base64Image,
            width: this.width,
            height: this.height,
        };
    }
}

export default SpritesheetPacker;

/*
exemplo de uso:

// Lista de imagens
const images = [
  document.getElementById("image1"),
  document.getElementById("image2"),
  document.getElementById("image3"),
];

// Cria uma instância do SpritesheetPacker
const packer = new SpritesheetPacker(images);

// Gera a lista de posições e calcula o tamanho da spritesheet
packer.pack();

// Exporta a spritesheet como JSON e base64
const { json, base64Image, width, height } = packer.export();

// Cria uma imagem e define o src para o base64 da spritesheet
const spritesheetImage = new Image();
spritesheetImage.src = "data:image/png;base64," + base64Image;

// Adiciona a imagem da spritesheet no documento
document.body.appendChild(spritesheetImage);

// Exibe as informações da spritesheet no console
console.log(`Spritesheet size: ${width}x${height}`);
console.log("Spritesheet JSON:");
console.log(json);




*/
