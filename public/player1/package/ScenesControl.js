import { Scene, Event } from "../animjsall/Animjs.js";
import { EventDispatcher, ComponentEvent } from "../animjsall/Animjs.js";
import { VideoView, Click ,ClickAndDrag ,Screen, KeyboardText } from "../animjsall/Animjs.js";

class ScenesControl extends EventDispatcher {
    constructor(canvasId, resolution) {
        super()

        this.urlSuport = null;
        this.dataSource = null;
        this.resolution = resolution;
        this.scaleProject = 0.9;

        this.canvas = document.getElementById(canvasId);
        this.canvas.width = this.resolution.width;
        this.canvas.height = this.resolution.height;
        this.originalCanvasWidth = this.canvas.width;
        this.originalCanvasHeight = this.canvas.height;
        this.context2d = canvas.getContext('2d');
        this.scenes = new Scene(this.context2d);
        this.scenes.scaleX = 1;
        this.scenes.scaleY = 1;

        this.currentScenes = { scene: null, subscene: null };
        this.scenesLoadedTemp = [];
        this._playerActive = false;
        this._loadingTotal = 0;
        this._loadedTotal = 0;
        this._modeInteractive = true;

        // evento disparado da cena quando completa
        this.scenes.addEventListener(Event.UPDATE_SCENE, (e) => {
            this.currentScenes.scene = e.target._currentScene;
            this.currentScenes.subscene = e.target._currentSubScene;

            if (!this._playerActive) return;

            this.dispatchEvent({ type: 'UPDATE_SCENE_COMPLETE', currentScenes: this.currentScenes });
        });

        window.addEventListener('resize', () => {
            this._resize();
        });
    }

    source(dataSource) {
        if (!dataSource.data) return;

        this.urlSuport = dataSource.urlSuportData;
        this.dataSource = dataSource.data;
    }

    start() {
        this._loadingTotal = 0;

        for (let i = 0; i < this.dataSource.length; i++) {
            for (let j = 0; j < this.dataSource[i].length; j++) {                
                this._loadingTotal++;
            }
        }

        for (let i = 0; i < this.dataSource.length; i++) {
            for (let j = 0; j < this.dataSource[i].length; j++) {
                let scene = this.dataSource[i][j];
                let typeScene = null;

                if (j == 0) {
                    typeScene = 'scene';
                } else {
                    typeScene = 'subScene';
                }

                //this._loadingTotal++;
                this._createComponent(scene, typeScene, { scene: i, subscene: j });
            }
        }
    }

    zoom(value) {
        this.scaleProject = value;
        this.scenes.scaleX = this.scaleProject;
        this.scenes.scaleY = this.scaleProject;

        this.canvas.width = this.originalCanvasWidth * this.scaleProject;
        this.canvas.height = this.originalCanvasHeight * this.scaleProject;
    }


    nextSubscene() {
        this.scenes.nextSubScene();
        this.zoom(this.scaleProject);
    }

    prevSubscene() {
        this.scenes.prevSubScene();
        this.zoom(this.scaleProject);
    }

    nextScene() {
        this.scenes.nextScene();
        this.zoom(this.scaleProject);
    }

    prevScene() {
        this.scenes.prevScene();
        this.zoom(this.scaleProject);
    }

    addChild(child) {
        this.scenes.addChild(child);
    }

    removeChild(child) {
        this.scenes.removeChild(child);
    }

    modeInteractive(status){
        this._modeInteractive = status;
    }

    goto(scene, subScene){
        this.scenes.goto(scene, subScene);
    }

    _resize() {
        const content = this.canvas.parentElement;
        const contentWidth = content.clientWidth - 10;
        const contentHeight = content.clientHeight - 10;

        const scaleX = contentWidth / this.originalCanvasWidth;
        const scaleY = contentHeight / this.originalCanvasHeight;

        const scale = Math.min(scaleX, scaleY);

        this.scaleProject = scale;

        this.zoom(this.scaleProject);
    }

    /**
     * Neste método é verificado que tipo de cena é e 
     * instancia o componente interativo e carrega a todos 
     * os recursos que o componente ira usar.
     * 
     * @param {Object} scene 
     * @param {String} typeScene 
     * @param {Object(cena int, subcena int)} indexScenes 
     */
    _createComponent(scene, typeScene, indexScenes) {
        if (scene.name == 'CLICK') {
            this._onclickComplete(scene, typeScene, indexScenes);
        }else if(scene.name == 'SCREEN'){
            this._onScreenComplete(scene, typeScene, indexScenes);
        }else if(scene.name == 'KEYBOARD'){
            this._onKeyboardComplete(scene, typeScene, indexScenes);
        }else if(scene.name == 'CLICK_AND_DRAG'){
            this._onClickAndDragComplete(scene, typeScene, indexScenes);
        }else if(scene.name == 'VIDEO'){
            this._onVideoComplete(scene, typeScene, indexScenes);
        }
    }

    /**
     * Método esclusivo para criar o componente clickButton, 
     * é nele que o componente é instanciado, recebe todos os parametros e 
     * todos os recursos necessários para o seu funcionamento;
     * 
     * @param {Event} event 
     * @param {String} typeScene 
     * @param {Object} scene 
     * @param {Object} indexScenes 
     */
    _onclickComplete(scene, typeScene, indexScenes) {        

        //Envia o componente para ser inserido em uma lista.
        
        var action = scene.action;
        var click = new Click(scene);
        click.addAction(action.action);
        click.off();

        click.addEventListener(ComponentEvent.ACTION, (event) => {
            if(!this._modeInteractive) return;
            
            this._actionHandler(event, action);
        });

        this._addComponentsTemp(typeScene, indexScenes, click);
    }   

