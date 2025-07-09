/******************************************************************************
 * Michael Milanez
 * 
 * Esta classe controla o video com todos os eventos e propriedades necessárias
 * para o funcionamento do vídeo.
 * 
 * Esta classe recebe um id do elemento video e instancia ou cria um elemento 
 * video dinamicamente e para isso deve passar um valor bolleano no construtor.
 * O parametro createElemente por padrão é false, para criar o elemento 
 * dinamicamente é necessário passar o valor true.
 * 
 * exemplo:
 * 
 * this._videoPlayer = new VideoPlayer('video', false);
 * this._videoPlayer.load(url do arquivo ou um base64);
 * this._videoPlayer.play();
 * 
 */

class VideoPlayer extends EventTarget {
    /**
     * 
     * @param {string} videoId 
     * @param {Bollean} createElement 
     */
    constructor(videoId, createElement = false) {
        super();

        if (createElement) {
            this._video = document.createElement('video');
        } else {
            this._video = document.getElementById(videoId);
        }

        this._url = null;
        this._loop = false;
        this._precision = 0.05;

        this._setupEvents();
    }

    get video() {
        return this._video;
    }

    get duration() {
        return this._video.duration;
    }

    set duration(value) {
        this._video.duration = value;
    }

    get currentTime() {
        return this._video.currentTime;
    }

    set currentTime(value) {
        this._video.currentTime = value;
    }

    get url() {
        return this._url;
    }

    set url(url) {
        this._url = url;
    }

    get precision() {
        return this._precision;
    }

    set precision(value) {
        this._precision - value;
    }

    get playbackRate() {
        return this._video.playbackRate;
    }

    set playbackRate(value) {
        this._video.playbackRate = value;
    }

    load(url = null) {
        if (url) this._url = url;
        if (!this._url) return;

        this._video.src = this._url;
    }

    play() {
        this._video.play();
    }

    pause() {
        this._video.pause();
    }

    stop() {
        this._video.pause();
        this._video.currentTime = 0;
        this.dispatchEvent(new CustomEvent('STOP', { detail: { event: null } }));
    }

    prev() {
        this._video.pause();
        this._video.currentTime = 0;
        this.dispatchEvent(new CustomEvent('PREV', { detail: { event: null } }));
    }

    next() {
        this._video.pause();
        this._video.currentTime = this._video.duration;
        this.dispatchEvent(new CustomEvent('NEXT', { detail: { event: null } }));
    }

    loop(loop) {
        this._loop = loop;
    }

    getTime() {
        var currentTime = this._video.currentTime;
        const hours = Math.floor(currentTime / 3600);
        const minutes = Math.floor((currentTime - hours * 3600) / 60);
        const seconds = Math.floor(currentTime - hours * 3600 - minutes * 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    getTotal() {
        var duration = this._video.duration;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration - hours * 3600) / 60);
        const seconds = Math.floor(duration - hours * 3600 - minutes * 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    setPosition(value) {
        this._video.currentTime = value;
    }

    _setupEvents() {
        this._video.addEventListener('play', (event) => {
            this.dispatchEvent(new CustomEvent('PLAY', { detail: { event: event } }));
        });

        this._video.addEventListener('pause', (event) => {
            this.dispatchEvent(new CustomEvent('PAUSE', { detail: { event: event } }));
        });

        this._video.addEventListener('loadedmetadata', (event) => {
            this.dispatchEvent(new CustomEvent('LOADED_METADATA', { detail: { event: event } }));
        });

        this._video.addEventListener('ended', (event) => {
            this.dispatchEvent(new CustomEvent('ENDED', { detail: { event: event } }));
        });

        this._video.addEventListener('timeupdate', (event) => {
            this.dispatchEvent(new CustomEvent('TIMEUPDATE', { detail: { event: event } }));
        });

        this._video.addEventListener('progress', (event) => {
            // var loadedPercentage = (this._video.buffered.end(0) / this._video.duration) * 100;
            // this.dispatchEvent(new CustomEvent('PROGRESS', { detail: { progress: loadedPercentage } }));
            
        });

        this._video.addEventListener('wheel', (event) => {
            var posWheel = event.deltaY;
            var direction = null;

            if (posWheel > 0) {
                this._video.currentTime -= this._precision;
                direction = 'UP';
            } else {
                this._video.currentTime += this._precision;
                direction = 'DOWN';
            }

            this.dispatchEvent(new CustomEvent('WHEEL', { detail: { event: event, direction: direction } }));
        });
    }
}

export default VideoPlayer;