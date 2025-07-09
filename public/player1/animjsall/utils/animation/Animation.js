import EventDispatcher from "../../core/EventDispatcher.js";
import CatmullRomSpline from "./CatmullRomSpline.js";


class Animation extends EventDispatcher {
    constructor() {
        super();
      }
    
      /**
       * Método que cria um movimento linear em um determinado tempo entre duas posições.
       * 
       * @param {InteractiveObject} obj 
       * @param {Pointer} startPos 
       * @param {Pointer} endPos 
       * @param {Number em segundos} time 
       */
      linear(obj, startPos, endPos, time) {
        const start = new Date().getTime();
        const duration = time * 1000;
        const distanceX = endPos.x - startPos.x;
        const distanceY = endPos.y - startPos.y;
    
        const step = () => {
          const now = new Date().getTime();
          const elapsed = now - start;
          const t = elapsed / duration;
    
          if (t < 1) {
            obj.x = startPos.x + (distanceX * t);
            obj.y = startPos.y + (distanceY * t);
            requestAnimationFrame(step);
          } else {
            obj.x = endPos.x;
            obj.y = endPos.y;
            cancelAnimationFrame(requestID);
          }
        };
    
        const requestID = requestAnimationFrame(step);
      }

      /**
       * Move um objeto de uma posição inicial para uma posição final 
       * com uma aceleração inicial suave e um final mais abrupto. Os parâmetros são:
       * 
       * @param {InteractiveObject} obj 
       * @param {Pointer} startPos 
       * @param {Pointer} endPos 
       * @param {Number em segundos} time 
       */
      easeIn(obj, startPos, endPos, time) {
        const start = new Date().getTime();
        const duration = time * 1000;
        const distanceX = endPos.x - startPos.x;
        const distanceY = endPos.y - startPos.y;
      
        const step = () => {
          const now = new Date().getTime();
          const elapsed = now - start;
          const t = elapsed / duration;
      
          if (t < 1) {
            const ease = t * t;
            obj.x = startPos.x + (distanceX * ease);
            obj.y = startPos.y + (distanceY * ease);
            requestAnimationFrame(step);
          } else {
            obj.x = endPos.x;
            obj.y = endPos.y;
            cancelAnimationFrame(requestID);
          }
        };
      
        const requestID = requestAnimationFrame(step);
      }

      /**
       * Move um objeto de uma posição inicial para uma posição final 
       * com uma aceleração final suave e um início mais abrupto. Os parâmetros são:
       * 
       * @param {InteractiveObject} obj 
       * @param {Pointer} startPos 
       * @param {Pointer} endPos 
       * @param {Number em segundos} time 
       */
      easeOut(obj, startPos, endPos, time) {
        const start = new Date().getTime();
        const duration = time * 1000;
        const distanceX = endPos.x - startPos.x;
        const distanceY = endPos.y - startPos.y;
      
        const step = () => {
          const now = new Date().getTime();
          const elapsed = now - start;
          const t = elapsed / duration;
      
          if (t < 1) {
            const ease = 1 - (1 - t) * (1 - t);
            obj.x = startPos.x + (distanceX * ease);
            obj.y = startPos.y + (distanceY * ease);
            requestAnimationFrame(step);
          } else {
            obj.x = endPos.x;
            obj.y = endPos.y;
            cancelAnimationFrame(requestID);
          }
        };
      
        const requestID = requestAnimationFrame(step);
      }
      
      
      /**
       * Move um objeto de uma posição inicial para uma posição final 
       * com uma aceleração elástica. Os parâmetros são:
       * 
       * @param {InteractiveObject} obj 
       * @param {Pointer} startPos 
       * @param {Pointer} endPos 
       * @param {Number em segundos} time 
       */
      elastic(obj, startPos, endPos, time) {
        const start = new Date().getTime();
        const duration = time * 1000;
        const distanceX = endPos.x - startPos.x;
        const distanceY = endPos.y - startPos.y;
    
        const elasticOut = (t, b, c, d) => {
          const ts = (t /= d) * t;
          const tc = ts * t;
          return b + c * (33 * tc * ts + -106 * ts * ts + 126 * tc + -67 * ts + 15 * t);
        };
    
        const step = () => {
          const now = new Date().getTime();
          const elapsed = now - start;
          const t = elapsed / duration;
    
          if (t < 1) {
            obj.x = elasticOut(t, startPos.x, distanceX, 1);
            obj.y = elasticOut(t, startPos.y, distanceY, 1);
            requestAnimationFrame(step);
          } else {
            obj.x = endPos.x;
            obj.y = endPos.y;
            cancelAnimationFrame(requestID);
          }
        };
    
        const requestID = requestAnimationFrame(step);
      }

