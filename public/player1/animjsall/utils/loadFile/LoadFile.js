/*
    Classe responsáavel em carregar arquivos.
*/

class LoadFile{
    constructor(multiple=false, type=""){
        this._input = document.createElement("input");
        this._input.type = "file";
        this._input.multiple = multiple;
        this._input.accept = type;
        this._input.style.display = "none";
        this._input.addEventListener('change', this._onChangeHandler.bind(this));

        this.functionCallBack = null;
    }

    open(func){
        this.functionCallBack = func;
        this._input.click();
    }

    _onChangeHandler(event){
        if(this.functionCallBack) this.functionCallBack(this._input.files);
    }




}

export default LoadFile;