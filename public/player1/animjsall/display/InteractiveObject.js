/**  
    A classe InteractiveObject estende a classe DisplayObject e adiciona a 
    capacidade de interação com o mouse e o teclado.
    Ela possui métodos para definir o foco do teclado, para capturar eventos do 
    mouse e do teclado e para gerenciar o cursor do mouse.
    exemplo de uso

    const interactiveObj = new InteractiveObject();
    interactiveObj.x = 100;
    interactiveObj.y = 100;
    interactiveObj.width = 50;
    interactiveObj.height = 50;

    // adiciona a instância InteractiveObject como um filho do Stage
    stage.addChild(interactiveObj);

    // habilita os eventos do mouse na instância InteractiveObject
    interactiveObj.enableMouseEvents();

    // adiciona um ouvinte de evento de clique para a instância InteractiveObject
    interactiveObj.addEventListener("click", (event) => {
        console.log(`Objeto interativo clicado na posição ${event.detail.x}, ${event.detail.y}`);
    });

*/

import DisplayObject from "./DisplayObject.js";
import EventDispatcher from "../core/EventDispatcher.js"
import Event from "../core/Event.js";

class InteractiveObject extends DisplayObject {
    constructor() {
        super();

        this._eventDispatcher = new EventDispatcher();

        this._mouseEnabled = true;
        this._tabEnabled = false;

        this._mouseOut = false;
        this._mouseOver = false;

        this._mouseClicked = false;
        this._startClickX = 0;
        this._startClickY = 0;


    }

    get mouseEnabled() {
        return this._mouseEnabled;
    }

    set mouseEnabled(value) {
        this._mouseEnabled = value;
    }

    get tabEnabled() {
        return this._tabEnabled;
    }

    set tabEnabled(value) {
        this._tabEnabled = value;
    }

    async enableMouseEvents() {
        await this.waitForContext(); // Espera até que o contexto exista 

        this._context.canvas.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
        this._context.canvas.addEventListener('mousedown', this.mouseDownHandler.bind(this));
        this._context.canvas.addEventListener('mouseup', this.mouseUpHandler.bind(this));
        this._context.canvas.addEventListener('mouseover', this.mouseOverHandler.bind(this));
        this._context.canvas.addEventListener('mouseout', this.mouseOutHandler.bind(this));
        this._context.canvas.addEventListener('click', this.clickHandler.bind(this));

        // Início das alterações
        this._context.canvas.addEventListener('dblclick', this.dblclickHandler.bind(this));  // novo ouvinte de evento para double click
        this._context.canvas.addEventListener('contextmenu', this.rightClickHandler.bind(this));  // novo ouvinte de evento para click com o botão direito
        // Fim das alterações

        this.dispatchEvent(Object.assign({}, { type: Event.ENABLE_MOUSE_EVENT }));
    }

    async waitForContext() {
        while (!this._context) {
            await new Promise(resolve => setTimeout(resolve, 10)); // Aguarda 1 segundo
        }
    }

    disableMouseEvents() {
        this._context.canvas.removeEventListener('mousemove', this.mouseMoveHandler.bind(this));
        this._context.canvas.removeEventListener('mousedown', this.mouseDownHandler.bind(this));
        this._context.canvas.removeEventListener('mouseup', this.mouseUpHandler.bind(this));
        this._context.canvas.removeEventListener('mouseover', this.mouseOverHandler.bind(this));
        this._context.canvas.removeEventListener('mouseout', this.mouseOutHandler.bind(this));
        this._context.canvas.removeEventListener('click', this.clickHandler.bind(this));

        // Início das alterações
        this._context.canvas.removeEventListener('dblclick', this.dblclickHandler.bind(this));  // novo ouvinte de evento para double click
        this._context.canvas.removeEventListener('contextmenu', this.rightClickHandler.bind(this));  // novo ouvinte de evento para click com o botão direito
        // Fim das alterações

        this._mouseEnabled = false;
    }

    addEventListener(type, listener, useCapture = false, priority = 0, useWeakReference = false) {
        this._eventDispatcher.addEventListener(type, listener, useCapture, priority, useWeakReference);
    }

    removeEventListener(type, listener, useCapture = false) {
        this._eventDispatcher.removeEventListener(type, listener, useCapture);
    }

    dispatchEvent(event) {
        event.displayObject = this;
        this._eventDispatcher.dispatchEvent(event);
    }

    hasEventListener(type) {
        this._eventDispatcher.hasEventListener(type);
    }

    willTrigger(type) {
        this._eventDispatcher.willTrigger(type);
    }


    // Método chamado quando este objeto de exibição recebe o foco da navegação por teclado
    focusInHandler(event) {
        this.dispatchEvent(event);
    }

    // Método chamado quando este objeto de exibição perde o foco da navegação por teclado
    focusOutHandler(event) {
        this.dispatchEvent(event);
    }

