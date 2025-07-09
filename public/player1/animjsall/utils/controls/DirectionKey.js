import Event from "../../core/Event.js";
import Behavior from "../behavior/Behavior.js";
import Keyboard from "../keyboard/Keyboard.js";

class DirectionKey extends Behavior {
  /**
   * Classe de comportamento que controla as 
   * teclas do teclado e movimenta o objeto.
   */
  constructor() {
    super();

    this._keyboard = new Keyboard();
    this._keyboard.preventDefault = false;

    this._directionUp = false;
    this._directionDown = false;
    this._directionLeft = false;
    this._directionRight = false;

    this._speed = 5;
    this._friction = 1;
    this._axis = "xy";

    this._keyboard.addEventListener(Event.KEY_DOWN, this._onKeyDown.bind(this));
    this._keyboard.addEventListener(Event.KEY_UP, this._onKeyUp.bind(this));
  }

  /**
   * Ajusta a velocidade do movimento do objeto
   */
  get speed() {
    return this._speed;
  }

  set speed(value) {
    this._speed = value;
  }

  /**
   * Define em quais eixos o objeto pode se mover.
   * Valores possíveis: "x", "y" ou "xy".
   */
  get axis() {
    return this._axis;
  }

  set axis(value) {
    this._axis = value;
  }

  /**
   * Define a fricção para desacelerar o objeto quando as teclas são liberadas.
   * O valor deve estar entre 0 e 1.
   */
  get friction() {
    return this._friction;
  }

  set friction(value) {
    this._friction = value;
  }

  /**
   * Metodo sobrescrito da classe herdada Behavior
   * @param {interactiveObject} object 
   * @returns 
   */
    execute(object) {
        let deltaX = 0;
        let deltaY = 0;

        if (this._axis === "x" || this._axis === "xy") {
        if (this._directionLeft) {
            deltaX -= this._speed;
        }

        if (this._directionRight) {
            deltaX += this._speed;
        }
        }

        if (this._axis === "y" || this._axis === "xy") {
        if (this._directionUp) {
            deltaY -= this._speed;
        }

        if (this._directionDown) {
            deltaY += this._speed;
        }
        }

        if (deltaX !== 0 && deltaY !== 0) {
            const magnitude = Math.hypot(deltaX, deltaY);
            deltaX = (deltaX / magnitude) * this._speed * this._friction;
            deltaY = (deltaY / magnitude) * this._speed * this._friction;
        }

        object.x += deltaX;
        object.y += deltaY;        
    }

    _onKeyDown(event){
        var code = event.target.code;

        switch (code) {
            case 'ArrowLeft': // Tecla da seta para a esquerda
                this._directionLeft= true;
              break;
            case 'ArrowUp': // Tecla da seta para cima
                this._directionUp= true;
              break;
            case 'ArrowRight': // Tecla da seta para a direita
                this._directionRight= true;
              break;
            case 'ArrowDown': // Tecla da seta para baixo
                this._directionDown= true;
              break;
        }

            // Verifica as combinações de teclas
        if (this._directionLeft && this._directionUp) {
            // Diagonal esquerda para cima
            this._directionLeft = true;
            this._directionUp = true;
            this._directionRight = false;
            this._directionDown = false;
        } else if (this._directionLeft && this._directionDown) {
            // Diagonal esquerda para baixo
            this._directionLeft = true;
            this._directionUp = false;
            this._directionRight = false;
            this._directionDown = true;
        } else if (this._directionRight && this._directionUp) {
            // Diagonal direita para cima
            this._directionLeft = false;
            this._directionUp = true;
            this._directionRight = true;
            this._directionDown = false;
        } else if (this._directionRight && this._directionDown) {
            // Diagonal direita para baixo
            this._directionLeft = false;
            this._directionUp = false;
            this._directionRight = true;
            this._directionDown = true;
        }

        
        this.dispatchEvent({type:Event.KEY_DOWN, target:event.target});
    }

    _onKeyUp(event){
        var code = event.target.code;

        switch (code) {
            case 'ArrowLeft': // Tecla da seta para a esquerda
                this._directionLeft= false;
              break;
            case 'ArrowUp': // Tecla da seta para cima
                this._directionUp= false;
              break;
            case 'ArrowRight': // Tecla da seta para a direita
                this._directionRight= false;
              break;
            case 'ArrowDown': // Tecla da seta para baixo
                this._directionDown= false;
              break;
        }

        this.dispatchEvent({type:Event.KEY_UP, target:event.target});
    }

}

export default DirectionKey;