(() => {
  // canvas
  const CANVAS_HEIGHT = 600;
  const CANVAS_WIDTH = 600;
  let canvas = null;
  let context = null;

  // 
  let points = [];

  // 奥行きを表現するための値
  const cameraZ = 500;
  const screenZ = 500;

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

    render();
  }

  function render() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.fillStyle = 'white';
    for (let i = 0; i < points.length; i++) {
      const point = points[i];

      const x = point.x / (point.z + cameraZ) * screenZ;
      const y = -point.y / (point.z + cameraZ) * screenZ;
      context.fillRect(x + canvas.width / 2, y + canvas.height / 2, 2, 2);
    }
  }

})();