      /**
       * Aumenta gradualmente a transparência de um objeto de 0 para 1. Os parâmetros são:
       * 
       * @param {InteractiveObject} obj 
       * @param {Pointer} startPos 
       * @param {Pointer} endPos 
       * @param {Number em segundos} time 
       */
      fadeIn(obj, time) {
        obj.alpha = 0;
        const start = new Date().getTime();
        const duration = time * 1000;
      
        const step = () => {
          const now = new Date().getTime();
          const elapsed = now - start;
          const t = elapsed / duration;
      
          if (t < 1) {
            obj.alpha = t;
            requestAnimationFrame(step);
          } else {
            obj.alpha = 1;
            cancelAnimationFrame(requestID);
          }
        };
      
        const requestID = requestAnimationFrame(step);
      }
      
      /**
       * Diminui gradualmente a transparência de um objeto de 1 para 0. Os parâmetros são:
       * 
       * @param {InteractiveObject} obj 
       * @param {Pointer} startPos 
       * @param {Pointer} endPos 
       * @param {Number em segundos} time 
       */
      fadeOut(obj, time) {
        obj.alpha = 1;
        const start = new Date().getTime();
        const duration = time * 1000;
      
        const step = () => {
          const now = new Date().getTime();
          const elapsed = now - start;
          const t = elapsed / duration;
      
          if (t < 1) {
            obj.alpha = 1 - t;
            requestAnimationFrame(step);
          } else {
            obj.alpha = 0;
            cancelAnimationFrame(requestID);
          }
        };
      
        const requestID = requestAnimationFrame(step);
      }

      /**
       * Move um objeto ao longo de um caminho definido por uma lista de pontos. Os parâmetros são:
       * 
       * @param {InteractiveObject} obj 
       * @param {Pointer} startPos 
       * @param {Pointer} endPos 
       * @param {Number em segundos} time 
       */
      path(obj, pathList, duration) {
        duration = duration*100;
        var startTime = performance.now();
        const start = { x: obj.x, y: obj.y };
        const end = pathList[0];
        let currentPathIndex = 0;
        
      
        function step(timestamp) {
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const nextPoint = pathList[currentPathIndex];
          const x = start.x + (nextPoint.x - start.x) * progress;
          const y = start.y + (nextPoint.y - start.y) * progress;
      
          obj.x = x;
          obj.y = y;
      
          if (progress === 1) {
            currentPathIndex++;
            if (currentPathIndex >= pathList.length) {
                cancelAnimationFrame(requestID);
              //obj.dispatchEvent(new CustomEvent('animationComplete'));
              return;
            }
            start.x = x;
            start.y = y;
            startTime = timestamp;
          }
      
          const requestID = requestAnimationFrame(step);
        }
      
        step()
      }
      

      

        /**
       * Move um objeto ao longo de um caminho definido por uma lista de pontos com movimentos suaves. Os parâmetros são:
       * 
       * @param {InteractiveObject} obj 
       * @param {Pointer} startPos 
       * @param {Pointer} endPos 
       * @param {Number em segundos} time 
       */
        pathSmooth(obj, pathList, duration) {
            duration = duration*100;
            let startTime;
            const points = pathList.map(point => [point.x, point.y]);
          
            function smoothstep(edge0, edge1, x) {
              // Scale x to 0..1
              x = Math.max(0, Math.min((x - edge0) / (edge1 - edge0), 1));
              // Evaluate polynomial
              return x * x * (3 - 2 * x);
            }
          
            function lerp(a, b, t) {
              return (1 - t) * a + t * b;
            }
          
            function step(timestamp) {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const pointIndex = Math.min(Math.floor(progress * (points.length - 1)), points.length - 2);
              const [x1, y1] = points[pointIndex];
              const [x2, y2] = points[pointIndex + 1];
              const t = smoothstep(pointIndex, pointIndex + 1, progress * (points.length - 1));
              const x = lerp(x1, x2, t);
              const y = lerp(y1, y2, t);
              obj.x = x;
              obj.y = y;
              if (progress < 1) {
                const requestID = requestAnimationFrame(step);
              } else {
                // Animation finished
                cancelAnimationFrame(requestID);
                //obj.dispatchEvent(new CustomEvent('animationComplete'));
              }
            }
          
            const requestID = requestAnimationFrame(step);
            //step();
          }      
      
}

export default Animation;

/* Exemplo de uso do metodo path e pathSmooth

        const sprite = new Sprite();
        document.body.appendChild(sprite.element);

        const pathList = [
        { x: 50, y: 50 },
        { x: 200, y: 50 },
        { x: 200, y: 200 },
        { x: 50, y: 200 },
        { x: 50, y: 50 }
        ];

    sprite.path2(pathList, 3000, 0.5);
*/