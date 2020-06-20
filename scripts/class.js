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
  add(vec) {
    return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
  }
  sub(vec) {
    return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
  }
  mul(k) {
    return new Vector3(this.x * k, this.y * k, this.z * k);
  }
  cross(vec) {
    return new Vector3(
      this.y * vec.z - this.z * vec.y,
      this.z * vec.x - this.x * vec.z,
      this.x * vec.y - this.y * vec.x
    );
  }
  norm() {
    return Math.hypot(this.x, this.y, this.z);
  }
  normalize() {
    console.assert(this.norm() !== 0, 'zero division occured!');
    return this.mul(1 / this.norm());
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
  /**
   * 成分を表示する(デバッグ用)
   */
  print() {
    console.log(`(${this.x}, ${this.y}, ${this.z})`);
  }
}

//　面の頂点のインデックスを持つクラス
class Polygon {
  /**
   * @constructor
   * @param {Array<number>} indexes - 頂点のインデックスの配列
   */
  constructor(indexes) {
    this.indexes = indexes;
    this.centerZ = 0;
    this.normalVector = null;
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
      new Polygon([0, 4, 5, 1]),
      new Polygon([1, 5, 6, 2]),
      new Polygon([2, 6, 7, 3]),
      new Polygon([3, 7, 4, 0]),
      new Polygon([4, 7, 6, 5])
    ];
  }

  /**
   * 頂点を描画する
   */
  drawPoints() {
    // 奥行きを表現するための値
    const cameraZ = 1000;
    const screenZ = 1000;

    this.context.fillStyle = 'gray';
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

    // 面の描画の前処理
    this.prepare();
    for (const polygon of this.polygons) console.log(polygon.centerZ);

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
      // 辺の描画
      this.context.closePath();
      this.context.strokeStyle = 'black';
      this.context.stroke();
      // 面の描画
      this.context.fillStyle = 'white';
      this.context.fill();
    }
  }

  /**
   * 面の描画の準備をする
   */
  prepare() {
    // 中心のz座標を計算する
    this.polygons.forEach((polygon) => {
      let centerZ = 0;
      for (const i of polygon.indexes) centerZ += this.points[i].z;
      centerZ /= polygon.indexes.length;
      polygon.centerZ = centerZ;
    });

    // 中心のz座標の大きい順番にソートする
    this.polygons.sort((a, b) => {
      return b.centerZ - a.centerZ;
    });

    // 法線ベクトルを求める
    this.polygons.forEach((polygon) => {
      const p0 = this.points[polygon.indexes[0]];
      const p1 = this.points[polygon.indexes[1]];
      const p2 = this.points[polygon.indexes[2]];

      p0.print();
      p1.print();
      p2.print();
      const normalVector = p1.sub(p0).cross(p2.sub(p1)).normalize().mul(100);
      normalVector.print();

      const center = new Vector3(
        polygon.indexes.reduce((acc, idx) => acc + this.points[idx].x, 0) / polygon.indexes.length,
        polygon.indexes.reduce((acc, idx) => acc + this.points[idx].y, 0) / polygon.indexes.length,
        polygon.indexes.reduce((acc, idx) => acc + this.points[idx].z, 0) / polygon.indexes.length
      );
      const endPoint = center.add(normalVector);
      // 法線ベクトルを描画する
      const [x1, y1] = this.adjust(center.x, center.y, center.z);
      const [x2, y2] = this.adjust(endPoint.x, endPoint.y, endPoint.z);
      this.context.beginPath();
      this.context.moveTo(x1, y1);
      this.context.lineTo(x2, y2);
      this.context.strokeStyle = 'orange';
      this.context.stroke();
    });
  }

  adjust(x, y, z) {
    const cameraZ = 1000;
    const screenZ = 1000;
    return [
      x / (z + cameraZ) * screenZ + this.context.canvas.width / 2,
      -y / (z + cameraZ) * screenZ + this.context.canvas.height / 2
    ];
  }

  /**
   * x軸回りに回転する
   * @param {number} theta - 回転する角度(ラジアン)
   */
  rotateX(theta) {
    this.points = this.points.map(point => point.rotateX(theta));
  }
  /**
   * y軸回りに回転する
   * @param {number} theta - 回転する角度(ラジアン)
   */
  rotateY(theta) {
    this.points = this.points.map(point => point.rotateY(theta));
  }
}