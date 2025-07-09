/*************************************************************************
 * Michael Milanez
 * 
 * Esta classe cria uma ferramenta de seleção em qualquer elemento considerado midia.
 * é importante para o id do elemento que será a midia no construtor, uma mídia pode ser
 * uma imagem, um vídeo, ou até mesmo uma div
 * exemplo:
 * 
 * var maskSelection = new MaskSelection('id da midia em string');
 * maskSelection.addEventListener('COMPLETE', (event)=>{
 *      console.log(event.detail.rect);
 * });
 *  
 */

class MaskSelection extends EventTarget{
    constructor(mediaID){

        super();

        if(typeof mediaID ==='string'){
            this._media = document.getElementById(mediaID);
        }else{
            this._media = mediaID;
        }

        

        this._selectColorPixel = true;

        this._selectionActive = false;
        this._selectionGenerate = false;
        this._initSelection = [0, 0];
        this._rectangleSelection;

        this.startSelecion = this._startSelecion.bind(this);
        this.moveselect = this. _moveselect.bind(this);
        this.finalizeSelection = this._finalizeSelection.bind(this);
        this.handleWindowResize = this._handleWindowResize.bind(this);

        this._createElementSelect();
        this._addEvents();
    }

    get selectColorPixel(){
        return this._selectColorPixel;
    }

    set selectColorPixel(value){
        this._selectColorPixel = value;
    }

    /**
     * Metodo que fecha a mascara de seleção
     */
    close(){
        this._finalizeSelection(null);
    }

    _createElementSelect(){
        this._selection = document.createElement('div');//document.querySelector("#selecao");
        this._selection.id = 'selection';
        this._selection.style.position = 'absolute';
        this._selection.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        this._selection.style.border = '2px dashed #000';
        this._selection.style.pointerEvents = 'none';
        this._selection.classList.add('hide');
        this._media.parentNode.appendChild(this._selection);
    }

    _addEvents(){        
        this._media.addEventListener("mousedown", this.startSelecion);
        this._media.addEventListener("mousemove",this.moveselect);
        this._media.addEventListener("mouseup", this.finalizeSelection);

        window.addEventListener('resize', this.handleWindowResize);
    }

    _removeEvents(){
        this._media.removeEventListener("mousedown", this.startSelecion);
        this._media.removeEventListener("mousemove",this.moveselect);
        this._media.removeEventListener("mouseup", this.finalizeSelection);

        window.removeEventListener('resize', this.handleWindowResize);
    }

    _startSelecion(event) {
        this._selectionActive = true;        
      
        this._selection.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        
        const mediaRectangle = this._media.getBoundingClientRect();
        //const mediaPosition = [this._media.offsetLeft, this._media.offsetTop]; // Adicionado para obter a posição da imagem em relação ao elemento pai
        this._initSelection = [event.clientX - mediaRectangle.left , event.clientY - mediaRectangle.top ];
      }
      
      _moveselect(event) {
        if (this._selectionActive) { 
            this._selection.classList.remove('hide');
            this._selectionGenerate = true;
            this._selection.style.display = 'initial';

            const mediaRectangle = this._media.getBoundingClientRect();
            const mediaPosition = [this._media.offsetLeft, this._media.offsetTop]; // Adicionado para obter a posição da imagem em relação ao elemento pai
            const currentPosition = [event.clientX - mediaRectangle.left, event.clientY - mediaRectangle.top];
        
            const widthSelection = Math.abs(currentPosition[0] - this._initSelection[0]);
            const heightSelection = Math.abs(currentPosition[1] - this._initSelection[1]);
        
            this._selection.style.width = `${widthSelection}px`;
            this._selection.style.height = `${heightSelection}px`;
            this._selection.style.left = `${Math.min(currentPosition[0], this._initSelection[0]) + mediaPosition[0]}px`; // Atualizado para usar a posição da imagem em relação ao elemento pai
            this._selection.style.top = `${Math.min(currentPosition[1], this._initSelection[1]) + mediaPosition[1]}px`; // Atualizado para usar a posição da imagem em relação ao elemento pai
        
            this._rectangleSelection = {
                x: Math.min(this._initSelection[0], currentPosition[0]), // Atualizado para usar a posição da imagem em relação ao elemento pai
                y: Math.min(this._initSelection[1], currentPosition[1]) , // Atualizado para usar a posição da imagem em relação ao elemento pai
                width: widthSelection,
                height: heightSelection
            }                            
        }
    }
    
    _finalizeSelection(event) {
        this._selectionActive = false;

        this.dispatchEvent(new CustomEvent('COMPLETE', {detail:{rect:this._rectangleSelection}}));

        if(this._selectColorPixel && this._selectionGenerate && this._rectangleSelection.width > 1 && this._rectangleSelection.height > 1){
            const canvas = document.createElement('canvas');
            canvas.width = this._rectangleSelection.width;
            canvas.height = this._rectangleSelection.height;

            const context = canvas.getContext('2d');
            context.drawImage(
            this._media,
            this._rectangleSelection.x,
            this._rectangleSelection.y,
            this._rectangleSelection.width,
            this._rectangleSelection.height,
            0,
            0,
            this._rectangleSelection.width,
            this._rectangleSelection.height
            );

            const imageData = context.getImageData(
            0,
            0,
            this._rectangleSelection.width,
            this._rectangleSelection.height
            );

            const pixelData = new Uint32Array(imageData.data.buffer);

            let r = 0, g = 0, b = 0;

            for (let i = 0; i < pixelData.length; i++) {
            const pixel = pixelData[i];
            r += pixel & 0xff;
            g += (pixel >> 8) & 0xff;
            b += (pixel >> 16) & 0xff;
            }

            const pixelCount = pixelData.length;
            const mediaR = Math.round(r / pixelCount);
            const mediaG = Math.round(g / pixelCount);
            const mediaB = Math.round(b / pixelCount);

            this._selection.style.backgroundColor = `rgba(${mediaR}, ${mediaG}, ${mediaB}, 0.5)`;

            this._selectionGenerate = false;
        }else{
            this._selection.style.display = 'none';
            this.dispatchEvent(new CustomEvent('MASK_NONE', {detail:{rect:{x:0, y:0, width:0, height:0}}}));
        }  
        this._selectionGenerate = false;
    }

    _handleWindowResize() {
    
        if (this._rectangleSelection) {
            this._selection.style.width = `${0}px`;
            this._selection.style.height = `${0}px`;
            this._selection.style.left = `${0}px`;
            this._selection.style.top = `${0}px`;
            this._selection.classList.add('hide');
        }
    }

    _removeMaskSelection(){
        this._selection.remove();
    }
    
}

export default MaskSelection