    dblclickHandler(event) {
        if (this._mouseEnabled && this.isMouseOver(event)) {
            this.dispatchEvent(event);
        }
    }

    // Método chamado quando este objeto de exibição é clicado com o mouse
    clickHandler(event) {
        if (this._mouseEnabled && this.isMouseOver(event)) {
            this.dispatchEvent(event);
        }
    }

    rightClickHandler(event) {
        if (this._mouseEnabled && this.isMouseOver(event)) {
            event.preventDefault();  // previne o menu de contexto padrão
            this.dispatchEvent(event);
        }
    }

    // Método chamado quando o botão do mouse é pressionado sobre este objeto de exibição
    mouseDownHandler(event) {
        if (this._mouseEnabled && this.isMouseOver(event)) {
            this._mouseClicked = true;
            const posx = event.clientX - this._context.canvas.offsetLeft - this._parent._parentContainerX;
            const posy = event.clientY - this._context.canvas.offsetTop - this._parent._parentContainerY
            this._startClickX = Math.abs((this._x * this._parent._scaleX) - posx);
            this._startClickY = Math.abs((this._y * this._parent._scaleY) - posy);
            this.dispatchEvent(event);
        }
    }

    // Método chamado quando o botão do mouse é liberado sobre este objeto de exibição
    mouseUpHandler(event) {
        if (this._mouseEnabled && this.isMouseOver(event)) {
            this._mouseClicked = false;
            this.dispatchEvent(event);
        }
    }

    // Método chamado quando o mouse se move sobre este objeto de exibição
    mouseMoveHandler(event) {

        if (this._mouseEnabled) {
            if (this.isMouseOver(event)) {
                this.dispatchEvent(event);
                if (!this._mouseOver) {
                    this.dispatchEvent(new MouseEvent("mouseover", event));
                    this._mouseOver = true;
                    this._mouseOut = false;
                }
            } else {
                if (!this._mouseOut) {
                    this.dispatchEvent(new MouseEvent("mouseout", event));
                    this._mouseOut = true;
                    this._mouseOver = false;
                }
            }
        }
    }

    // Método chamado quando o mouse entra na área de exibição deste objeto
    mouseOverHandler(event) {
        if (this._mouseEnabled && this.isMouseOver(event)) {
            if (!this._mouseOver) {
                this.dispatchEvent(event);
            }
        }
    }

    // Método chamado quando o mouse sai da área de exibição deste objeto
    mouseOutHandler(event) {
        if (this._mouseEnabled && !this.isMouseOver(event)) {
            if (!this._mouseOut) {
                this.dispatchEvent(event);
            }
        }
    }

    isMouseOver2(event) {

        var mouseX = event.clientX - this._context.canvas.offsetLeft - this._parent._parentContainerX;
        var mouseY = event.clientY - this._context.canvas.offsetTop - this._parent._parentContainerY;

        if (this._startDrag && this._mouseClicked) {
            this._x = mouseX - this._startClickX;
            this._y = mouseY - this._startClickY;
        }

        return (
            mouseX >= this.x &&
            mouseY >= this.y &&
            mouseX <= this.x + this.width &&
            mouseY <= this.y + this.height
        );
    }

    isMouseOver(event) {
        const mouseX = event.clientX - this._context.canvas.offsetLeft - this._parent._parentContainerX;
        const mouseY = event.clientY - this._context.canvas.offsetTop - this._parent._parentContainerY;
        const scaledWidth = this.width * this._parent.scaleX;
        const scaledHeight = this.height * this._parent.scaleY;
        const objectX = this._x * this._parent.scaleX;
        const objectY = this._y * this._parent.scaleY;

        if (this._startDrag && this._mouseClicked) {
            this._x = (mouseX / this._parent.scaleX) - (this._startClickX / this._parent.scaleX);
            this._y = (mouseY / this._parent.scaleY) - (this._startClickY / this._parent.scaleY);
        }

        return (
            mouseX >= objectX &&
            mouseY >= objectY &&
            mouseX <= objectX + scaledWidth &&
            mouseY <= objectY + scaledHeight
        );
    }


    // Método chamado quando uma tecla é pressionada enquanto este objeto de exibição tem o foco da navegação por teclado
    keyDownHandler(event) { }

    // Método chamado quando uma tecla é liberada enquanto este objeto de exibição tem o foco da navegação por teclado
    keyUpHandler(event) { }

    // Método chamado quando uma tecla é pressionada enquanto este objeto de exibição não tem o foco da navegação por teclado
    keyDownBubbleHandler(event) { }

    // Método chamado quando uma tecla é liberada enquanto este objeto de exibição não tem o foco da navegação por teclado
    keyUpBubbleHandler(event) { }



}

export default InteractiveObject;