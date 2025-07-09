import Event from "../core/Event.js";
import EventDispatcher from "../core/EventDispatcher.js";
import Stage from "./Stage.js";

class Scene extends EventDispatcher {
    constructor(context2d = null) {
        super()

        this._name = 'Scene';

        this._scenes = [];
        this._currentScene = 0;
        this._currentSubScene = 0;
        this._context2D = context2d;
        this._currentStage = null;

        this._sceneDefault = null;

        this._scaleX = 1;
        this._scaleY = 1;
    }

    get scaleX(){
        this._scaleX;        
    }

    set scaleX(value){
        this._scaleX = value;
        this.updateScale();
    }

    get scaleY(){
        this._scaleY;
    }

    set scaleY(value){
        this._scaleY = value;
        this.updateScale();
    }

    /**
     * Adiciona um child para o stage selecionado
     * @param {InteractiveObject} child 
     */
    addChild(child) {
        this._scenes[this._currentScene][this._currentSubScene].addChild(child);
    }

    /**
     * Remove um child do stage selecionado
     * @param {InteractiveObject} child 
     */
    removeChild(child) { 
        this._scenes[this._currentScene][this._currentSubScene].removeChild(child);
    }

    getChildByName(name){
        return this._scenes[this._currentScene][this._currentSubScene].getChildByName(name);
    }

    getChildrenByType(type) {
        return this._scenes[this._currentScene][this._currentSubScene].getChildrenByType(type);
    }

    disableMouseChildrenByType(type){
        this._scenes[this._currentScene][this._currentSubScene].disableMouseChildrenByType(type);
    }

    enableMouseChildrenByType(type){
        this._scenes[this._currentScene][this._currentSubScene].enableMouseChildrenByType(type);
    }

    updateScale(){
        if(this._scenes.length == 0) return;
        this._scenes[this._currentScene][this._currentSubScene].scaleX = this._scaleX;
        this._scenes[this._currentScene][this._currentSubScene].scaleY = this._scaleY;
    }

    /**
     * Cria um stage novo usando o contexto adicionado no construtor, a resolução e cor.
     * 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} color 
     * @returns 
     */
    // newStage(width, height, color){
    //     if(!this._context2D)return;
    //     var stage = new Stage(this._context2D, width, height, color);
    //     this.addStage(stage);
    // }
    newScene(width = null, height = null, color = null) {
        if (!this._sceneDefault) {
            this._sceneDefault = {
                width: width,
                height: height,
                color: color
            }
        }

        if (width == null && height == null && color == null) {
            width = this._sceneDefault.width;
            height = this._sceneDefault.height;
            color = this._sceneDefault.color;
        }

        if (!this._context2D) return;
        var stage = new Stage(this._context2D, width, height, color);
        stage.scaleX = this._scaleX;
        stage.scaleY = this._scaleY;
        var subScenes = [];
        subScenes.push(stage);
        this._scenes.push(subScenes);
        this._currentStage = stage;

        this.goto(this._scenes.length - 1)

    }

    newSubScene(width, height, color) {
        if (!this._context2D) return;
        var stage = new Stage(this._context2D, width, height, color);
        stage.scaleX = this._scaleX;
        stage.scaleY = this._scaleY;
        this._scenes[this._currentScene].push(stage);
        this._currentStage = stage;


        this.goto(this._currentScene, this._scenes[this._currentScene].length - 1)
    }

    /**
     * Adiciona um stage em uma cena
     * @param {Stage} stage 
     */
    addStage(stage) {
        stage.scene = this;
        var subScenes = [];
        subScenes.push(stage);
        this._scenes.push(subScenes);
        this._currentStage = stage;
    }

    /**
     * remove o stage de uma cena usndo o stage como referência
     */
    removeStage(stage) {
        const index = this._scenes.indexOf(stage);
        if (index !== -1) {
            this._scenes.splice(index, 1);
        }
    }

    /**
    * remove o stage de uma cena usndo o index como referência
    */
    removeStageByIndex(index) {

        if (index !== -1) {
            this._scenes.splice(index, 1);
        }
    }

    /**
    * remove o stage de uma cena usndo o stage como referência
    */
    removeSubScene(stage) {
        const index = this._scenes[this._currentScene].indexOf(stage);
        if (index !== -1) {
            this._scenes[this._currentScene].splice(index, 1);
        }
    }

    /**
    * remove o stage de uma cena usndo o index como referência
    */
    removeSubSceneByIndex(index) {

        if (index !== -1) {
            this._scenes[this._currentScene].splice(index, 1);
        }
    }

    /**
     * Limpa todas as cenas
     */
    removeAll() {
        this._scenes = [];
    }

    /**
     * Retorna o numero de cenas cadastradas
     * @returns int
     */
    nunScenes() {
        return this._scenes.length;
    }

    /**
     * Retorna a quantidade de sub cenas da cena atual.
     * @returns int
     */
    nunCurrentSubScenes() {
        return this._scenes[this._currentScene].length;
    }

    /**
     * Retorna a quantidade de sub cenas da cena selecionada pelo index.
     * @param {int} index 
     * @returns int
     */
    nunSubcenes(index) {
        return this._scenes[index].length;
    }


    /**
     * seleciona uma cena
     * @param {Int} scene 
     */
    goto(scene, subScene = 0) {

        if (!this._sceneIsvalid(scene)) return;
        if (!this._subSceneIsvalid(subScene)) return;

        this.activeOrDeactiveComponentInteractive(false);

        this._scenes[this._currentScene][this._currentSubScene].end();
        this._currentScene = scene;
        this._currentSubScene = subScene;
        this._scenes[this._currentScene][this._currentSubScene].start();
        this._currentStage = this._scenes[this._currentScene][this._currentSubScene];

        this.activeOrDeactiveComponentInteractive(true);

        this.updateScene();
    }

    activeOrDeactiveComponentInteractive(status){
        var componentInteractives = this.getChildrenByType('componentInteractive');

        if(!componentInteractives) return;

        for(var i=0; i < componentInteractives.length; i++){
            if(status){
                componentInteractives[i].on();
            }else{
                componentInteractives[i].off();
            }
        }
    }

    /**
     * Avança uma cena
     */
    nextScene() {
        var position = this._currentScene + 1;
        this.goto(position);
        //this.updateScene();
    }

    /**
     * Volta uma cena
     */
    prevScene() {
        var position = this._currentScene - 1;
        this.goto(position);
        //this.updateScene();
    }

    /**
     * Avança uma subCena
     */
    nextSubScene() {
        var position = this._currentSubScene + 1;
        this.goto(this._currentScene, position);
        //this.updateScene();
    }

    /**
     * Volta uma subCena
     */
    prevSubScene() {
        var position = this._currentSubScene - 1;
        this.goto(this._currentScene, position);
        //this.updateScene();
    }

    /**
     * Ativa o funcionamento da cena
     */
    play(){
        this._scenes[this._currentScene][this._currentSubScene].start();
    }

    /**
     * Para o funcionamento da cena 
     */
    stop(){
        this._scenes[this._currentScene][this._currentSubScene].end();
    }

    updateScene() {
        this.dispatchEvent({ type: Event.UPDATE_SCENE, target: this });
    }

    _sceneIsvalid(index) {
        var result = true;

        if (index < 0 || index >= this._scenes.length) {
            result = false;
        }

        return result;
    }

    _subSceneIsvalid(index) {
        var result = true;

        if (index < 0 || index >= this._scenes[this._currentScene].length) {
            result = false;
        }

        return result;
    }

}

export default Scene;