// API https://beta.elevenlabs.io/speech-synthesis
// ACESSAR SITE PARA CRIAR A CHAVE
// **************************************************************************

import EventDispatcher from "../core/EventDispatcher.js";

class TextToSpeechApi extends EventDispatcher {
    constructor() {
        super()

        this.urlApi = 'https://api.elevenlabs.io/v1/';
        this.idApiKey = 'd1f30682ae596b074d16faf87bb350cc';
        this.idVoice = 'TxGEqnHWrfWFTfGW9XjX';
        this.idModel = 'eleven_multilingual_v1';

        this._voicesList = null;

        this._speed = 1;
        this._volume = 1;
        this._pitch = 1;
        this.loaded = false;

        this.voiceschanged = this._voiceschanged.bind(this);
        this.speechStart = this._speechStart.bind(this);
        this.speechEnd = this._speechEnd.bind(this);

        this._getVoicesApi();
    }

    get speed() {
        return this._speed;
    }

    set speed(value) {
        this._speed = value;
    }

    get volume() { // novo
        return this._volume;
    }

    set volume(value) { // novo
        this._volume = value;
    }

    get pitch() { // novo
        return this._pitch;
    }

    set pitch(value) { // novo
        this._pitch = value;
    }

    getVoices() {
        return this._voicesList;
    }

    selectVoices(index) {

    }

    _addEvents() {

    }

    _removeEvents() {

    }

    speak(text) {
        if (text == '') return;

        if (!this.loaded) {
            this._pendingText = text;
            return;
        }


    }

    stop() {

    }

    _getVoicesApi() {
        fetch(this.urlApi+'voices', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'xi-api-key': this.idApiKey
            }
        })
            .then(response => response.json())
            .then(data => {
                this._voicesList = data;
            })
            .catch((error) => {
                console.error('Erro:', error);
            });
        return this._voicesList;
    }

    _createAudio(text) {
        fetch(this.urlApi+'text-to-speech/'+this.idVoice, {
            method: 'POST',
            headers: {
                'accept': 'audio/mpeg',
                'xi-api-key': this.idApiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "text": texto,
                "model_id": this.idModel,
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.5
                }
            })
        })
            .then(response => response.blob())
            .then(data => {
                console.log(data);
                let url = URL.createObjectURL(data);
                audio = new Audio(url);

                audio.play();

            })
            .catch((error) => {
                console.error('Erro:', error);
            });

    }

    _voiceschanged() {        
        this.loaded = true;


        this.dispatchEvent({ type: 'speechComplete', state: 'speechStart' });
    }

    _speechStart() {
        this.dispatchEvent({ type: 'speechStart', state: 'speechStart' });
    }

    _speechEnd() {
        this.dispatchEvent({ type: 'speechEnd', state: 'speechEnd' });
    }
}

export default TextToSpeechApi;