import Button from "../Component/button/Button.js";
import Event from "../core/Event.js";
import ComponentEvent from "../core/ComponentEvent.js";
import DisplayObjectContainer from "../display/DisplayObjectContainer.js";

class ClickButton extends DisplayObjectContainer {
    constructor(spriteSheetData = null) {
        super()
        this._type = 'componentInteractive';
        this._name = 'clickButton';
        

        this._button = null;
        this._spriteShetData = spriteSheetData;
        this._spriteShetData.addEventListener(Event.LOAD_COMPLETE, this._setAreaAction.bind(this));

        this._keyBackground = this._spriteShetData.getIndexByName('background');
        this._keyUp = this._spriteShetData.getIndexByName('up');
        this._keyDown = this._spriteShetData.getIndexByName('down');
        this._keyOver = this._spriteShetData.getIndexByName('over');

        this._background = null;
        this._up = null;
        this._down = null;
        this._over = null;

        this._keyInteration = null;

        this._action = 'next';

        this._clickAction = {
            x: this._keyUp.origin.x,
            y: this._keyUp.origin.y,
            width: this._keyUp.origin.w,
            height: this._keyUp.origin.h
        };


        this._button = new Button();
        this._button.debug = false;
        this._button.addEventListener(Event.MOUSE_STATE, this._onMouseState.bind(this));
        // this._button.startDrag = true;

    }

    get clickAction() {
        return this._clickAction;
    }

    set clickAction(rectangle) {
        this._clickAction = rectangle;
    }

    on(){
        this._button.addEvents();
    }

    off(){
        this._button.removeEvents();
    }

    _onMouseState(event) {
        var stateMouse = event.target.state;

        if (!this._mouseEnabled) return; // usado para nã enviar a ação par ao player

        this.dispatchEvent({ type: ComponentEvent.ACTION, state: event.target.state });
    }

    _setAreaAction() {
        var dataImage = this._spriteShetData.getDataImage(this._keyBackground.index);
        this.width = dataImage.w;
        this.height = dataImage.h;

        this._button.width = this._clickAction.width;
        this._button.height = this._clickAction.height;
        this._button.x = this._clickAction.x;
        this._button.y = this._clickAction.y;

        this._parent.addChild(this._button);

        this._background = this._spriteShetData.getImageByName('background');
        this._up = this._spriteShetData.getImageByName('up');
        this._down = this._spriteShetData.getImageByName('down');
        this._over = this._spriteShetData.getImageByName('over');

        this.off();
    }

    draw(context2d) {
        // background
        if(!this._background) return;
        //this._spriteShetData.drawImage(this._keyBackground.index,context2d, this._parentContainerX, this._parentContainerY);
        context2d.drawImage(this._background.image, 0, 0);
        if (this._button.state == 'up') {
            // UP
            //this._spriteShetData.drawImage(this._keyUp.index,context2d, this._parentContainerX  + this._keyUp.origin.x, this._parentContainerY + this._keyUp.origin.y);
            context2d.drawImage(this._up.image, this._parentContainerX + this._keyUp.origin.x, this._parentContainerY + this._keyUp.origin.y);
        } else if (this._button.state == 'down') {
            //Down
            //this._spriteShetData.drawImage(this._keyDown.index,context2d, this._parentContainerX  + this._keyDown.origin.x, this._parentContainerY + this._keyDown.origin.y);
            context2d.drawImage(this._down.image, this._parentContainerX + this._keyDown.origin.x, this._parentContainerY + this._keyDown.origin.y);
        } else if (this._button.state == 'over') {
            //Over
            //this._spriteShetData.drawImage(this._keyOver.index,context2d, this._parentContainerX  + this._keyOver.origin.x, this._parentContainerY + this._keyOver.origin.y);
            context2d.drawImage(this._over.image, this._parentContainerX + this._keyOver.origin.x, this._parentContainerY + this._keyOver.origin.y);
        }
    }
}

export default ClickButton;