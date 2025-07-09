import Event from "../../core/Event.js";
import Collision from "./Collision.js";

class CollisionGame extends Collision {
    constructor() {
        super()

        this.listObjects = [];

        this._pushObject = true;
        this.force = 3;
    }

    /**
     * Adiciona objetos a um container de objetos
     * @param {INteractiveObject} object 
     */
    addObject(object) {
        this.listObjects.push(object);
    }

    /**
     * 
     * @returns Retorna a quantidade de objetos que estão dentro do container
     */
    count() {
        return this.listObjects.length
    }

    /**
     * Calcula colisão simples.
     * 
     * @param {InteractiveObject} object_A 
     * @param {*InteractiveObject} object_B 
     * @returns Object
     */
    collideSimple(object_A, object_B) {
        // Calcula as posições das arestas dos objetos
        const left_A = object_A.x;
        const right_A = object_A.x + object_A.width;
        const top_A = object_A.y;
        const bottom_A = object_A.y + object_A.height;
        const left_B = object_B.x;
        const right_B = object_B.x + object_B.width;
        const top_B = object_B.y;
        const bottom_B = object_B.y + object_B.height;

        // Verifica se há sobreposição entre as áreas dos objetos
        if (bottom_A < top_B || top_A > bottom_B || right_A < left_B || left_A > right_B) {
            return null; // Não há colisão
        }

        // Calcula as áreas de sobreposição
        const overlap_top = Math.max(top_A, top_B);
        const overlap_bottom = Math.min(bottom_A, bottom_B);
        const overlap_left = Math.max(left_A, left_B);
        const overlap_right = Math.min(right_A, right_B);

        // Determina a direção da colisão
        const overlap_width = overlap_right - overlap_left;
        const overlap_height = overlap_bottom - overlap_top;
        const overlap_ratio_x = overlap_width / object_A.width;
        const overlap_ratio_y = overlap_height / object_A.height;

        if (overlap_ratio_x > overlap_ratio_y) {
            if (object_A.y < object_B.y) {
                return { objectB: { direct: "top", overlapY: overlap_height }, objectA: { direct: "bottom", overlapY: overlap_height } };
            } else {
                return { objectB: { direct: "bottom", overlapY: overlap_height }, objectA: { direct: "top", overlapY: overlap_height } };
            }
        } else {
            if (object_A.x < object_B.x) {
                return { objectB: { direct: "left", overlapX: overlap_width }, objectA: { direct: "right", overlapX: overlap_width } };
            } else {
                return { objectB: { direct: "right", overlapX: overlap_width }, objectA: { direct: "left", overlapX: overlap_width } };
            }
        }
    }

    blockObject(object_A, object_B) {
        const collision = this.collideSimple(object_A, object_B);

        if (collision) {
            const { direct } = collision.objectA;


            switch (direct) {
                case "top":
                    object_A.y = object_A.y + this.force;//object_B.y - object_A.height / 2;
                    break;
                case "bottom":
                    object_A.y = object_A.y - this.force;//object_B.y + object_B.height / 2 + object_A.height / 2;
                    break;
                case "left":
                    object_A.x = object_A.x + this.force;//object_B.x - object_A.width / 2;
                    break;
                case "right":
                    object_A.x = object_A.x - this.force;//object_B.x + object_B.width / 2 + object_A.width / 2;
                    break;
            }
        }
    }

    pushObject(object_A, object_B) {
        const collision = this.collideSimple(object_A, object_B);
        
        if (collision) {
          const { direct } = collision.objectA;
          
          switch (direct) {
            case "top":
              object_B.y = object_A.y - object_B.height;
              break;
            case "bottom":
              object_B.y = object_A.y + object_A.height;
              break;
            case "left":
              object_B.x = object_A.x - object_B.width;
              break;
            case "right":
              object_B.x = object_A.x + object_A.width;
              break;
          }
        }
      } 


    /**
     * Classe que testa a colisão entre objetos no container
     * 
     * @param {INteractiveObject} object 
     * @param {Array} listObjects 
     * @returns Object
     */
    testCollisionListObjects(object, listObjects = null, destroy = false) {
        if (!listObjects) {
            listObjects = this.listObjects;
            if (this.listObjects.length == 0) return;
        }

        var result = { crashed: false, objectCrashed: null, objectTested: null };

        for (var i = 0; i < listObjects.length; i++) {
            result = this.collideSimple(object, listObjects[i]);

            if (result.crashed) {
                result.objectCrashed = listObjects[i];
                result.objectTested = object;

                if (destroy) {
                    this.destroyObjectToList(result.objectCrashed, listObjects);
                }

                this.dispatchEvent(Object.assign({}, { type: Event.COLLISION, result: result }));
                break;
            }
        }

        return result;
    }

    /**
     * Remove um objeto de uma lista de objetos
     * @param {INteractiveObject} object 
     * @param {Array} listObjects 
     */
    destroyObjectToList(object, listObjects) {
        var i = listObjects.indexOf(object);
        if (i !== -1) {
            listObjects.splice(i, 1);
            i--;
        }

        return object;
    }


}

export default CollisionGame;