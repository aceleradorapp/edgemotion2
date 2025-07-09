import EventDispatcher from "../../core/EventDispatcher.js";
import Event from "../../core/Event.js";

class Keyboard extends EventDispatcher {
    constructor() {
        super();

        this._callBackCompare = null;
        this._callBack = null;
        this._keysCompare = null;//'alt ctrl shift c';
        this._textCompare = null;//"Olá, seja bem vindo";
        this._pointer = 0;
        this._totalTyped = 0;
        this._correct = 0;

        this._valueReturn = {
            keysPress: null,
            event: null,
            location: null,
        };

        this._valueReturnOld = {
            keysPress: null,
            event: null,
            location: null,
        };

        this._preventDefault = true;
        this._repeatKey = true;

        this._onkeyDown = this.onKeyDown.bind(this);
        this._onkeyUp = this.onkeyup.bind(this); 
        
        this.addEvents();
    }

    get preventDefault() {
        return this._preventDefault;
    }

    set preventDefault(value) {
        this._preventDefault = value;
    }

    get repeatKey() {
        return this._repeatKey;
    }

    set repeatKey(value) {
        this._repeatKey = value;
    }

    addTextCompare(text){
        this._textCompare = text;
    }

    addKeysCombination(keys){
        this._keysCompare = keys;
    }

    addEvents(){
        window.addEventListener('keydown', this._onkeyDown);
        window.addEventListener('keyup', this._onkeyUp);
    }

    removeEvents(){
        window.removeEventListener('keydown', this._onkeyDown);
        window.removeEventListener('keyup', this._onkeyUp);
    }

    /**
     * Evento do teclado UP
     * O keycode 44 é a tecla print screen.
     * 
     * @param {Event} e 
     */
    onkeyup(event) {
        if (event.keyCode == '44') {
            this.onKeyDown(event);
        }
        this._valueReturnOld.keysPress = null;
        this.dispatchEvent({ type: Event.KEY_UP, target: event, keyMap: this._keyCodes(event.keyCode) });
    }

    /**
     * Evento do teclado Down
     * 
     * @param {Event} event 
     */
    onKeyDown(event) {

        if (!event.metaKey && this._preventDefault) {
            event.preventDefault();
        }

        if (this._textCompare) {
            this._onkeydownCompare(event);
            return;
        }  

        var ctrl = event.ctrlKey ? 'Ctrl' : null;
        var alt = event.altKey ? 'Alt' : null;
        var shift = event.shiftKey ? 'Shift' : null;
        var keyPress = event.keyCode < 16 || event.keyCode > 18 ? event.key : '';

        var keys = (ctrl ? ctrl : '') + ' ' + (alt ? alt : '') + ' ' + (shift ? shift : '') + ' ' + (keyPress ? keyPress : '');        
        
        if (this._keysCompare) {
            this._compareKeys(keys);            
        }

        this.dispatchEvent({ type: Event.KEY_DOWN, target: event, keyMap: this._keyCodes(event.keyCode) });
    }

    _compareKeys(pressedKeys) {
        var result = true;
        const pressedKeysArray = pressedKeys.toLowerCase().split(" ");
        const correctKeysArray = this._keysCompare.toLowerCase().split(" ");

        for (let i = 0; i < pressedKeysArray.length; i++) {
            if (!correctKeysArray.includes(pressedKeysArray[i])) {
                result = false;
            }
        }

        if (result) {
            this.dispatchEvent({ type: 'KeysCombination', target: pressedKeys, result: this._keysCompare });
        }       
    }

    _onkeydownCompare(event) {
        var listTemp = ['shift', 'ShiftLeft', 'Shiftright', 'BracketLeft', 'Backslash', 'Quote'];
        var accent = false;

        for (var i = 0; i < listTemp.length; i++) {
            if (listTemp[i].toLowerCase() == event.code.toLowerCase()) {
                accent = true;
                break;
            }
        }
    
        if (accent) {
            return
        };
    
        this.compareCharCode(event);
    }

    compareCharCode(event){
        var pressdKey = event.key;
        var expectedKey = this._textCompare[this._pointer];
        this._totalTyped++;

        if(event.keyCode == 13){
            pressdKey = 13;
            if(expectedKey == 10){
                expectedKey = 13;
            }
        }

        if(pressdKey === expectedKey){
            this._pointer++;
            this._correct++;
            var prevKey = this._textCompare[this._pointer];

            this.dispatchEvent({ type: 'CORRECT', target: this, key:expectedKey,  prevKey:prevKey});
            
            if(this._textCompare.length == this._pointer){
                this.dispatchEvent({ type: 'FINISHED', target: this, result:true });
                return;
            }

        }else{
            this.dispatchEvent({ type: 'WRONG', target: this, key: expectedKey, prevKey:prevKey });            
        }

        this.dispatchEvent({ type: 'TOTAL_TYPED', target: this, key:0 });        
    }


