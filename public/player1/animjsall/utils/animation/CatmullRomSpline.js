class CatmullRomSpline {
    constructor(points, alpha = 0.5) {
      this.points = points;
      this.alpha = alpha;
    }
  
    getPoint(t) {
      const p = (this.points.length - 1) * t;
  
      const intPoint = Math.floor(p);
      const weight = p - intPoint;
  
      const p0 = this.points[intPoint === 0 ? intPoint : intPoint - 1];
      const p1 = this.points[intPoint];
      const p2 = this.points[intPoint > this.points.length - 2 ? this.points.length - 1 : intPoint + 1];
      const p3 = this.points[intPoint > this.points.length - 3 ? this.points.length - 1 : intPoint + 2];
  
      const w1 = this.catmullRom(weight, -this.alpha, 2 - this.alpha, 1, 0);
      const w2 = this.catmullRom(weight, 2 * this.alpha, this.alpha - 3, 0, 0);
      const w3 = this.catmullRom(weight, -this.alpha, 0, this.alpha - 2, 1);
      const w4 = this.catmullRom(weight, this.alpha, 1, -this.alpha, 0);
  
      const x = p0[0] * w1 + p1[0] * w2 + p2[0] * w3 + p3[0] * w4;
      const y = p0[1] * w1 + p1[1] * w2 + p2[1] * w3 + p3[1] * w4;
  
      return [x, y];
    }
  
    catmullRom(t, p0, p1, p2, p3) {
      return 0.5 * (
        (2 * p1) +
        (-p0 + p2) * t +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
        (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t
      );
    }

    path2(numPoints) {
        const path = [];
        for (let i = 0; i < numPoints; i++) {
          const t = i / (numPoints - 1);
          path.push(this.getPoint(t));
        }
        return path;
    }

    getTotalLength() {
        let length = 0;
        let lastPoint = this.getPoint(0);
        for (let t = 0.01; t <= 1; t += 0.01) {
          const point = this.getPoint(t);
          length += Math.sqrt((point[0] - lastPoint[0]) ** 2 + (point[1] - lastPoint[1]) ** 2);
          lastPoint = point;
        }
        return length;
    }

    getPointAt(distance) {
        if (distance <= 0) {
          return this.getPoint(0);
        } else if (distance >= this.getTotalLength()) {
          return this.getPoint(1);
        } else {
          let length = 0;
          let lastPoint = this.getPoint(0);
          for (let t = 0.01; t <= 1; t += 0.01) {
            const point = this.getPoint(t);

            length += Math.sqrt((point[0] - lastPoint[0]) ** 2 + (point[1] - lastPoint[1]) ** 2);
        if (length >= distance) {
            return point;
        }
            lastPoint = point;
        }
            return this.getPoint(1);
        }
        }
  }
  
  export default CatmullRomSpline;
  