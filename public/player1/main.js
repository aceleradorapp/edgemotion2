import { ModalWindow, TextToSpeech } from './animjsall/Animjs.js';
import ScenesControl from "./package/ScenesControl.js";
import ArrowConfig from "./package/ArrowConfig.js";

import LoadFile from "./package/LoadFile.js";
import LoadAudio from "./package/LoadAudio.js";

//removeEventosKeyboardAndContextMenu();

// var baseUrlApiNow = baseUrlApi;
// var baseHref = baseUrlApiNow+'/public/player1/';
// var baseTag = document.querySelector('head base');

// if (!baseTag) {
//     baseTag = document.createElement('base');
//     document.head.appendChild(baseTag);
// }
// baseTag.setAttribute('href', baseHref);


//var urlCompleta = 'http://localhost:3000/packages/'+playerKey;
var urlCompleta = urlApiMaster + playerKey;

function removeEventosKeyboardAndContextMenu() {
    //REMOVE O CONTEXT MENU
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    document.addEventListener('keydown', (event) => {
        event.preventDefault();
    });

    document.addEventListener('keyup', (event) => {
        event.preventDefault();
    });
}


var modalWindow = new ModalWindow();

getItemMenu();

var iconInteration = { click: 'mouse', keyboard: 'keyboard', click_and_drag: 'move_dow', video: 'missed_video_call' };
var idleTimeStopped = null;
var dotTimelineList = [];
var file = null;
var dotActive = 0;

var btnNext = document.getElementById('btnNext');
var btnBack = document.getElementById('btnBack');
var btnMenu = document.getElementById('btnMenu');
var caption = document.getElementById('caption');
var sideBar = document.getElementById('sideBar');
var dialog = document.getElementById('dialogContainer');
var titleMessage = document.getElementById('titleMessage');
var textMessage = document.getElementById('message');
var typeInteration = document.getElementById('typeInteration');
var overlay = document.getElementById('overlay');
var overlayMessage = document.getElementById('overlayMessage');
var timeline = document.getElementById('timeline');
var displayCaption = document.getElementById('displayCaption');
var footer = document.getElementById('footer');
var antiInteration = document.getElementById('antiInteration');

window.addEventListener('resize', handleResize);
btnNext.addEventListener('click', btnNextClickHandler);
btnBack.addEventListener('click', btnBackClickHandler);
btnMenu.addEventListener('click', btnMenuClickHandler);

function btnNextClickHandler(event) {
    idleTime(true);
    if (!behaviorScene) return;

    nextScenesOrSubscenes(behaviorScene);
}

function btnBackClickHandler(event) {

    if (scenesControl.currentScenes.scene != 0) {
        pointerScenes -= 2;
        if (scenesControl.currentScenes.subscene == 0) {
            scenesControl.prevScene();
        } else {
            scenesControl.prevSubscene();
        }
    } else {
        enableButton(btnBack, false);
    }

    arrowConfig.removeArrowsScene();
}

function btnMenuClickHandler() {
    sideBar.classList.toggle('show-menu');
    if (sideBar.classList.contains('show-menu')) {
        btnMenu.classList.remove('button-cyan-light');
        btnMenu.classList.add('button-secondary');
    } else {
        btnMenu.classList.remove('button-secondary');
        btnMenu.classList.add('button-cyan-light');
    }
}

function createTimeLine() {
    var count = file.data.length;
    dotTimelineList = [];

    for (var i = 0; i < count; i++) {
        var dotScene = createDotSceneElement(i);
        dotTimelineList.push(dotScene);
        dotTimelineList[i].addEventListener('click', clickDotSceneHandler);
        timeline.appendChild(dotScene);
    }
}

function createDotSceneElement(dataId) {
    const sceneDiv = document.createElement('div');
    sceneDiv.classList.add('scene');
    sceneDiv.setAttribute('data-id', dataId)

    const dotDiv = document.createElement('div');
    dotDiv.classList.add('dot');

    sceneDiv.appendChild(dotDiv);

    return sceneDiv;
}

