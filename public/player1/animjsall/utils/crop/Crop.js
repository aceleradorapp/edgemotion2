/************************************************************************
 * Michael Milanez
 * 
 * Esta classe foi criado para capturar imagem de um vídeo ou imagem, 
 * pode ser capturado imagem inteira ou uma area da imagem.
 * A classe recebe um objeto video ou imagem que é 
 * tratada automaticamente por mídia.
 * 
 * exemplo:
 * 
 * var mediaElement = document.getElementById('video');
 * var crop = new Crop(mediaElement);
 * 
 * crop.addEventListener('imagecomplete', (event)=>{
 *    
 *    console.log(event.detail.base64);
 * 
 *    var imageBse64 = event.detail.base64;
 * }
 * 
 * var rect = {x:0,y:0,width:175, height:240};
 * var igmBase64 = crop.cropMediaToBase64(rect);
 */

class Crop extends EventTarget {

  /**
   * Object do tipo video ou image
   * @param {Object} media 
   */
  constructor(media) {
    super();

    this.media = media;
    this._cropArea = null;
    this._cropAreaOriginal = null;
  }

  /**
   * Retorna a area do tamanho real calculada quando a seleção 
   * da imagem e feito com o tamanho aumentado ou diminuido.
   */
  get cropAreaOriginal(){
    return this._cropAreaOriginal;
  }

  // recorta uma área da imagem ou video frame e retorna uma imagem base64
  cropMediaToBase64(cropArea) {
    if (cropArea.width == 0) {
      this.dispatchEvent(new CustomEvent('ERROR', { detail: { text: 'É necessário passar um valor da área selecionada corretamente.' } }));
      return;
    };

    this._cropArea = cropArea;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const zoom = this._getZoom();
    const cropRect = this._calculateCropRect(zoom);
    this._cropAreaOriginal = cropRect;

    canvas.width = cropRect.width;
    canvas.height = cropRect.height;

    context.drawImage(
      this.media,
      cropRect.x,
      cropRect.y,
      cropRect.width,
      cropRect.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    var base64 = canvas.toDataURL();

    // Retorna o retangulo do corte das imagens com o zoom calculado
    // é usado para criar o json baseado no tamanho real da resoluçao do vídeo.
    this.dispatchEvent(new CustomEvent('IMAGE_COMPLETE', { detail: { base64: base64, cropAreaOriginal: this._cropAreaOriginal } }));

    return base64;
  }

  captureFullImage() {
    const nodeName = this.media.nodeName;
    var width, height;

    if (nodeName === 'IMG') {
      width = this.media.naturalWidth
      height = this.media.naturalHeight;
    } else if (nodeName === 'VIDEO') {
      this.captureVideoFrame();
      return;
    }

    const fullRectArea = {
      x: 0, y: 0,
      width: width,
      height: height
    }

    return this.cropMediaToBase64(fullRectArea);
  }

  captureVideoFrame() {
    const canvas = document.createElement('canvas');
    canvas.width = this.media.videoWidth;
    canvas.height = this.media.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(this.media, 0, 0, canvas.width, canvas.height);

    var base64 = canvas.toDataURL();

    var cropRect = {
      x: 0, y: 0,
      width: this.media.videoWidth,
      height: this.media.videoHeight
    }

    this._cropAreaOriginal = cropRect;

    this.dispatchEvent(new CustomEvent('IMAGE_COMPLETE', { detail: { base64: base64, cropAreaOriginal: this._cropAreaOriginal } }));

    return base64;
  }

  // pega o valor de multiplicação para base de calculo do zoom da mídia
  _getZoom() {
    var zoomX, zoomY;

    const bounds = this.media.getBoundingClientRect();
    const width = bounds.width;
    const height = bounds.height;
    const naturalWidth = this.media.naturalWidth;
    const naturalHeight = this.media.naturalHeight;
    const nodeName = this.media.nodeName;

    if (nodeName === 'IMG') {
      zoomX = naturalWidth / width;
      zoomY = naturalHeight / height;
    } else if (nodeName === 'VIDEO') {
      zoomX = this.media.videoWidth / width;
      zoomY = this.media.videoHeight / height;
    } else {
      throw new Error('Tipo de mídia não suportado!');
    }

    return { x: zoomX, y: zoomY }
  }

  // recalcula os valores dos parametros do cropArea.
  _calculateCropRect(zoom) {
    return {
      x: this._cropArea.x * zoom.x,
      y: this._cropArea.y * zoom.y,
      width: this._cropArea.width * zoom.x,
      height: this._cropArea.height * zoom.y
    }
  }

}

export default Crop