    _keyCodes(key) {
        var keyCodes = {
            0: 'That key has no keycode',
            3: 'break',
            8: 'backspace / delete',
            9: 'tab',
            12: 'clear',
            13: 'enter',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            19: 'pause/break',
            20: 'caps lock',
            21: 'hangul',
            25: 'hanja',
            27: 'escape',
            28: 'conversion',
            29: 'non-conversion',
            32: 'spacebar',
            33: 'page up',
            34: 'page down',
            35: 'end',
            36: 'home',
            37: 'left arrow',
            38: 'up arrow',
            39: 'right arrow',
            40: 'down arrow',
            41: 'select',
            42: 'print',
            43: 'execute',
            44: 'Print Screen',
            45: 'insert',
            46: 'delete',
            47: 'help',
            48: '0',
            49: '1',
            50: '2',
            51: '3',
            52: '4',
            53: '5',
            54: '6',
            55: '7',
            56: '8',
            57: '9',
            58: ':',
            59: 'semicolon (firefox), equals',
            60: '<',
            61: 'equals (firefox)',
            63: 'ß',
            64: '@ (firefox)',
            65: 'a',
            66: 'b',
            67: 'c',
            68: 'd',
            69: 'e',
            70: 'f',
            71: 'g',
            72: 'h',
            73: 'i',
            74: 'j',
            75: 'k',
            76: 'l',
            77: 'm',
            78: 'n',
            79: 'o',
            80: 'p',
            81: 'q',
            82: 'r',
            83: 's',
            84: 't',
            85: 'u',
            86: 'v',
            87: 'w',
            88: 'x',
            89: 'y',
            90: 'z',
            91: 'Windows Key / Left ⌘ / Chromebook Search key',
            92: 'right window key',
            93: 'Windows Menu / Right ⌘',
            95: 'sleep',
            96: 'numpad 0',
            97: 'numpad 1',
            98: 'numpad 2',
            99: 'numpad 3',
            100: 'numpad 4',
            101: 'numpad 5',
            102: 'numpad 6',
            103: 'numpad 7',
            104: 'numpad 8',
            105: 'numpad 9',
            106: 'multiply',
            107: 'add',
            108: 'numpad period (firefox)',
            109: 'subtract',
            110: 'decimal point',
            111: 'divide',
            112: 'f1',
            113: 'f2',
            114: 'f3',
            115: 'f4',
            116: 'f5',
            117: 'f6',
            118: 'f7',
            119: 'f8',
            120: 'f9',
            121: 'f10',
            122: 'f11',
            123: 'f12',
            124: 'f13',
            125: 'f14',
            126: 'f15',
            127: 'f16',
            128: 'f17',
            129: 'f18',
            130: 'f19',
            131: 'f20',
            132: 'f21',
            133: 'f22',
            134: 'f23',
            135: 'f24',
            136: 'f25',
            137: 'f26',
            138: 'f27',
            139: 'f28',
            140: 'f29',
            141: 'f30',
            142: 'f31',
            143: 'f32',
            144: 'num lock',
            145: 'scroll lock',
            151: 'airplane mode',
            160: '^',
            161: '!',
            162: '؛ (arabic semicolon)',
            163: '#',
            164: '$',
            165: 'ù',
            166: 'page backward',
            167: 'page forward',
            168: 'refresh',
            169: 'closing paren (AZERTY)',
            170: '*',
            171: '~ + * key',
            172: 'home key',
            173: 'minus (firefox), mute/unmute',
            174: 'decrease volume level',
            175: 'increase volume level',
            176: 'next',
            177: 'previous',
            178: 'stop',
            179: 'play/pause',
            180: 'e-mail',
            181: 'mute/unmute (firefox)',
            182: 'decrease volume level (firefox)',
            183: 'increase volume level (firefox)',
            186: 'semi-colon / ñ',
            187: 'equal sign',
            188: 'comma',
            189: 'dash',
            190: 'period',
            191: 'forward slash / ç',
            192: 'grave accent / ñ / æ / ö',
            193: '?, / or °',
            194: 'numpad period (chrome)',
            219: 'open bracket',
            220: 'back slash',
            221: 'close bracket / å',
            222: 'single quote / ø / ä',
            223: '`',
            224: 'left or right ⌘ key (firefox)',
            225: 'altgr',
            226: '< /git >, left back slash',
            230: 'GNOME Compose Key',
            231: 'ç',
            233: 'XF86Forward',
            234: 'XF86Back',
            235: 'non-conversion',
            240: 'alphanumeric',
            242: 'hiragana/katakana',
            243: 'half-width/full-width',
            244: 'kanji',
            251: 'unlock trackpad (Chrome/Edge)',
            255: 'toggle touchpad',
        };

        return keyCodes[key]
    }

    _location(location) {
        var keyLocations = {
            0: 'General keys',
            1: 'Left-side',
            2: 'Right-side',
            3: 'Numpad',
        };

        return keyLocations[location];
    }
}

export default Keyboard