function clickDotSceneHandler() {
    const dataId = parseInt(this.getAttribute('data-id'));

    if (dataId > dotActive - 1) return;
    idleTime(true);
    arrowConfig.removeArrowsScene();
    scenesControl.goto(dataId, 0);
};

function positionLineToScene(value) {

    if (value > dotActive) {
        dotActive = value;
    }

    for (var i = 0; i < dotTimelineList.length; i++) {
        dotTimelineList[i].classList.remove('scene-executed');
    }

    for (var j = 0; j < value; j++) {
        dotTimelineList[j].classList.add('scene-executed');
    }

    const lineComplete = timeline.querySelector('.line-complete');
    const scenes = timeline.querySelectorAll('.scene');

    const sceneCount = scenes.length;
    const timelineWidth = timeline.offsetWidth;

    const lineCompleteWidth = (value - 1) * (timelineWidth / (sceneCount - 1));

    if (value == 1) {
        lineComplete.style.width = '0px';
        return;
    }

    lineComplete.style.width = `${lineCompleteWidth - 10}px`;
}

function getItemMenu() {
    const items = document.querySelectorAll('.content-items li');
    items.forEach(item => {
        item.addEventListener('click', () => {
            const dataName = item.getAttribute('data-name');
            itemMenuHandler(dataName);
        });
    });
}

function itemMenuHandler(dataName) {
    var menuitem = dataName;

    if (menuitem == 'menu-exit') {

        textToSpeech.stop();
        if (loadAudio.audiosExist == false) return false;
        loadAudio.stop();

        window.parent.postMessage('menu-exit', '*');
        return;
    } else if (menuitem == 'menu-restore') {
        btnMenuClickHandler();
        //init();
        return;
    }

    dialogShow('Atenção', 'Esta é uma versão de cortesia e, portanto, não possui todos os recursos disponíveis.');

}

function overlayshow() {
    overlay.classList.toggle('show-loading');
}

function setIconInteration(componentName) {

    let type = iconInteration[componentName.toLowerCase()];

    if (!type) type = 'arrow_circle_right'

    typeInteration.innerText = type
}

function idleTime(status = false) {

    if (status) {
        clearInterval(idleTimeStopped);
        dialog.classList.remove('show');
        return;
    };

    clearInterval(idleTimeStopped);
    idleTimeStopped = setInterval(() => {
        dialogShow('Atenção!', 'Clique no botão avançar para continuar...', 4);
    }, 40000);
}

function enableButton(element, status) {
    if (status) {
        element.classList.remove('button-cyan-light');
        element.classList.remove('button-block');
        element.classList.add('button-secondary');
    } else {
        element.classList.remove('button-secondary');
        element.classList.add('button-cyan-light');
        element.classList.add('button-block');
    }
}

function dialogShow(title, message, seconds = 3) {

    titleMessage.innerText = title;
    textMessage.innerHTML = message

    dialog.classList.add('show');

    setTimeout(() => {
        dialog.classList.remove('show');
        //modalMessage({})
    }, seconds * 1000);
}

function modalMessage(settings, callBack) {

    var defaultSettings = {
        title: 'Edge Motion!',
        subtitle: 'Olá seja bem vindo!',
        text: 'Divirta-se em nosso sistema.',
        closeButton: true,
        time: 0,
        color: '#609b01',
        buttons: [
            'OK',
            'Cancelar',
        ]
    };

    var settingsTemp = { ...defaultSettings, ...settings };

    modalWindow.show(settingsTemp);
    modalWindow.addEventListener('button_complete', (event) => {
        modalWindow.hide();

        if (!callBack) return;

        callBack(event.button);
    });
}

function handleResize() {

}

function fullScreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Para navegadores Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Para navegadores Chrome, Safari e Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // Para navegadores Internet Explorer e Edge
        elem.msRequestFullscreen();
    }
}


//Inicio dos codigos do player relacionados a framework                                                                              */

var loadFile = new LoadFile(urlCompleta);
var loadAudio = new LoadAudio(urlCompleta);
//loadAudio.source();
loadAudio.addEventListener('load_complete', () => {
    console.log('All audios have been loaded!');
});
loadAudio.addEventListener('audio_start', speechStartHandler);
loadAudio.addEventListener('audio_end', speechEndHandler);


