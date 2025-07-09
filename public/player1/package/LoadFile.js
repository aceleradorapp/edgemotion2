import { EventDispatcher } from "../animjsall/Animjs.js";

class LoadFile extends EventDispatcher {
    constructor(urlComplete) {
        super();

        this.temporaryUrl = urlComplete+'/package.json';
    }

    source() {        

        fetch(this.temporaryUrl)        
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return response.json();
            })
            .then(json => {
                this._fileLoaded(json);
            })
            .catch(e => {
                console.log('There has been a problem with your fetch operation: ' + e.message);
            });
    }

    _fileLoaded(json) {
        this.dispatchEvent({ type: 'load_complete', target: this, data: json });
    }
}

export default LoadFile;



