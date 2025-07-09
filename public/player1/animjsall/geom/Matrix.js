class Matrix {
    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
      this.a = a; // elemento a (escala horizontal)
      this.b = b; // elemento b (inclinação horizontal)
      this.c = c; // elemento c (inclinação vertical)
      this.d = d; // elemento d (escala vertical)
      this.tx = tx; // elemento tx (translação horizontal)
      this.ty = ty; // elemento ty (translação vertical)
    }
  
    // Método de concatenação que multiplica esta matriz com outra matriz e retorna o resultado
    concat(otherMatrix) {
      const a = this.a * otherMatrix.a + this.b * otherMatrix.c;
      const b = this.a * otherMatrix.b + this.b * otherMatrix.d;
      const c = this.c * otherMatrix.a + this.d * otherMatrix.c;
      const d = this.c * otherMatrix.b + this.d * otherMatrix.d;
      const tx = this.tx * otherMatrix.a + this.ty * otherMatrix.c + otherMatrix.tx;
      const ty = this.tx * otherMatrix.b + this.ty * otherMatrix.d + otherMatrix.ty;
      return new Matrix(a, b, c, d, tx, ty);
    }
  
    // Método de inversão que retorna a matriz inversa desta matriz
    invert() {
      const determinant = this.a * this.d - this.b * this.c;
      if (determinant === 0) {
        return null;
      }
      const a = this.d / determinant;
      const b = -this.b / determinant;
      const c = -this.c / determinant;
      const d = this.a / determinant;
      const tx = (this.c * this.ty - this.d * this.tx) / determinant;
      const ty = (this.b * this.tx - this.a * this.ty) / determinant;
      return new Matrix(a, b, c, d, tx, ty);
    }
  
    // Método de rotação que retorna a matriz resultante da rotação especificada em graus
    rotate(angle) {
      const radians = angle * (Math.PI / 180);
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      const a = this.a * cos - this.b * sin;
      const b = this.a * sin + this.b * cos;
      const c = this.c * cos - this.d * sin;
      const d = this.c * sin + this.d * cos;
      const tx = this.tx * cos - this.ty * sin;
      const ty = this.tx * sin + this.ty * cos;
      return new Matrix(a, b, c, d, tx, ty);
    }
  
    // Método de escala que retorna a matriz resultante da escala especificada
    scale(sx, sy) {
      const a = this.a * sx;
      const b = this.b * sy;
      const c = this.c * sx;
      const d = this.d * sy;
      const tx = this.tx * sx;
      const ty = this.ty * sy;
      return new Matrix(a, b, c, d, tx, ty);
    }
  
    // Método de tradução que retorna a matriz resultante da translação especificada
    translate(dx, dy) {
      const a = this.a;
      const b = this.b;
      const c = this.c;
      const d = this.d;
      const tx = this.tx + dx;
      const ty = this.ty + dy;
      return new Matrix(a, b, c, d, tx, ty);
    }

    // Método que define os valores desta matriz
    setValues(a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }

    // Método que transforma um ponto usando esta matriz e retorna o resultado
    transformPoint(point) {
        const x = point.x * this.a + point.y * this.c + this.tx;
        const y = point.x * this.b + point.y * this.d + this.ty;
        return { x, y };
    }

    // Método que transforma uma matriz de exibição em uma matriz de coordenadas locais
    transformRectangle(rectangle) {
        const topLeft = this.transformPoint({ x: rectangle.x, y: rectangle.y });
        const topRight = this.transformPoint({ x: rectangle.x + rectangle.width, y: rectangle.y });
        const bottomLeft = this.transformPoint({ x: rectangle.x, y: rectangle.y + rectangle.height });
        const bottomRight = this.transformPoint({ x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height });
        const minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
        const maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
        const minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
        const maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }
    
    // Método que retorna uma cópia desta matriz
    clone() {
        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }

    toString() {
        return `(${this.a},${this.b},${this.c},${this.d},${this.tx},${this.ty})`;
    }
}

export default Matrix;