loadFile.addEventListener('load_complete', onLoadFileComplete);


var textToSpeech = new TextToSpeech();
textToSpeech.pitch = 0.1;
textToSpeech.speed = 2;
textToSpeech.volume = 1;
textToSpeech.addEventListener('speechStart', speechStartHandler);
textToSpeech.addEventListener('speechEnd', speechEndHandler);

var arrowConfig = new ArrowConfig();
var scenesControl;
var trainingDdata = null;
var folderTraining = null;
var resolutionProject;
var actionTaken = false;
var sceneData;
var actionActual;
var subtitlesScenes;
var control = 'locked';
var behaviorScene;
var pointerScenes = 1;
var pointerSubtitle = 0;
var totalScensTraining = 0;
var audioOn = false;
var finalytaining = false;
var audioIA = false;

init();

trainingDdata = 'HDR456.skl';
folderTraining = 'a010101';


function init() {
    var settings = {
        title: 'Edge Motion',
        subtitle: 'Seja bem vindo!',
        text: 'Para iniciar, clique no botão OK',
        closeButton: false,
        time: 0,
        color: '#2563eb',
        buttons: [
            'OK',
        ]
    };

    modalMessage(settings, (menu) => {
        fullScreen();
        overlayshow();

        loadFile.source();
    });
}

function onLoadFileComplete(event) {

    file = event.data;
    file.urlSuportData = urlCompleta + '\\suport\\';
    var audioExist = file.audio;

    if (audioExist) {
        loadAudio.source();
    }

    totalScensTraining = contScenes(file.data);

    changeDisplayPlayer(1);
    createTimeLine();
    _openScenesControl();

}

function _openScenesControl() {
    var resolutionData = file.resolution.split('x').map(valor => parseInt(valor));
    resolutionProject = { width: resolutionData[0], height: resolutionData[1] };

    scenesControl = new ScenesControl('canvas', resolutionProject);
    scenesControl.source(file);

    //Cria a porcentagem de carregamento
    scenesControl.addEventListener('SCENES_PROGRESS', (event) => {
        const total = event.progress.total;
        const loaded = event.progress.loaded;
        const progressPercentage = (loaded / total) * 100;

        overlayMessage.innerText = 'Cenas : ' + progressPercentage.toFixed(2) + '%';        
    });

    scenesControl.addEventListener('UPDATE_SCENE_COMPLETE', (event) => {
        var sceneFinal = false;

        sceneData = file.data[scenesControl.currentScenes.scene][scenesControl.currentScenes.subscene];
        pointerScenes = sceneData.sceneNumber + 1;

        if (sceneData.position == 'final') sceneFinal = true;

        if (scenesControl.currentScenes.scene == 0) {
            enableButton(btnBack, false);
            pointerScenes = 1;
        } else {
            enableButton(btnBack, true);
            showFooter();
        }

        behaviorScene = sceneData.action.behavior;
        setIconInteration(sceneData.name);

        changeDisplayPlayer(pointerScenes, sceneFinal);
        positionLineToScene(scenesControl.currentScenes.scene + 1);

        checkFeatures();
    });

    scenesControl.addEventListener('LOAD_COMPLETE_SCENES', (event) => {
        overlayshow();
    });

    scenesControl.addEventListener('ACTION_COMPLETE', (event) => {
        var behavior = event.behavior;

        if (actionTaken) return;

        nextScenesOrSubscenes(behavior);

        actionTaken = true;
        // Aguarda meio segundo para liberar nova ação.
        setTimeout(() => {
            actionTaken = false;
        }, 200);
    });

    scenesControl.addEventListener('KEYBOARD-COMPONENT-MESSAGE-CORRECT', (event) => {
        dialog.classList.remove('show');
    });

    scenesControl.addEventListener('KEYBOARD-COMPONENT-MESSAGE-WRONG', (event) => {
        dialogShow('Atenção!', 'Pressione a tecla <b>"' + event.wrong + '"</b> corretamente.', 4);
    });

    if (scenesControl.dataSource.length == 0) {
        return;
    }

    arrowConfig.addScenesControl(scenesControl);
    //arrowConfig.addWindowConfig('configWindow');
    scenesControl.start();
}

