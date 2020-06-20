(() => {
  // canvas
  const CANVAS_HEIGHT = 600;
  const CANVAS_WIDTH = 600;
  let canvas = null;
  let context = null;

  // 図形の情報
  let cube = null;


  window.addEventListener('load', () => {
    initialize();
  });

  function initialize() {
    canvas = document.getElementById('main_canvas');
    context = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    cube = new Cube(context);
    render();
  }

  function render() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 点の描画
    cube.drawPoints();

    // 面(辺)の描画
    cube.drawPolygons();

    // 回転処理
    for (let i = 0; i < cube.points.length; i++) {
      cube.points[i] = cube.points[i].rotateY(1 * Math.PI / 180);
    }
    requestAnimationFrame(render);
  }
})();