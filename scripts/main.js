(() => {
  // canvas
  const CANVAS_HEIGHT = 600;
  const CANVAS_WIDTH = 600;
  let canvas = null;
  let context = null;

  // 図形の情報
  let points = [];
  let polygons = [];

  // 奥行きを表現するための値
  const cameraZ = 1500;
  const screenZ = 1500;

  window.addEventListener('load', () => {
    initialize();
  });

  function initialize() {
    canvas = document.getElementById('main_canvas');
    context = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const SIZE = 100;
    const point0 = new Vector3(SIZE, SIZE, SIZE);
    const point1 = new Vector3(-SIZE, SIZE, SIZE);
    const point2 = new Vector3(-SIZE, -SIZE, SIZE);
    const point3 = new Vector3(SIZE, -SIZE, SIZE);
    const point4 = new Vector3(SIZE, SIZE, -SIZE);
    const point5 = new Vector3(-SIZE, SIZE, -SIZE);
    const point6 = new Vector3(-SIZE, -SIZE, -SIZE);
    const point7 = new Vector3(SIZE, -SIZE, -SIZE);

    points = [point0, point1, point2, point3, point4, point5, point6, point7];
    polygons = [
      [0, 1, 2, 3],
      [0, 1, 5, 4],
      [1, 2, 6, 5],
      [2, 3, 7, 6],
      [3, 0, 4, 7],
      [4, 5, 6, 7]
    ];

    render();
  }

  function render() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 点の描画
    context.fillStyle = 'white';
    for (let i = 0; i < points.length; i++) {
      const point = points[i];

      const x = point.x / (point.z + cameraZ) * screenZ + canvas.width / 2;
      const y = -point.y / (point.z + cameraZ) * screenZ + canvas.height / 2;
      context.fillRect(x - 1, y - 1, 2, 2);
    }

    // 辺の描画
    for (let i = 0; i < polygons.length; i++) {
      context.beginPath();
      const indexes = polygons[i];
      for (let j = 0; j < indexes.length; j++) {
        const index = indexes[j];
        const point = points[index];
        const x = point.x / (point.z + cameraZ) * screenZ + canvas.width / 2;
        const y = -point.y / (point.z + cameraZ) * screenZ + canvas.height / 2;
        if (j === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      // context.lineWidth = 1;
      context.closePath();
      context.strokeStyle = 'white';
      context.stroke();
    }

    // 回転処理
    for (let i = 0; i < points.length; i++) {
      points[i] = points[i].rotateY(1 * Math.PI / 180);
    }

    requestAnimationFrame(render);
  }

})();