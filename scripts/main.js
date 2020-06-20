(() => {
  // canvas
  const CANVAS_HEIGHT = 600;
  const CANVAS_WIDTH = 600;
  let canvas = null;
  let context = null;

  // 描画する立方体
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

    // 立体対角線がy軸に並行になるように回転
    cube.rotateY(45 * Math.PI / 180);
    cube.rotateX(Math.acos(1 / Math.sqrt(3)));

    render();
  }

  function render() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 描画処理
    cube.drawPoints();
    cube.drawPolygons();

    // 回転処理
    cube.rotateY(1 * Math.PI / 180);

    // requestAnimationFrame(render);
  }
})();