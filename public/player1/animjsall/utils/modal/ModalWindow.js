import EventDispatcher from "../../core/EventDispatcher.js";

class ModalWindow extends EventDispatcher {
    constructor() {
        super()

        this.body = document.getElementsByTagName('body')[0];
        this.modalWindowCode = null;
        this.style = null;

        this.btClose = null;
        this.title = null;
        this.subtitleModal = null;
        this.textModal = null;
        this.contentButtons = null;
        this.root = document.documentElement;

        this.defaultSettings = {
            title: '',
            subtitle: '',
            text: '',
            closeButton:true,
            time: 0,
            color:'#8b66e1',
            buttons: ['OK']
        }

        this._createStyele();
        this._createWindowElement();

        this.buttonComplete = this._buttonComplete.bind(this);
        this.btCloseHandler = this._btCloseHandler.bind(this);
    }

    show(settings) {
        this.body.insertBefore(this.modalWindowCode, this.body.firstChild);

        var settingsTemp = { ...this.defaultSettings, ...settings };

        this.title.innerText = settingsTemp.title;
        this.subtitleModal.textContent = settingsTemp.subtitle;
        this.textModal.innerText = settingsTemp.text;
        this.root.style.setProperty('--color-primary', settingsTemp.color);
        
        if(!settingsTemp.closeButton){
            this.btClose.classList.add('closeButtonNome');
        }else{
            this.btClose.classList.remove('closeButtonNome');
        }

        for (var i = 0; i < settingsTemp.buttons.length; i++) {
            this._createButtons(settingsTemp.buttons[i]);
        }

        this._addEvents();

        if (settingsTemp.time != 0) {
            this.time = settingsTemp.time;
            setTimeout(() => {
                this.hide();
            }, this.time);
        }

        setTimeout(() => {                        
            this.modalWindowCode.classList.add('show');
        }, 300);
    }

    hide() {
        this.modalWindowCode.classList.remove('show');
        this.contentButtons.innerHTML = '';
        
        setTimeout(() => {            
            this.modalWindowCode.remove();
        }, 600);
    }

    _addEvents() {
        var buttons = document.querySelectorAll('.bt-modal');

        buttons.forEach((button) => {
            button.addEventListener('click', this.buttonComplete)
        });

        this.btClose.addEventListener('click', this.btCloseHandler);
    }

    _buttonComplete(event) {
        var name = event.target.dataset.name;
        this.dispatchEvent({ type: 'button_complete', button: name.toUpperCase() });
    }

    _btCloseHandler(event) {
        this.hide();
    }

    _createWindowElement() {
        this.modalWindowCode = document.createElement('div');
        this.modalWindowCode.setAttribute('id', 'modalWindowCode')


        var modalWindow = document.createElement('div');
        modalWindow.classList.add('modalWindow');

        this.btClose = document.createElement('span');
        this.btClose.setAttribute('id', 'btClose');
        this.btClose.classList.add('material-icons');
        this.btClose.textContent = 'close';

        this.title = document.createElement('div');
        this.title.classList.add('title');
        this.title.textContent = 'Atenção !';

        var hr = document.createElement('hr');

        var content = document.createElement('div');
        content.classList.add('content');

        this.subtitleModal = document.createElement('span');
        this.subtitleModal.setAttribute('id', 'subtitleModal');
        this.subtitleModal.textContent = 'Delete your account';

        this.textModal = document.createElement('span');
        this.textModal.setAttribute('id', 'textModal');
        this.textModal.textContent = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.';

        this.contentButtons = document.createElement('div');
        this.contentButtons.classList.add('content-buttons');

        // Adiciona os elementos criados à hierarquia da janela modal
        content.appendChild(this.subtitleModal);
        content.appendChild(this.textModal);

        modalWindow.appendChild(this.btClose);
        modalWindow.appendChild(this.title);
        modalWindow.appendChild(hr);
        modalWindow.appendChild(content);
        modalWindow.appendChild(this.contentButtons);

        // Adiciona a janela modal ao documento       
        this.modalWindowCode.appendChild(modalWindow);
    }

    _createButtons(nameButton) {
        var btModal = document.createElement('div');
        btModal.classList.add('bt-modal', 'bt-color');
        btModal.setAttribute('data-name', nameButton);
        btModal.textContent = nameButton;

        this.contentButtons.appendChild(btModal);
    }

    _createStyele() {
        this.style = document.createElement('style');
        this.style.innerHTML = `

        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

        :root {
            --color-primary: #8b66e1;
        }

        #modalWindowCode {
            position:fixed;
            font-family: Roboto;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100vh;
            background-color: #00000050;
            user-select: none;
            z-index: 100000;
            opacity: 0;
            transition: opacity 0.5s ease;            
        }

        #modalWindowCode.show {
            opacity: 1;
        }

        .closeButtonNome{
            opacity: 0;
        }

        #modalWindowCode > .modalWindow {
            position: relative;
            flex: 0 0 410px;
            max-width: 500px;
            height:180px;
            border-radius: 15px;
            background-color: #fff;
            box-shadow: 0 0 1em rgb(0 0 0 / 0.3);
        }

        .modalWindow > #btClose {
            position: absolute;
            top: 5px;
            right: 4px;
            padding: 2px;
            border-radius: 50%;
            color: #dbdbdb;
            cursor: pointer;
        }

        .modalWindow > #btClose:hover {
            background-color: #f7f7f7;
            color: #bfbfbf;
        }

        .modalWindow > .title {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;
            font-size: 22px;
            font-weight: 100;
            text-transform: uppercase;
            color: var(--color-primary);
        }

        .modalWindow hr {
            border: 0;
            border-top: 1px solid #e5e5e5;
        }

        .modalWindow > .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            width: 100%;
            margin-bottom: 50px;
        }

        .modalWindow > .content > #subtitleModal {
            font-size: 25px;
            color: #a7a7a7;
            /*flex: 1 0 45px;*/
        }

        .modalWindow > .content > #textModal {
            font-size: 14px;
            text-align: center;
            color: #a7a7a7;
            padding: 0 10px;
            flex: 1;
        }

        .modalWindow > .content-buttons {
            position: absolute;
            display: flex;
            justify-content: center;
            align-content: center;
            bottom: 0;
            width: 100%;
            height: 43px;
            background-color: var(--color-primary);
            border-radius: 0 0 15px 15px;
            gap: 2px;
            overflow: hidden;
        }

        .bt-modal {
            height: 100%;
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
            color: #fff;
            background-color: var(--color-primary);
            font-size: 16px;
            text-transform: uppercase;
            cursor: pointer;
            user-select: none;

            transition: filter 0.5s ease;
        }

        .bt-modal:hover {
            filter: brightness(120%);
        }
                
        `;

        document.head.appendChild(this.style);
    }
}

export default ModalWindow