class Physics {
    constructor(objects, x, y, width, height) {
      this.objects = objects;
      this.gravity = 0.5;
      this.quadrant = { x, y, width, height };
    }
  
    applyGravity() {
      for (let i = 0; i < this.objects.length; i++) {
        const object = this.objects[i];
        object.vy += this.gravity;
      }
    }
  
    applyCollisions() {
      for (let i = 0; i < this.objects.length; i++) {
        const object1 = this.objects[i];
        for (let j = i + 1; j < this.objects.length; j++) {
          const object2 = this.objects[j];
          if (this.checkCollision(object1, object2) &&
              this.isObjectInsideQuadrant(object1) &&
              this.isObjectInsideQuadrant(object2)) {
            this.resolveCollision(object1, object2);
          }
        }
      }
    }
  
    checkCollision(object1, object2) {
      // Verifica se object1 e object2 estão colidindo
      return object1.x < object2.x + object2.width &&
             object1.x + object1.width > object2.x &&
             object1.y < object2.y + object2.height &&
             object1.y + object1.height > object2.y;
    }
  
    resolveCollision(object1, object2) {
      // Aplica a resolução de colisão para object1 e object2
      // Nesta implementação, apenas inverte a velocidade vertical
      object1.vy = -object1.vy;
      object2.vy = -object2.vy;
    }
  
    isObjectInsideQuadrant(object) {
      return object.x >= this.quadrant.x &&
             object.x + object.width <= this.quadrant.x + this.quadrant.width &&
             object.y >= this.quadrant.y &&
             object.y + object.height <= this.quadrant.y + this.quadrant.height;
    }
  
    update() {
      this.applyGravity();
      this.applyCollisions();
    }
  }

  export default Physics 
  