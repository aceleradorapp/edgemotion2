// Classe que representa um ponto em um espaço bidimensional
class Point {
  
    // Construtor da classe que recebe as coordenadas X e Y do ponto
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
  
    // Método que retorna uma cópia deste ponto
    clone() {
      return new Point(this.x, this.y);
    }
  
    // Método que verifica se este ponto é igual a outro ponto especificado
    equals(other) {
      return this.x === other.x && this.y === other.y;
    }
  
    // Método que desloca este ponto por um determinado valor nas coordenadas X e Y
    offset(dx, dy) {
      this.x += dx;
      this.y += dy;
    }
  
    // Método que define as coordenadas X e Y deste ponto
    setTo(x, y) {
      this.x = x;
      this.y = y;
    }
  
    // Método que retorna uma string que representa este ponto
    toString() {
      return `(${this.x},${this.y})`;
    }
  }
  
  export default Point