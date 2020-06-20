// 3次元ベクトル(3次元の点)を扱うクラス
class Vector3 {
  /**
   * @constructor
   * @param {number} x - x成分
   * @param {number} y - y成分
   * @param {number} z - z成分
   */
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  /**
   * x軸回りに回転する(時計回り...?)
   * @param {number} theta - 回転する角度(ラジアン)
   */
  rotateX(theta) {
    const A = [
      [1, 0, 0],
      [0, Math.cos(theta), -Math.sin(theta)],
      [0, Math.sin(theta), Math.cos(theta)]
    ];
    const x = A[0][0] * this.x + A[0][1] * this.y + A[0][2] * this.z;
    const y = A[1][0] * this.x + A[1][1] * this.y + A[1][2] * this.z;
    const z = A[2][0] * this.x + A[2][1] * this.y + A[2][2] * this.z;
    return new Vector3(x, y, z);
  }
  /**
   * y軸回りに回転する(時計周り...?)
   * @param {number} theta - 回転角度(ラジアン)
   */
  rotateY(theta) {
    const A = [
      [Math.cos(theta), 0, Math.sin(theta)],
      [0, 1, 0],
      [-Math.sin(theta), 0, Math.cos(theta)]
    ];
    /*
     const A = [
       [Math.cos(theta), 0, -Math.sin(theta)],
       [0, 1, 0],
       [Math.sin(theta), 0, Math.cos(theta)]
     ]
     */
    const x = A[0][0] * this.x + A[0][1] * this.y + A[0][2] * this.z;
    const y = A[1][0] * this.x + A[1][1] * this.y + A[1][2] * this.z;
    const z = A[2][0] * this.x + A[2][1] * this.y + A[2][2] * this.z;
    return new Vector3(x, y, z);
  }
}

//　多角形の頂点のインデックスの集合を持つクラス
class Polygon {
  /**
   * @constructor
   * @param {Array<number>} indexes - 頂点のインデックスの配列
   */
  constructor(indexes) {
    this.indexes = indexes;
    this.centerZ = 0;
  }
}

// 図形(とりあえず立方体)を扱うクラス
class Cube {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} context - 描画用のコンテキスト
   */
  constructor(context) {
    const SIZE = 100;
    const point0 = new Vector3(SIZE, SIZE, SIZE);
    const point1 = new Vector3(-SIZE, SIZE, SIZE);
    const point2 = new Vector3(-SIZE, -SIZE, SIZE);
    const point3 = new Vector3(SIZE, -SIZE, SIZE);
    const point4 = new Vector3(SIZE, SIZE, -SIZE);
    const point5 = new Vector3(-SIZE, SIZE, -SIZE);
    const point6 = new Vector3(-SIZE, -SIZE, -SIZE);
    const point7 = new Vector3(SIZE, -SIZE, -SIZE);

    this.context = context;
    this.points = [point0, point1, point2, point3, point4, point5, point6, point7];
    this.polygons = [
      new Polygon([0, 1, 2, 3]),
      new Polygon([0, 1, 5, 4]),
      new Polygon([1, 2, 6, 5]),
      new Polygon([2, 3, 7, 6]),
      new Polygon([3, 0, 4, 7]),
      new Polygon([4, 5, 6, 7])
    ];
  }

  /**
   * 頂点を描画する
   */
  drawPoints() {
    // 奥行きを表現するための値
    const cameraZ = 1000;
    const screenZ = 1000;

    this.context.fillStyle = 'white';
    for (const point of this.points) {
      const x = point.x / (point.z + cameraZ) * screenZ + this.context.canvas.width / 2;
      const y = -point.y / (point.z + cameraZ) * screenZ + this.context.canvas.height / 2;
      this.context.fillRect(x - 3, y - 3, 6, 6);
    }
  }

  /**
   * 面を描画する
   */
  drawPolygons() {
    // 奥行きを表現するための値
    const cameraZ = 1000;
    const screenZ = 1000;

    for (const polygon of this.polygons) {
      this.context.beginPath();
      let first = true;
      for (const index of polygon.indexes) {
        const point = this.points[index];
        const x = point.x / (point.z + cameraZ) * screenZ + this.context.canvas.width / 2;
        const y = -point.y / (point.z + cameraZ) * screenZ + this.context.canvas.height / 2;

        if (first) this.context.moveTo(x, y), first = false;
        else this.context.lineTo(x, y);
      }
      this.context.closePath();
      this.context.strokeStyle = 'white';
      this.context.stroke();
    }
  }
}