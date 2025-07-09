import { Event, EventDispatcher } from "../animjsall/Animjs.js";
import ArrowTemplate from "./ArrowTemplate.js";

class ArrowConfig extends EventDispatcher {
    constructor() {
        super()

        this.scenesControl = null;
        this.scenesData = null;
        this.sceneResourceList = [];
        this.arrowActive = null;
        this.windowConfigElement = null;

        this.clickArrow = this.onArrowClickHandler.bind(this);
        this.doubleClickArrow = this.onArrowDoubleClickHandler.bind(this);
        this.enterFrameArrow = this.onEnterFrameArrowHandler.bind(this);

        this.fileModified = false;
        this.arrowDataOriginal = null;
    }

    removeArrowsScene() {
        if (this.sceneResourceList.length == 0) return;

        for (let i = 0; i < this.sceneResourceList.length; i++) {
            this.removeArrowScene(this.sceneResourceList[i].instance);
        }

        this.activeStartDragArrow(false);
        this.removeEventsClickArrow();
        this.sceneResourceList = [];
    }

    removeArrowScene(arrow) {
        if (!arrow) return;

        this.scenesControl.removeChild(arrow);
    }

    deleteArrowActual() {
        var nameArrow = this.arrowActive.name;
        this.removeArrowScene(this.arrowActive);
        this.activeStartDragArrow(false);

        let index = this.sceneResourceList.findIndex((obj) => obj.name === nameArrow);

        if (index !== -1) {
            this.sceneResourceList.splice(index, 1);
        }

        this.fileChanged();
    }

    addScenesControl(scenesControl) {
        this.scenesControl = scenesControl;
    }

    addWindowConfig(idWindow) {
        this.windowConfigElement = document.getElementById(idWindow);
        this.moveWindowLeft = this.windowConfigElement.querySelector('#moveWindowLeft');
        this.moveWindowRight = this.windowConfigElement.querySelector('#moveWindowRight');

        this.name = document.getElementById('name');
        this.angle = document.getElementById('angle');
        this.angleDisplay = document.getElementById('angleDisplay');
        this.time = document.getElementById('time');
        this.positionX = document.getElementById('positionX');
        this.positionY = document.getElementById('positionY');
        this.btCancel = this.windowConfigElement.querySelector('#cancel');
        this.btDelete = this.windowConfigElement.querySelector('#delete');
        //this.btApply = this.windowConfigElement.querySelector('#apply');

        this.angle.addEventListener('input', (event) => {
            this.arrowActive.rotate = this.angle.value;
            this.angleDisplay.innerHTML = this.angle.value + '°';
            this.addDataFormArrow(this.arrowActive.name);
        });

        this.time.addEventListener('input', (event)=>{
            this.arrowActive._timeTemp = this.time.value;
            this.addDataFormArrow(this.arrowActive.name);
        });


        this.moveWindowLeft.addEventListener('click', (event) => {
            let windowConfigWidth = this.windowConfigElement.offsetWidth;
            let totalWindowWidth = window.innerWidth;
            let newRight = totalWindowWidth - windowConfigWidth - 50;
            this.windowConfigElement.style.right = `${newRight}px`;

            this.moveWindowLeft.classList.add('hide-opacity');
            this.moveWindowRight.classList.remove('hide-opacity');
        });

        this.moveWindowRight.addEventListener('click', (event) => {
            this.windowConfigElement.style.right = '10px';
            this.moveWindowRight.classList.add('hide-opacity');
            this.moveWindowLeft.classList.remove('hide-opacity');
        });

        this.btCancel.addEventListener('click', (event) => {
            this.moveWindowRight.classList.add('hide-opacity');
            this.moveWindowLeft.classList.remove('hide-opacity');
            this.windowConfigElement.style.removeProperty('right');
            this.openWindowConfigArrow(false);
        });

        this.btDelete.addEventListener('click', (event) => {
            this.moveWindowRight.classList.add('hide-opacity');
            this.moveWindowLeft.classList.remove('hide-opacity');
            this.windowConfigElement.style.removeProperty('right');
            this.openWindowConfigArrow(false);
            this.deleteArrowActual();
        });
    }

    addDataFormArrow(name) {

        var data = this.getObjectByName(name);

        data.resource.angle = data.instance.rotate;
        data.resource.time = data.instance._timeTemp;
        data.resource.position.x = data.instance.x;
        data.resource.position.y = data.instance.y;

        this.name.value = data.instance.name;
        this.angle.value = data.instance.rotate;
        this.angleDisplay.innerText = data.instance.rotate + '°';
        this.time.value = data.instance._timeTemp;
        this.positionX.value = data.instance.x.toFixed(2);
        this.positionY.value = data.instance.y.toFixed(2);
    }

    controlArrow(scenesData) {
        this.scenesData = scenesData;
        this.arrowDataOriginal = JSON.parse(JSON.stringify(this.scenesData.arrow)); 

        if(!this.scenesData.arrow) return;

        for (let i = 0; i < this.scenesData.arrow.length; i++) {
            this.addArrowScene(this.scenesData.arrow[i]);
        }
    }

    addArrowScene(arrow) {
        let dataResource = {
            name: arrow.name,
            resource: arrow,
            instance: null
        }

        this.sceneResourceList.push(dataResource);
        this.createArrow(dataResource, arrow.new);
    }

