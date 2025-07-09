import Button from "./Button.js";


class ButtonImage extends Button{
    /**
     * Classe button é uma classe com a funcionalidade de um botão (up. down, over),
     * que cria um botão utilizando de imaagens relativas ao estado do botão.
     * 
     *                                  UP          DOWN        OVER
     * var button = new ButtonImage('img1.png', 'img2.png', 'img3.png')
     * 
     * @param {String} url_up 
     * @param {Stringe} url_down 
     * @param {String} url_over 
     * @returns 
     */
    constructor(url_up=null, url_down = null, url_over=null){
        super()    
        
        if (!url_up) {
            this.error(this, 'É necessário adicionar uma url para o parâmetro url_up no construtor da classe');
            return;
        }

        this._load = 0;
        this._totalLoaded = 0;
        this._onloadComplete = false;
        this._listImage = {
            up:null,
            down:null,
            over:null,
            out:null
        };

        
        const listUrl = [url_up, url_down, url_over];

        for(var i=0; i< listUrl.length; i++){
            if(listUrl[i] != null){
                this._image = new Image();
                this._image.index = i;
                this._image.src = listUrl[i];
                this._image.addEventListener('load', this._onloadHandler.bind(this));
                this._image.addEventListener("error", this._onError.bind(this));
                this._load++;
            }
        }

    }

    draw(context2d) {
        if (this._onloadComplete) {
            var image = this._listImage[this.state]==null? this._listImage['up']:this._listImage[this.state]
            context2d.drawImage(image, this._parentContainerX, this._parentContainerY, this._width, this._height);
        }
    }

    _onloadHandler(image){
        this._totalLoaded++;

        if(this._totalLoaded == this._load){
            this._onloadComplete = true;
        }

        if(image.target.index == 0){
            this._listImage.up = image.target;
            this._listImage.out = this._listImage.up;
        }else if(image.target.index == 1){
            this._listImage.down = image.target;
        }else if(image.target.index == 2){
            this._listImage.over = image.target;
        }

        this._width = image.target.width;
        this._height = image.target.height;
        this._calculatePivot();
    }

    _onError(event){
        var message = "Erro ao carregar a imagem: " + event.target.src +" tipo de erro " + event.type;
        this.error(this, message);
    }

}

export default ButtonImage;