function nextScenesOrSubscenes(behavior) {
    arrowConfig.removeArrowsScene();

    if (sceneData.subtitle.length > 1) {
        // Caso exista aumenta o ponteiro da legenda,
        // adicionar a legenda no player,
        // tocar audio.
        // para isso chamar o metodo: _controlSubtitle();

        pointerSubtitle++;
        _controlSubtitle()
        return;

        // Nunca foi testado, portanto testar entes de publicar essa funcionalidade.
        // lembrar que no caso do audio, ele também precisa existir.
        // criar essa funcionalidade para tocar o audio correto em LoadAudio.
    }

    if (behavior == 'next') {
        scenesControl.nextSubscene();
    } else if (behavior == 'next-scene') {
        scenesControl.nextScene();
    }
}

function checkFeatures() {

    if (sceneData.action) {
        actionActual = sceneData.action;
    }

    if (sceneData.control) {
        control = sceneData.control;
    }

    if (sceneData.subtitle) {
        subtitlesScenes = sceneData.subtitle;
        _controlSubtitle();
    }

    if (sceneData) {
        if (audioOn == false) {
            arrowConfig.controlArrow(sceneData);
        }
    }
}

function changeDisplayPlayer(scene, final = false) {

    if (scene >= 0 && scene < 10) {
        scene = scene.toString().padStart(2, '0');
    }

    displayCaption.innerText = scene + '/' + parseInt(totalScensTraining);

    if (final) {
        enableButton(btnNext, false);
        control = 'locked';
        finalytaining = true;
    }

}

function _controlSubtitle() {
    if (subtitlesScenes[pointerSubtitle] == '') return;


    caption.innerText = subtitlesScenes[pointerSubtitle];
    if (checkAudio()) {
        return;
    };

    textToSpeech.stop();
    audioOn = true;
    textToSpeech.speak(subtitlesScenes[pointerSubtitle]);
}

function checkAudio() {
    if (loadAudio.audiosExist == false) return false;

    loadAudio.stop();
    loadAudio.playAudio(parseInt(pointerScenes - 1));

    return true;

}

function speechStartHandler(event) {
    enableButton(btnNext, false);
    antiInterationHandler(true);
    audioOn = true;
}
function speechEndHandler(event) {
    antiInterationHandler(false);
    arrowConfig.controlArrow(sceneData);
    audioOn = false;

    if (finalytaining) {
        finishedTraining();
    }

    if (control == 'locked') return;
    idleTime();
    enableButton(btnNext, true);

}

function antiInterationHandler(status = false) {
    if (status) {
        antiInteration.classList.remove('anti-interation-free');
    } else {
        antiInteration.classList.add('anti-interation-free');
    }
}

function contScenes(matriz) {
    let totalItems = 0;

    for (const item of matriz) {
        if (Array.isArray(item)) {
            totalItems += item.length;
        }
    }

    return totalItems;
}

function showFooter(status = true) {
    if (status) {
        footer.classList.remove('footer-hide');
    } else {
        footer.classList.add('footer-hide');
    }
}

function finishedTraining() {
    var settings = {
        title: 'Edge Motion',
        subtitle: 'Parabéns, Treinamento finalizado',
        text: 'Clique em ok para sair da simulação',
        closeButton: false,
        time: 0,
        color: '#609b01',
        buttons: [
            'OK'
        ]
    };

    modalMessage(settings, (event) => {
        if (event == 'OK') {
            textToSpeech.stop();
            if (loadAudio.audiosExist == false) return false;
            loadAudio.stop();

            window.parent.postMessage('finished-training', '*');
        } else {
            modalWindow.hide();
        }
    });
}

/*
    Para ouvir o evento: window.parent.postMessage('menu-exit', '*');
    deve adicionar o ouvinte em qualquer js do projeto:

    window.addEventListener('message', function(event) {
        if (event.data === 'menu-exit') {
            ??????
        }
    }, false);
*/