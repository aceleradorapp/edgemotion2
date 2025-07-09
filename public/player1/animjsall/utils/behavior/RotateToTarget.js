/**
 * Rotaciona o objeto para que mantenha a face sempre voltada para
 * o objeto target;
 */
import Behavior from "./Behavior.js";


class RotateToTarget extends Behavior {
  constructor() {
    super();
    this._objectTarget = null;
    this._rotationInit = 0;
  }

  /**
   * Seta a posição inicial da rotação do objeto;
   */
  get rotationInit(){
    return this._rotationInit;
  }

  set rotationInit(value){
    this._rotationInit = value;
  }

  /**
   * Recebe o objeto que será usado como referência da direção
   * que o objeto será rotacionado
   * @param {InteractiveObject} objectTarget 
   */
  objectTarget(objectTarget){
    this._objectTarget = objectTarget;
  }

  execute(object) {
    if (!object.parent) return;
    if(!this._objectTarget) return;

    const deltaX = this._objectTarget.x - object.x;
    const deltaY = this._objectTarget.y - object.y;
    var angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
    angle = angle < 0 ? angle + 360 : angle;
    object.rotate = angle + this._rotationInit;
  }
}

export default RotateToTarget;
