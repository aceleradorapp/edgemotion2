class FindPath extends Sprite {
    constructor(grid) {
      super();
      this.grid = grid;
      this.width = grid[0].length;
      this.height = grid.length;
    }
  
    findPath(start, end) {
      let openSet = [start];
      let closedSet = [];
      let cameFrom = {};
  
      let gScore = Array(this.width * this.height).fill(Number.MAX_SAFE_INTEGER);
      gScore[start] = 0;
  
      let fScore = Array(this.width * this.height).fill(Number.MAX_SAFE_INTEGER);
      fScore[start] = this.heuristic(start, end);
  
      while (openSet.length > 0) {
        let current = openSet.reduce((min, elem) => {
          return fScore[elem] < fScore[min] ? elem : min;
        }, openSet[0]);
  
        if (current === end) {
          return this.reconstructPath(cameFrom, end);
        }
  
        openSet = openSet.filter((elem) => elem !== current);
        closedSet.push(current);
  
        let neighbors = this.getNeighbors(current);
        for (let i = 0; i < neighbors.length; i++) {
          let neighbor = neighbors[i];
          if (closedSet.includes(neighbor)) {
            continue;
          }
  
          let tentativeGScore = gScore[current] + 1;
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          } else if (tentativeGScore >= gScore[neighbor]) {
            continue;
          }
  
          cameFrom[neighbor] = current;
          gScore[neighbor] = tentativeGScore;
          fScore[neighbor] = gScore[neighbor] + this.heuristic(neighbor, end);
        }
      }
  
      return null;
    }
  
    heuristic(a, b) {
      let x1 = a % this.width;
      let y1 = Math.floor(a / this.width);
      let x2 = b % this.width;
      let y2 = Math.floor(b / this.width);
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
  
    getNeighbors(cell) {
      let x = cell % this.width;
      let y = Math.floor(cell / this.width);
      let neighbors = [];
  
      if (x > 0 && !this.grid[y][x - 1]) {
        neighbors.push(cell - 1);
      }
  
      if (x < this.width - 1 && !this.grid[y][x + 1]) {
        neighbors.push(cell + 1);
      }
  
      if (y > 0 && !this.grid[y - 1][x]) {
        neighbors.push(cell - this.width);
      }
  
      if (y < this.height - 1 && !this.grid[y + 1][x]) {
        neighbors.push(cell + this.width);
      }
  
      return neighbors;
    }
  
    reconstructPath(cameFrom, current) {
      let path = [current];
      while (cameFrom[current]) {
        current = cameFrom[current];
        path.unshift(current);
      }
      return path;
    }
  }

  /* exemplo de uso

let grid = [
  [null, null, null, null, null, null],
  [null, 1, null, 1, null, null],
  [null, null, null, null, null, null],
  [null, null, null, 1, null, null],
  [null, 1, null, null, null, null],
  [null, null, null, null, null, null],
];

let start = 0;
let end = 35;

let finder = new FindPath(grid);
let path = finder.findPath(start, end);
console.log(path); // [0, 6, 12, 18, 24, 25, 26, 27, 28, 29, 35]



  */