    createArrow(dataResource, newArrow) {
        let arrow = new ArrowTemplate(dataResource.resource.color);
        arrow.name = dataResource.name;

        if (newArrow) {
            if (this.arrowActive) {
                this.arrowActive.debug = false;
                this.arrowActive.startDrag = false;
                this.arrowActive = null;
            }

            arrow.startDrag = true;
            arrow.debug = true;
            arrow.addEventListener(Event.MOUSE_UP, this.clickArrow);
            arrow.addEventListener('dblclick', this.doubleClickArrow);
            this.arrowActive = arrow;
        }

        dataResource.instance = arrow;

        this.scenesControl.addChild(arrow);
        arrow.start(dataResource.resource.position, dataResource.resource.angle, dataResource.resource.time);
    }

    activeStartDragArrow(status = false) {
        for (let i = 0; i < this.sceneResourceList.length; i++) {
            let arrow = this.sceneResourceList[i].instance;
            arrow.startDrag = status;
            arrow.debug = status;
        }

        //if (!status) this.arrowActive = null;
    }

    addEventsClickArrow() {
        for (let i = 0; i < this.sceneResourceList.length; i++) {
            let arrow = this.sceneResourceList[i].instance;
            arrow.addEventListener(Event.MOUSE_UP, this.clickArrow);
            arrow.addEventListener('dblclick', this.doubleClickArrow);
            arrow.addEventListener(Event.ENTER_FRAME, this.enterFrameArrow);
        }
    }

    removeEventsClickArrow() {
        for (let i = 0; i < this.sceneResourceList.length; i++) {
            let arrow = this.sceneResourceList[i].instance;
            arrow.removeEventListener(Event.MOUSE_UP, this.clickArrow);
            arrow.removeEventListener('dblclick', this.doubleClickArrow);
            arrow.removeEventListener(Event.ENTER_FRAME, this.enterFrameArrow);
        }

        this.arrowActive = null;

        this.openWindowConfigArrow(false);
    }

    onArrowClickHandler(event) {
        if (this.arrowActive) {
            this.arrowActive.debug = false;
            this.arrowActive.startDrag = false;
            this.arrowActive = null;            
        }

        this.arrowActive = event.displayObject;
        this.arrowActive.debug = true;
        this.arrowActive.startDrag = true;
        this.addDataFormArrow(event.displayObject.name);
    }

    onArrowDoubleClickHandler(event) {
        this.openWindowConfigArrow(true);
        this.addDataFormArrow(event.displayObject.name);
    }

    onEnterFrameArrowHandler(event) {        
        if(!this.arrowActive) return;

        var data = this.getObjectByName(event.displayObject.name);
        data.resource.position.x = data.instance.x;
        data.resource.position.y = data.instance.y;
       
        this.positionX.value = this.arrowActive.x.toFixed(2);
        this.positionY.value = this.arrowActive.y.toFixed(2);

        this.fileChanged();        
    }

    initializeArrow() {
        for (let i = 0; i < this.sceneResourceList.length; i++) {
            let arrow = this.sceneResourceList[i].instance;
            arrow.x = 300;
            arrow.y = -500;

            arrow.start(this.sceneResourceList[i].resource.position, this.sceneResourceList[i].resource.angle, this.sceneResourceList[i].resource.time);
        }
    }

    createNewArrow(color) {
        let arrow = {
            new: true,
            name: this.generateRandomName(),
            color: color,
            angle: 0,
            time: 0,
            position: {
                x: 50,
                y: 50
            }
        }

        this.fileChanged();
        this.openWindowConfigArrow(false);
        this.addArrowScene(arrow);
    }

    openWindowConfigArrow(status) {
        if(!this.windowConfigElement) return;
        
        if (status) {
            this.windowConfigElement.classList.add('show');
        } else {
            this.windowConfigElement.classList.remove('show');
        }
    }

    getObjectByName(name) {
        return this.sceneResourceList.filter(objeto => objeto.name === name)[0];
    }

    fileChanged() {
        if (this.fileModified) return;

        if(this.compareArrowsData()) return;

        this.fileModified = true;
        this.dispatchEvent({ type: 'fileChanged', state: true });
    }

    compareArrowsData() {
        var dataActual = [];
        for(var i=0; i < this.sceneResourceList.length; i++){
            dataActual.push(this.sceneResourceList[i].resource);
        }

        const str1 = JSON.stringify(dataActual);
        const str2 = JSON.stringify(this.arrowDataOriginal);

        return str1 === str2;
    }

    saveDataArrrow(){
        if(!this.fileModified) return;

        var dataActual = [];
        for(var i=0; i < this.sceneResourceList.length; i++){            
            delete this.sceneResourceList[i].resource.new;
            dataActual.push(this.sceneResourceList[i].resource);
        }

        this.scenesData.arrow = this.copyObject(dataActual);
        this.arrowDataOriginal = this.copyObject(this.scenesData.arrow);
        this.fileModified = false;

        return this.copyObject(this.scenesData);

    }

    copyObject(object){
        return JSON.parse(JSON.stringify(object));
    }

    generateRandomName() {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const length = 10;
        let name = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            name += characters.charAt(randomIndex);
        }

        return name;
    }
}

export default ArrowConfig