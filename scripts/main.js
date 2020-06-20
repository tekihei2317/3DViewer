(() => {
  // canvas
  const CANVAS_HEIGHT = 600;
  const CANVAS_WIDTH = 600;
  let canvas = null;
  let context = null;

  // 図形の情報
  let cube = null;

  // 奥行きを表現するための値
  const cameraZ = 1000;
  const screenZ = 1000;

  window.addEventListener('load', () => {
    initialize();
  });

  function initialize() {
    canvas = document.getElementById('main_canvas');
    context = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    cube = new Cube();
    render();
  }

  function render() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 点の描画
    context.fillStyle = 'white';
    for (let i = 0; i < cube.points.length; i++) {
      const point = cube.points[i];

      const x = point.x / (point.z + cameraZ) * screenZ + canvas.width / 2;
      const y = -point.y / (point.z + cameraZ) * screenZ + canvas.height / 2;
      context.fillRect(x - 1, y - 1, 2, 2);
    }

    // 辺の描画
    for (const polygon of cube.polygons) {
      context.beginPath();
      const indexes = polygon.indexes;
      let first = false;
      for (const i of indexes) {
        const point = cube.points[i];
        const x = point.x / (point.z + cameraZ) * screenZ + canvas.width / 2;
        const y = -point.y / (point.z + cameraZ) * screenZ + canvas.height / 2;
        if (first === true) context.moveTo(x, y), first = false;
        else context.lineTo(x, y);
      }
      // context.lineWidth = 1;
      context.closePath();
      context.strokeStyle = 'white';
      context.stroke();
    }

    // 回転処理
    for (let i = 0; i < cube.points.length; i++) {
      cube.points[i] = cube.points[i].rotateY(1 * Math.PI / 180);
    }
    requestAnimationFrame(render);
  }
})();