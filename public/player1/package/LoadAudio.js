import { EventDispatcher } from "../animjsall/Animjs.js";

class LoadAudio extends EventDispatcher {
    constructor(urlComplete) {
        super();
        this._url = urlComplete+'/audioFiles/';
        this._audioFiles = [];
        this._sourceFile = null;
        this.audiosExist = false;
        this._currentAudio = null;
    }

    async source() {
        const sourceUrl = `${this._url}audios.json`;
        try {
            const response = await fetch(sourceUrl);
            if (!response.ok) {
                // throw new Error(`HTTP error! status: ${response.status}`);
                return;
            } else {
                this._sourceFile = await response.json();
                this.start();
            }
        } catch (e) {
            //console.log(e);
        }
    }

    async start() {
        if (!this._sourceFile) {
            throw new Error("Source file not loaded, call the 'source' method first.");
        }

        for (let fileName of this._sourceFile) {
            try {
                const response = await fetch(`${this._url}${fileName.filename}`);
                if (!response.ok) {
                    throw new Error(`Failed to load audio file: ${response.status}`);
                }

                //const fileIndex = parseInt(fileName.replace('audio', '').replace('.mp3', ''));
                this._audioFiles.push({
                    index: fileName.index,
                    audio: await response.arrayBuffer()
                });
            } catch (err) {
                console.error('Failed to fetch audio file:', err);
            }
        }

        this.audiosExist = true;
        this.dispatchEvent({ type: 'load_complete', target: this });
    }

    playAudio(index) {
        const audioData = this._audioFiles.find(file => file.index === index);
        if (audioData) {
            const blob = new Blob([audioData.audio], { type: 'audio/mp3' });
            const url = URL.createObjectURL(blob);

            if (this._currentAudio) {
                this._currentAudio.pause();
                this._currentAudio.currentTime = 0;
            }

            //const audio = new Audio(url);
            this._currentAudio = new Audio(url);
            this._currentAudio.playbackRate = 1;
            this._currentAudio.pitch  = 1;

            this._currentAudio.addEventListener('play', () => this.dispatchEvent({ type: 'audio_start', target: this }));
            this._currentAudio.addEventListener('ended', () => this.dispatchEvent({ type: 'audio_end', target: this }));


            //audio.play();
            this._currentAudio.play();
        } else {
            console.log(`No audio found for index ${index}`);
        }
    }

    stop(){      
        if(!this._currentAudio) return;  
        this._currentAudio.pause();
        this._currentAudio.currentTime = 0;
    }
}

export default LoadAudio;