    //************************************************************************************************************/
    // Fim do componente click
    //************************************************************************************************************/

    _onScreenComplete(scene, typeScene, indexScenes){        
        var action = scene.action;
        var screen = new Screen(scene.object.image);
        screen.timeAction = scene.object.time;
        screen.off();

        screen.addEventListener(ComponentEvent.ACTION, (event) => {
            if(!this._modeInteractive) return;
            
            this._actionHandler(event, action);
        });

        this._addComponentsTemp(typeScene, indexScenes, screen);
    }

    _onKeyboardComplete(scene, typeScene, indexScenes){
        var action = scene.action;
        var keyboardText = new KeyboardText(scene);
        keyboardText.off();

        keyboardText.addEventListener(ComponentEvent.ACTION, (event) => {
            if(!this._modeInteractive) return;
            
            this._actionHandler(event, action);
        });

        keyboardText.addEventListener('key-corret', (event)=>{
            this.dispatchEvent({ type: 'KEYBOARD-COMPONENT-MESSAGE-CORRECT', wrong: event.char });
        });

        keyboardText.addEventListener('key-wrong', (event)=>{
            this.dispatchEvent({ type: 'KEYBOARD-COMPONENT-MESSAGE-WRONG', wrong: event.char });
        });

        this._addComponentsTemp(typeScene, indexScenes, keyboardText);
    }

    _onClickAndDragComplete(scene, typeScene, indexScenes){
        var action = scene.action;
        var clickAndDrag = new ClickAndDrag(scene);

        //clickAndDrag.initDebug();
        clickAndDrag.off();

        clickAndDrag.addEventListener(ComponentEvent.ACTION, (event) => {
            if(!this._modeInteractive) return;
            
            this._actionHandler(event, action);
        });

        this._addComponentsTemp(typeScene, indexScenes, clickAndDrag);
    }

    _onVideoComplete(scene, typeScene, indexScenes){
        var action = scene.action;
        
        // atualiza o diretorio do curso de acordo com o banco de dados.
        scene.object.url = this.urlSuport;

        var videoView = new VideoView(scene);
        videoView.off();

        videoView.addEventListener(ComponentEvent.ACTION, (event) => {
            if(!this._modeInteractive) return;
            
            this._actionHandler(event, action);
        });

        this._addComponentsTemp(typeScene, indexScenes, videoView);
    }

    /**
     * Adiciona o componente instanciados em uma lista para ser adicionado
     * no palco de acordo com a sequencia correta da cena ou subcena.
     * @param {String} typeScene
     * @param {Object} indexScenes 
     * @param {ObjectInteractive} component 
     */
    _addComponentsTemp(typeScene, indexScenes, component) {

        if (typeScene == 'scene') {
            this.scenesLoadedTemp[indexScenes.scene] = [];
            this.scenesLoadedTemp[indexScenes.scene].push(component);
        } else {
            this.scenesLoadedTemp[indexScenes.scene].push(component);
        }

        this._loadedTotal++;
        this.dispatchEvent({ type: 'SCENES_PROGRESS', progress: {loaded:this._loadedTotal, total:this._loadingTotal} });

        if (this._loadingTotal == this._loadedTotal) {
            // Por padrão, depois que todos os objetos estão prontos e 
            //carregados as cenas são carregas.
            this._loadScenes();
            this._resize();
            this.dispatchEvent({ type: 'LOAD_COMPLETE_SCENES', target: true });
        }
    }

    /**
     * Este método é responsável em carregar todos os componentes 
     * interativos na cena prorpriamente dito.
     */
    _loadScenes() {
        for (let i = 0; i < this.scenesLoadedTemp.length; i++) {
            for (let j = 0; j < this.scenesLoadedTemp[i].length; j++) {
                let scene = this.scenesLoadedTemp[i][j];

                if (j == 0) {
                    this.scenes.newScene(this.resolution.width, this.resolution.height, '#000');
                    this.scenes.addChild(scene);
                } else {
                    this.scenes.newSubScene(this.resolution.width, this.resolution.height, '#000');
                    this.scenes.addChild(scene);
                }
            }
        }

        this._playerActive = true;
        this.scenes.goto(0, 0);
        this.scenes.activeOrDeactiveComponentInteractive(true);
        this.zoom(this.scaleProject);
    }

    // envia o comportamento da ação.
    _actionHandler(event, action) {
        var behavior = action.behavior;

        if (event.state == action.action) {
            //this._behaviorHandler(behavior);
        } else {
            return;
        }
        
        this.dispatchEvent({ type: 'ACTION_COMPLETE', behavior });
        // Dispara para informar que a ação já foi concluida.
    }

    // Controla o comportamento do do player, avança a cena ou subcena.
    _behaviorHandler(behavior) {
        if (behavior == 'next') {
            this.scenes.nextSubScene();
        } else if (behavior == 'next-scene') {
            this.scenes.nextScene();
        }
    }


}

export default ScenesControl;