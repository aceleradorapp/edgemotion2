import EventDispatcher from "../core/EventDispatcher.js";

class TextToSpeech extends EventDispatcher {
    constructor() {
        super()

        this._voicesList = null;
        this._voiceSelected = 0;
        this._speed = 1;
        this._volume = 1;
        this._pitch = 1;
        this.loaded = false;
        this._pendingText = null;

        this.voiceschanged = this._voiceschanged.bind(this);
        this.speechStart = this._speechStart.bind(this);
        this.speechEnd = this._speechEnd.bind(this);

        this._addEvents();
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
        this._voiceSelected = index;
    }

    _addEvents() {
        window.speechSynthesis.addEventListener('voiceschanged', this.voiceschanged);
    }

    _removeEvents() {
        window.speechSynthesis.removeEventListener('voiceschanged', this.voiceschanged);
    }

    speak(text) {
        if (text == '') return;

        if (!this.loaded) {
            this._pendingText = text;
            return;
        }

        let speech = new SpeechSynthesisUtterance(text);
        speech.voice = this._voicesList[this._voiceSelected];
        speech.rate = this._speed;
        speech.volume = this._volume;
        speech.pitch = this._pitch;

        speech.addEventListener('start', this.speechStart);
        speech.addEventListener('end', this.speechEnd);

        window.speechSynthesis.speak(speech);
    }

    stop() {
        window.speechSynthesis.cancel();
    }

    _voiceschanged() {
        this._voicesList = window.speechSynthesis.getVoices();
        this.loaded = true;

        if (this._pendingText) {
            this.speak(this._pendingText);

            //this._speakText(this._pendingText);
            this._pendingText = null;
        }

        this.dispatchEvent({ type: 'speechComplete', state: 'speechStart' });
    }

    _speechStart() {
        this.dispatchEvent({ type: 'speechStart', state: 'speechStart' });
    }

    _speechEnd() {
        this.dispatchEvent({ type: 'speechEnd', state: 'speechEnd' });
    }
}

export default TextToSpeech;