import Event from "../core/Event.js";
import DisplayObjectContainer from "../display/DisplayObjectContainer.js";

class Stage extends DisplayObjectContainer{
/**
    A classe Stage é uma subclasse de DisplayObjectContainer que representa a área 
    principal de exibição na qual os objetos são exibidos.
    Ela possui propriedades para definir a largura e a altura da área de exibição, 
    para controlar o modo de exibição e para gerenciar o foco do teclado.
    Ela também é responsável por receber e enviar eventos para os objetos 
    filhos e para controlar a taxa de atualização da tela.
*/
    constructor(context2d, width=0, height=0, color='#000000'){
        super()

        this.type = 'stage';
        this._context = context2d;
        this._x = 0;
        this._y = 0;
        this._width = width;
        this._height = height; 
        this._color = color;
        
        this._animationFrames = null;
        this._running = false; 
        
        this._scene = null;

        this._onCenter();
    }

    get scene(){
        return this._scene;
    }

    set scene(scene){
        this._scene = scene;
    }

    initialize(){
        this.dispatchEvent(Object.assign({}, {type:Event.INITIALISE, }, this));
        this.start();
    }

    start(){
        if(this._running) return;
        this._enterFrame();
        this._running = true;
        this.dispatchEvent(Object.assign({}, {type:Event.STARTED, }, this));
    }

    end(){
        if(!this._running) return;
        cancelAnimationFrame(this._animationFrames);
        this._running = false;
        this.dispatchEvent(Object.assign({}, {type:Event.ENDED, }, this));
    }

    draw(context2d){
        context2d.clearRect(0,0, this._context.canvas.width*10, this._context.canvas.height*10);
        context2d.beginPath();
        context2d.rect(this._parentContainerX, this._parentContainerY, this._width, this._height);
        context2d.fillStyle = this._color;
        context2d.fill(); 
        context2d.closePath();
    }

    _enterFrame(){
        this.render(this._context);

        this.dispatchEvent({type:Event.ENTER_FRAME, target:this});
        this._animationFrames = requestAnimationFrame(this._enterFrame.bind(this));
    }

    _onCenter(){
        this._x = (this._context.canvas.width-this._width)/2;
        this._y = (this._context.canvas.height-this._height)/2;
        this._parentContainerX = this._x;
        this._parentContainerY = this._y;
    }

}

export default Stage;