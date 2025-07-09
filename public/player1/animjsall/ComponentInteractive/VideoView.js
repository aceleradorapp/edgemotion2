import DisplayObjectContainer from "../display/DisplayObjectContainer.js";
import ComponentEvent from "../core/ComponentEvent.js";
import EventDispatcher from "../core/EventDispatcher.js";

class VideoView extends DisplayObjectContainer {
    constructor(data) {
        super()
        this._type = 'componentInteractive';
        this._name = 'videoView';

        this._data = data;

        this.video = document.createElement('video');
        //this.video.src = object.name; //para testar o componente aqui neste projeto, troque essa linha pela debaixo.
        this.video.src = data.object.url+data.object.name;
        this.speed = parseFloat(this._data.object.speed);

        this.videoLoaded = this._videoLoaded.bind(this);
        this.loadedmetadata = this._loadedmetadata.bind(this);
        this.ended = this._ended.bind(this);

        this.video.addEventListener('loadeddata', this.videoLoaded);
        this.video.addEventListener('loadedmetadata', this.loadedmetadata)
        this.video.addEventListener('ended', this.ended)
        this.videoStatus = false;

    }

    on() {
        this.start();
    }

    off() {
        this._removeEvents();
        this.video.pause();
        this.video.currentTime = 0;
    }

    start() {
        this._createComponents();
        this._addEvents();
        this.video.playbackRate = this.speed;
        this.video.play()
    }

    _createComponents() {

    }

    _addEvents() {

    }

    _removeEvents() {

    }

    _videoLoaded(event) {
        this.videoStatus = true;
        //this.video.play()
    }

    _loadedmetadata(events) {
        //this.video.play()
    }

    _ended(event) {
        this.onFinished();
    }

    onFinished() {
        console.log('Acabou - enviar a ação');
        this._removeEvents();
        this.dispatchEvent({ type: ComponentEvent.ACTION, state: 'up' });
    }

    draw(context2d) {

        if (!this.videoStatus) return;

        context2d.drawImage(this.video, 0, 0);
    }
}

export default VideoView