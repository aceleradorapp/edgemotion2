/*****************************************************************
 * Michael Milanez
 * Classe responsável em criar uma timeline em html usando 
 * como base uma div de referência sua a seu seletor;
 * 
 * exemplo:
 * 
 * <div class="timeline-box"></div>
 * 
 * var timelineControl = new TimelineControl('.timeline-box');
 * 
 */
import KeyboardControl from "../keyboard/Keyboard.js";

class TimelineControl extends EventTarget{
    constructor(selector){
        super();

        this.timeLine = new TimelineStructor(selector);
        this._keyboardControl = new KeyboardControl();

        this._canvas = this.timeLine.canvas;
        this._context = this._canvas.getContext('2d');

        this._pixelsPerSecond = null;
        this._pointers = [];
        this._videoDuration = 0;
        this._currentTime = 0;
        this._zoom = 100;

        this._animationFrames = null;

        this.initTimeline = this._initTimeline.bind(this);
        this.updateProgress = this._updateProgress.bind(this);
        this.dblClick = this._dblClickHandler.bind(this);
        this.click = this._clickHandler.bind(this);

        
        window.addEventListener("resize", this.initTimeline);
        //window.addEventListener("load", this.updateVideoData);
        this._canvas.addEventListener('dblclick', this.dblClick);
        this._canvas.addEventListener('click', this.click);

        this._setShortcutKey();
    }

    get currentTime(){
        return this._currentTime;
    }

    set currentTime(value){
        this._currentTime = value;
    }

    get duration(){
        return this._videoDuration;
    }

    set duration(value){
        this._videoDuration = value;
    }

    get zoom(){
        return this._zoom;
    }


    // inicia a timeline
    start(){
        this._initTimeline();
        this._enterFrame();
    }

    stop(){
        this.timeLine.timelineContainer.remove();
    }

    zoom(value){
        this._zoom = value;
        this.timeLine.timelineContainer.style.width = this._zoom+'%';
        this._initTimeline();
    }

    addBreackPoint(position){
        this.timeLine.createPointer(position);
    }

    setProgress(currentTime){
        this._currentTime = currentTime;
    }

    _dblClickHandler(event){
        var posX = event.offsetX;
        var posY = event.offsetY;

        var mark = {
            posX: null,
            pointer:null,
            time:null,
            updatePosition: (pixelsPerSecond)=>{
                let posx = mark.posX;
                posx * pixelsPerSecond;
                mark.pointer.style.left = (posx) + 'px';
            }
        }

        if(posY < 16){
            if(this._pointers.length < 2){
                var direction = this._pointers.length === 0? 'left' : 'right'
                mark.posX = posX;
                mark.pointer = this.timeLine.createPointer(posX, direction);
                mark.time = this._currentTime;
                this._pointers.push(mark);
            }else{
                this.timeLine.removePointer();
                this._pointers = [];
            }            
        }
    }

    _clickHandler(event){
        var posX = event.offsetX;
        var posY = event.offsetY;
        var time = this._calcPixel(posX);

        if(posY > 16){
            var click = {x: posX, y: posY, time:time};
            this.dispatchEvent(new CustomEvent('CLICK', {detail:click}));                        
        }
    }


    // Desenha as marcações de segundo na timeline
    _drawTicks(){
        var totalSeconds = this._videoDuration;
        this._pixelsPerSecond = this._getPixelsPerSecond(totalSeconds);

        this._context.strokeStyle = "gray";
        this._context.lineWidth = 1;

        this._context.beginPath();
        this._context.rect(0, 18, this._canvas.width, this._canvas.height/2);
        this._context.fillStyle = '#007bff';
        this._context.fill();
        this._context.closePath();

        for (var i = 1; i < totalSeconds; i++) {
            var x = i * this._pixelsPerSecond;
            this._context.beginPath();

            if(i % 10 === 0){
                this._context.moveTo(x, 0);
                this._context.lineWidth = 2;
            }else{
                this._context.moveTo(x, 6);
                this._context.lineWidth = 1;
            }

            this._context.lineTo(x, 16);
            this._context.stroke();
        }
    }

    _getPixelsPerSecond(totalSecond){     
        return this._canvas.width / totalSecond;
    }

    // arrumar a nomenclatura do metodo
    _calcPixel(pixel){
        return pixel / this._pixelsPerSecond;
    }

    _secondToPixel(currentTime){
        return currentTime * this._pixelsPerSecond
    }

    _updateProgress(){
        var progress = this.timeLine.timelineProgress;
        progress.style.width = this._currentTime * this._pixelsPerSecond + "px";
    }

    _initTimeline(){
        this._canvas.width = this._canvas.offsetWidth;
        this._canvas.height = this._canvas.offsetHeight;
        
        this._drawTicks();
        this._updateProgress();
        
        if(this._pointers.length > 0){
            this._pointers[0].updatePosition(this._pixelsPerSecond);
            this._pointers[1].updatePosition(this._pixelsPerSecond);
        }
    }

    _enterFrame(){
        this._updateProgress();

        this.dispatchEvent(new CustomEvent('ENTER_FRAME', {detail:this}));
        this._animationFrames = requestAnimationFrame(this._enterFrame.bind(this));
    }

    _removeEnterFrame(){
        if(this._animationFrames)  cancelAnimationFrame(this._animationFrames);       
    }

