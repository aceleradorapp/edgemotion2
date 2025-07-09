class Transform {
    constructor(displayObject) {
      this._displayObject = displayObject;
      this._matrix = new Matrix();
      this._colorTransform = new ColorTransform();
    }
    
    get matrix() {
      return this._matrix.clone();
    }
    
    set matrix(value) {
      this._matrix.copyFrom(value);
      this._displayObject.updateTransform();
    }
    
    get colorTransform() {
      return this._colorTransform.clone();
    }
    
    set colorTransform(value) {
      this._colorTransform.copyFrom(value);
      this._displayObject.updateTransform();
    }
    
    get concatenatedMatrix() {
      let matrix = this._matrix.clone();
      let parent = this._displayObject.parent;
      while (parent) {
        matrix.concat(parent.transform.matrix);
        parent = parent.parent;
      }
      return matrix;
    }
    
    get concatenatedColorTransform() {
      let colorTransform = this._colorTransform.clone();
      let parent = this._displayObject.parent;
      while (parent) {
        colorTransform.concat(parent.transform.colorTransform);
        parent = parent.parent;
      }
      return colorTransform;
    }
    
    get pixelBounds() {
      let bounds = this._displayObject.getBounds(this._displayObject);
      let topLeft = this._matrix.transformPoint(new Point(bounds.x, bounds.y));
      let bottomRight = this._matrix.transformPoint(new Point(bounds.right, bounds.bottom));
      bounds.x = Math.floor(topLeft.x);
      bounds.y = Math.floor(topLeft.y);
      bounds.width = Math.ceil(bottomRight.x - topLeft.x);
      bounds.height = Math.ceil(bottomRight.y - topLeft.y);
      return bounds;
    }
}
  
export default Transform;