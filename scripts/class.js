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
   * y軸回りに回転する
   * @param {number} theta - 回転角度(ラジアン)
   */
  rotateY(theta) {
    const A = [
      [Math.cos(theta), 0, Math.sin(theta)],
      [0, 1, 0],
      [-Math.sin(theta), 0, Math.cos(theta)]
    ];
    const x = A[0][0] * this.x + A[0][1] * this.y + A[0][2] * this.z;
    const y = A[1][0] * this.x + A[1][1] * this.y + A[1][2] * this.z;
    const z = A[2][0] * this.x + A[2][1] * this.y + A[2][2] * this.z;
    return new Vector3(x, y, z);
  }
}