    _setShortcutKey(){
        this._keyboardControl.preventDefault = false;
        this._keyboardControl.repeatKey = false;

        var mark = {
            posX: null,
            pointer:null,
            time:null,
            updatePosition: (pixelsPerSecond)=>{
                let posx = mark.posX;
                posx * pixelsPerSecond;
                mark.pointer.style.left = (posx) + 'px';
            }
        }

        // F9 - cria o pointer de marcação
        this._keyboardControl.comparekeys('f9', ()=>{
            if(this._pointers.length < 2){                
                var posX = this._secondToPixel(this._currentTime);// * this._pixelsPerSecond;
                var direction = this._pointers.length === 0? 'left' : 'right';
                mark.posX = posX;
                mark.pointer = this.timeLine.createPointer(posX, direction);
                mark.time = this._currentTime;
                this._pointers.push(mark);
            }else{

                this.timeLine.removePointer();                
                this._pointers = [];
            } 
        });
    }
}


/**
 * Classe privada para criação da estrutura da timeline.
 */
class TimelineStructor{
    constructor(selector){
        this.timelineBox = document.querySelector(selector);

        // cria os elementos que serão utilizados para 
        //criar a estrutura do timeline em html
        this.timelineContainer = document.createElement('div');
        this.canvas = document.createElement('canvas');
        this.timelineRuler = document.createElement('div');
        this.timelineTickStart = document.createElement('div');
        this.timelineTickEnd = document.createElement('div');
        this.timelineProgress = document.createElement('div');

        this._createClassName();
        this._createIdElement();
        this._createStructorTimeline();
        this._createStyleElemts();

    }

    createPointer(x, direction){
        var pointer = this._pointer(x, direction);
        this.timelineContainer.appendChild(pointer);
        return pointer;
    }

    removePointer(){
        var pointerElements = document.querySelectorAll('.pointer');

        for (var i = 0; i < pointerElements.length; i++) {
            pointerElements[i].remove();
        }
    }

    _createClassName(){
        this.timelineContainer.classList.add('timeline-container');
        this.timelineRuler.classList.add('timeline-ruler');
        this.timelineTickStart.classList.add('timeline-tick');
        this.timelineTickEnd.classList.add('timeline-tick');
        this.timelineProgress.classList.add('timeline-progress');
    }

    _createIdElement(){
        this.canvas.id = 'timeline';
        this.timelineTickStart.id = 'timeline-start';
        this.timelineTickEnd.id = 'timeline-end';
    }

    _createStructorTimeline(){
        this.timelineContainer.appendChild(this.canvas);
        this.timelineContainer.appendChild(this.timelineRuler);
        this.timelineRuler.appendChild(this.timelineTickStart);
        this.timelineRuler.appendChild(this.timelineTickEnd);
        this.timelineContainer.appendChild(this.timelineProgress);

        this.timelineBox.appendChild(this.timelineContainer);
    }

    _createStyleElemts(){
        this.timelineBox.style.maxWidth = '99.9%';
        this.timelineBox.style.overflowX = 'auto';
        this.timelineBox.style.overflowY = 'hidden';
        this.timelineBox.style.backgroundColor = '#0000001c';

        this.timelineContainer.style.position = 'relative';
        this.timelineContainer.style.height = '40px';
        this.timelineContainer.style.width = '100%';
        this.timelineContainer.style.backgroundColor = '#f2f2f2';
        this.timelineContainer.style.borderRadius = '4px';
        this.timelineContainer.style.border = '2px solid #0000002b';
        this.timelineContainer.style.overflow = 'hidden';

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        this.timelineRuler.style.position = 'absolute';
        this.timelineRuler.style.top = '50%';
        this.timelineRuler.style.transform = 'translateY(-50%)';
        this.timelineRuler.style.height = '2px';
        this.timelineRuler.style.width = '100%';
        this.timelineRuler.style.backgroundColor = '#787878';

        this.timelineTickStart.style.position = 'absolute';
        this.timelineTickStart.style.top = '50%';
        this.timelineTickStart.style.transform = 'translateY(-50%)';
        this.timelineTickStart.style.width = '2px';
        this.timelineTickStart.style.height = '10px';
        this.timelineTickStart.style.backgroundColor = '#000000';
        this.timelineTickStart.style.left = '0';

        this.timelineTickEnd.style.position = 'absolute';
        this.timelineTickEnd.style.top = '50%';
        this.timelineTickEnd.style.transform = 'translateY(-50%)';
        this.timelineTickEnd.style.width = '2px';
        this.timelineTickEnd.style.height = '10px';
        this.timelineTickEnd.style.backgroundColor = '#000000';
        this.timelineTickEnd.style.right = '0';

        this.timelineProgress.style.position = 'absolute';
        this.timelineProgress.style.top = '17px';
        this.timelineProgress.style.left = '0';
        this.timelineProgress.style.height = '55%';
        this.timelineProgress.style.width = '0';
        this.timelineProgress.style.backgroundColor = '#0000003a';
        this.timelineProgress.style.borderRight = '2px solid #000';
        this.timelineProgress.style.pointerEvents = 'none';
    }

    _pointer(x, direction){
        var pointer = document.createElement('div');
        pointer.classList.add('pointer');
        pointer.style.position = 'absolute';
        pointer.style.top = '0px';
        pointer.style.left = x + 'px';

        pointer.style.borderTop= '8px  solid transparent';

        if(direction=='left'){
            pointer.style.borderLeft= '8px  solid #ff0505';
            pointer.style.left = (x-7) + 'px';
        }else{
            pointer.style.borderRight= '8px  solid #ff0505';
        }

        pointer.style.borderBottom= '8px  solid transparent';
        pointer.style.cursor = 'ew-resize';        

        return pointer;
    }

}

export default TimelineControl;
