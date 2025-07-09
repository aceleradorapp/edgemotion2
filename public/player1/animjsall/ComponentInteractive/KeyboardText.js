import DisplayObjectContainer from "../display/DisplayObjectContainer.js";
import ComponentEvent from "../core/ComponentEvent.js";
import Keyboard from "../utils/keyboard/Keyboard.js";

class KeyboardText extends DisplayObjectContainer {
  constructor(data) {
    super();
    this._type = 'componentInteractive';
    this._name = 'keyboard';

    this.keyboard = new Keyboard();

    this._data = data;
    this._typeCompare = data.object.typeCompare;
    this._text = data.object.textBase;
    this._currentIndex = 0;
    this._correct = true;

    this._onCorrect = this.onCorrect.bind(this);
    this._onWrong = this.onWrong.bind(this);
    this._onFinished = this.onFinished.bind(this);

    this.background = '';
    this.sequence = [];
    this.bounce = { x: 0, y: 0 };

    this._prepareImages();
  }

  on() {
    this._addEvents()
    this.start();
  }

  off() {
    this._removeEvents();
  }

  start() {
    this._currentIndex = 0;
    this._correct = true;
    if (this._typeCompare == 'text') {
      this.keyboard.addTextCompare(this._text);
    } else {
      this.keyboard.addKeysCombination(this._text);
    }
  }

  _prepareImages() {
    this.background = new Image();
    this.background.src = this._data.object.imageBackground;

    for (var i = 0; i < this._data.object.imageSequence.length; i++) {
      let imagem = new Image();
      imagem.src = this._data.object.imageSequence[i].image;
      this.bounce.x = this._data.object.imageSequence[i].x;
      this.bounce.y = this._data.object.imageSequence[i].y;
      this.sequence.push(imagem);
    }
  }

  _addEvents() {
    this.keyboard.addEventListener('FINISHED', this._onFinished);
    this.keyboard.addEventListener('CORRECT', this._onCorrect);
    this.keyboard.addEventListener('WRONG', this._onWrong);
    this.keyboard.addEvents();
  }

  _removeEvents() {
    this.keyboard.removeEventListener('FINISHED', this._onFinished);
    this.keyboard.removeEventListener('CORRECT', this._onCorrect);
    this.keyboard.removeEventListener('WRONG', this._onWrong);
    this.keyboard.removeEvents();
  }

  onFinished(event) {
    console.log('Acabou - enviar a ação');
    this._removeEvents();
    this.dispatchEvent({ type: ComponentEvent.ACTION, state: 'up' });
  }

  onCorrect(event) {
    this._currentIndex++;
    this.dispatchEvent({ type: 'key-corret', char:  event.key });    
  }

  onWrong(event) {
    this.dispatchEvent({ type: 'key-wrong', char:  event.key });
    //console.log('errado -- ' + event.key);
  }

  draw(context2d) {

    if (this._currentIndex > (this.sequence.length - 1)) {
      this._currentIndex = this.sequence.length - 1;
    }

    context2d.drawImage(this.background, 0, 0);
    context2d.drawImage(this.sequence[this._currentIndex], this.bounce.x, this.bounce.y);
  }

}

export default KeyboardText