/**
  A classe MovieClip é uma subclasse de Sprite que adiciona a capacidade de reproduzir animações.
  Ela possui métodos para definir e controlar a linha do tempo da animação, para controlar a 
  reprodução da animação e para gerenciar os quadros-chave da animação.
*/

import DisplayObjectContainer from "./DisplayObjectContainer.js";
import Sprite from "./Sprite.js";

class MovieClip extends DisplayObjectContainer {
  constructor() {
    super();

    this.frames = [];
    this._currentFrame = 0;
    this.isPlaying = false;
    this._fps = 24;
    this._looping = true;

    this.lastTime = 0;
    this._animationFrames = null;

    //this.addFrame();
  }

  /**
   * Altera a quantidade de frames por segundo p padrão é 24fps
   */
  get fps() {
    return this._fps;
  }

  set fps(value) {
    this._fps = value;
  }

  get looping() {
    return this._looping;
  }

  set looping(value) {
    this._looping = value;
  }

  get currentFrame(){
    return this._currentFrame;
  }

  set currentFrame(value){
    this._currentFrame = value;
  }

  get totalFrame() {
    return this._frames.length;
  }

  // Adiciona um quadro ao MovieClip
  addFrame() {
    var sprite = new Sprite();
    this.frames.push(sprite);
    
  }

  /**
   * Remove um frame do componente
   * @param {int} index 
   */
  removeFrame(index) {
    if (index !== -1) {
      this._frames.splice(index, 1);
    }
  }

  /**
   * Cria uma quantidade de frames expecifica.
   * @param {int} value 
   */
  addFrames(value) {
    for (var i = 0; i < value; i++) {
      this.addFrame();
    }
  }

  addChild(child) {
    //this.frames[this._currentFrame].addChild(child);
    child._parentContainerX = this._parent._parentContainerX + this.x;
    child._parentContainerY = this._parent._parentContainerY + this.y;
    
    this.frames.push(child);    
  }

  // Reproduz o MovieClip a partir do quadro atual
  play() {
    this.isPlaying = true;
    this._loop();
  }

  // Pausa a reprodução do MovieClip
  stop() {
    cancelAnimationFrame(this._animationFrames);
    this.isPlaying = false;
  }

  // Loop de reprodução do MovieClip
  _loop(timestamp) {
    if (this.isPlaying) {
      if (!this.lastTime) this.lastTime = timestamp;
      const deltaTime = timestamp - this.lastTime;
      const fps = this._fps;
      if (deltaTime > 1000 / fps) {
        this.lastTime = timestamp;
        this._currentFrame++;
        /// aqui é chamando 24 FPS em um segundo ()
        if (this._currentFrame >= this.frames.length) {
          if (this._looping) {
            this._currentFrame = 0;
          }else{
            this.stop();
          }
        }
        this.gotoAndStop(this._currentFrame);
      }
      this._animationFrames = requestAnimationFrame((timestamp) => this.loop(timestamp));
    }
  }

  // Vai para o quadro especificado
  gotoAndStop(frame) {
    this.stop();
    this._currentFrame = frame;
    this.frames[frame];
  }

  gotoAndPlay(frame) {
    this._currentFrame = frame;
    this.frames[frame];
    this.play();
  }

  /**
   * Avança frame
   */
  next() {
    this._currentFrame++;
    this.frames[this._currentFrame];
  }

  /**
   * Retorna frame.
   */
  prev() {
    this._currentFrame--;
    this.frames[this._currentFrame];
  }

  // Obtém o número total de quadros do MovieClip
  getTotalFrames() {
    return this.frames.length;
  }

  draw(context2d) {
    this.frames[this._currentFrame].render(context2d);
  }
}

export default MovieClip;
