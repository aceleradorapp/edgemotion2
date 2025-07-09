// Classe que representa um retângulo em um espaço bidimensional
class Rectangle {
  
    // Construtor da classe que recebe as coordenadas X e Y do canto superior esquerdo, a largura e a altura do retângulo
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
    }

    // Propriedade que retorna ou define a coordenada X do canto superior esquerdo deste retângulo
    get x() {
        return this._x;
    }
    
    set x(value) {
        this._x = value;
    }
    
    // Propriedade que retorna ou define a coordenada Y do canto superior esquerdo deste retângulo
    get y() {
        return this._y;
    }
    
    set y(value) {
    this._y = value;
    }
    
    // Propriedade que retorna ou define a largura deste retângulo
    get width() {
        return this._width;
    }
    
    set width(value) {
    this._width = value;
    }
    
    // Propriedade que retorna ou define a altura deste retângulo
    get height() {
        return this._height;
    }
    
    set height(value) {
        this._height = value;
    }
    
    // Propriedade que retorna a coordenada X do lado direito deste retângulo
    get right() {
        return this._x + this._width;
    }
    
    // Propriedade que retorna a coordenada Y do lado inferior deste retângulo
    get bottom() {
        return this._y + this._height;
    }
  
    // Método que retorna uma cópia deste retângulo
    clone() {
      return new Rectangle(this._x, this._y, this._width, this._height);
    }
  
    // Método que verifica se este retângulo é igual a outro retângulo especificado
    equals(other) {
      return this._x === other._x && this._y === other._y && this._width === other._width && this._height === other._height;
    }
  
    // Método que verifica se este retângulo contém um determinado ponto
    contains(x, y) {
      return x >= this._x && x <= this._x + this._width && y >= this._y && y <= this._y + this._height;
    }
  
    // Método que verifica se este retângulo contém outro retângulo especificado
    containsRect(other) {
      return other._x >= this._x && other._x + other._width <= this._x + this._width && other._y >= this._y && other._y + other._height <= this._y + this._height;
    }
  
    // Método que retorna a interseção entre este retângulo e outro retângulo especificado
    intersection(other) {
      const x = Math.max(this._x, other._x);
      const y = Math.max(this._y, other._y);
      const width = Math.min(this._x + this._width, other._x + other._width) - x;
      const height = Math.min(this._y + this._height, other._y + other._height) - y;
      return new Rectangle(x, y, width, height);
    }
  
    // Método que verifica se este retângulo se interseca com outro retângulo especificado
    intersects(other) {
      return !(this._x + this._width < other._x || other._x + other._width < this._x || this._y + this._height < other._y || other._y + other._height < this._y);
    }
  
    // Método que desloca este retângulo por um determinado valor nas coordenadas X e Y
    offset(dx, dy) {
      this._x += dx;
      this._y += dy;
    }
  
    // Método que define as coordenadas X e Y do canto superior esquerdo deste retângulo
    setTo(newX, newY, newWidth, newHeight) {
      this._x = newX;
      this._y =newY;
      this._width = newWidth;
      this._height = newHeight;
    }

    
    
    // Método que retorna uma string que representa este retângulo
    toString() {
    return `[Rectangle(x=${this._x}, y=${this._y}, width=${this._width}, height=${this._height})]`;
    }
}
  
export default Rectangle