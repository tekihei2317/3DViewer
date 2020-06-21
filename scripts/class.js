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

  // 基本演算
  add(vec) {
    return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
  }
  sub(vec) {
    return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
  }
  mul(k) {
    return new Vector3(this.x * k, this.y * k, this.z * k);
  }
  dot(vec) {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  }
  cross(vec) {
    return new Vector3(
      this.y * vec.z - this.z * vec.y,
      this.z * vec.x - this.x * vec.z,
      this.x * vec.y - this.y * vec.x
    );
  }

  // 大きさに関する演算
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
    this.center = null;
    this.color = 'white';
    // 使ってない
    this.normalVector = null;
  }

  /**
   * 面を描画する
   * @param {CanvasRenderingContext2D} - 描画用のコンテキスト
   * @param {Array<Vector3>} points - 元の図形の点の集合
   */
  draw(context, points) {
    context.beginPath();

    let first = true;
    this.indexes.forEach((i) => {
      const point = points[i];
      const [x, y] = adjust(point.x, point.y, point.z);
      if (first === true) context.moveTo(x, y), first = false;
      else context.lineTo(x, y);
    });

    context.closePath();
    context.strokeStyle = 'black';
    context.stroke();
    context.fillStyle = this.color;
    context.fill();
  }

  /**
   * 面の情報(中心の座標、法線ベクトル)を再計算する
   * @param {Array<Vector3>} points - 元の図形の点の集合
   */
  update(points) {
    // 中心の座標を再計算する
    this.center = new Vector3(
      this.indexes.reduce((acc, idx) => acc + points[idx].x, 0) / this.indexes.length,
      this.indexes.reduce((acc, idx) => acc + points[idx].y, 0) / this.indexes.length,
      this.indexes.reduce((acc, idx) => acc + points[idx].z, 0) / this.indexes.length
    );

    // 法線ベクトルを再計算する
    const p0 = points[this.indexes[0]];
    const p1 = points[this.indexes[1]];
    const p2 = points[this.indexes[2]];
    this.normalVector = p1.sub(p0).cross(p2.sub(p1)).normalize();

    // 色を再計算する
    const light = new Vector3(1, -1, 1).normalize();
    const cos = this.normalVector.dot(light);
    this.color = this.calcColor(cos);
  }

  /**
   * 面の明るさを計算する
   * @param {number} cos - 光源と法線ベクトルの成す角の余弦
   */
  calcColor(cos) {
    const b = 120 + 120 * (-1) * cos;
    return `rgba(${b}, ${b}, ${b})`;
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
    this.context.fillStyle = 'gray';
    for (const point of this.points) {
      const [x, y] = adjust(point.x, point.y, point.z);
      this.context.fillRect(x - 3, y - 3, 6, 6);
    }
  }

  /**
   * 面を描画する
   */
  drawPolygons() {
    // 面の情報を更新する
    for (const polygon of this.polygons) polygon.update(this.points);
    // z座標の大きい順にソートする
    this.polygons.sort((a, b) => b.center.z - a.center.z);
    // 描画処理
    for (const polygon of this.polygons) polygon.draw(this.context, this.points);
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

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

function adjust(x, y, z) {
  const cameraZ = 1000;
  const screenZ = 1000;
  return [
    x / (z + cameraZ) * screenZ + CANVAS_WIDTH / 2,
    -y / (z + cameraZ) * screenZ + CANVAS_HEIGHT / 2
  ];
}