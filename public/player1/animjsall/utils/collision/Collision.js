import EventDispatcher from "../../core/EventDispatcher.js"

class Collision extends EventDispatcher{
    constructor(){
        super()
    }

    rectangleCollision(interactiveObject_a, interactiveObject_b){
        if (interactiveObject_a.x < interactiveObject_b.x + interactiveObject_b.width &&
            interactiveObject_a.x + interactiveObject_a.width > interactiveObject_b.x &&
            interactiveObject_a.y < interactiveObject_b.y + interactiveObject_b.height &&
            interactiveObject_a.y + interactiveObject_a.height > interactiveObject_b.y) 
        {
          return true;
        } else {
          return false;
        }
    }

    circleCollision(interactiveObject_a, interactiveObject_b){
        // Calcular a distância entre os centros dos objetos
        let dx = objeto1.x - objeto2.x;
        let dy = objeto1.y - objeto2.y;
        let distancia = Math.sqrt(dx * dx + dy * dy);
        
        // Verificar se a distância é menor do que a soma dos raios
        let raioTotal = objeto1.raio + objeto2.raio;
        if (distancia < raioTotal) {
            // Se a distância é menor, houve colisão
            return true;
        } else {
            // Se a distância é maior ou igual, não houve colisão
            return false;
        }
    }

    bitmapDataCollision(bitmapData1, bitmapData2) {
        if (!bitmapData1._onloadComplete || !bitmapData2._onloadComplete) {
          // As imagens ainda não foram carregadas, não há colisão
          return false;
        }
      
        // Calcule a área de interseção entre as duas imagens
        const x1 = Math.max(bitmapData1.x, bitmapData2.x);
        const y1 = Math.max(bitmapData1.y, bitmapData2.y);
        const x2 = Math.min(bitmapData1.x + bitmapData1.width, bitmapData2.x + bitmapData2.width);
        const y2 = Math.min(bitmapData1.y + bitmapData1.height, bitmapData2.y + bitmapData2.height);
      
        // Verifique se há sobreposição de pixels não transparentes
        for (let x = x1; x < x2; x++) {
          for (let y = y1; y < y2; y++) {
            const pixel1 = bitmapData1._getPixel(x - bitmapData1.x, y - bitmapData1.y);
            const pixel2 = bitmapData2._getPixel(x - bitmapData2.x, y - bitmapData2.y);
            if (pixel1.a !== 0 && pixel2.a !== 0) {
              return true;
            }
          }
        }
      
        return false;
      }
      
}

export default Collision;