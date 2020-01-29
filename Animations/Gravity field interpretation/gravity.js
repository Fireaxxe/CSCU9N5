var W, H, R, ctx;

var field, ball1, ball2;

// amount of dots per field dimention
var frequency = 100;

function initField() {
  const size = R / frequency * 2;
  field = new Array();
  for(var y = -R; y <= R; y += size)
    for(var x = -R; x <= R; x += size)
      field.push({x:x, y:y, z:0});
}

function initBalls() {
  ball1 = {x:0, y:0, z:0, r:10, m:50};
  ball2 = {x:0, y:0, z:0, r:20, m:100};
}

function projection(point, a, b) {
  return {
    x: a*point.x - b*point.y,
    y: (b*point.x + a*point.y) / 3 + point.z,
  }
}

function getFieldPoint(i, j) {
  return field[j*(frequency+1) + i];
}

window.onload = function() {
  var canvas = document.querySelector('canvas');
  canvas.width = W = window.innerWidth;
  canvas.height = H = window.innerHeight;
  R = Math.min(W, H) / 2.1;
  ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'rgba(20,180,150,0.7)';
  
  initField();
  initBalls();
  
  animate();
}

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = '#122';
  ctx.fillRect(0, 0, W, H);
  
  update();
  drawField();
  ctx.fillStyle = 'rgba(255,180,180,0.5)';
  drawBall(ball1);
  drawBall(ball2);
}

function update() {
  const t = Date.now() / 3e3;
  const c = Math.cos(t), s = Math.sin(t);
  
  ball1.x = R/2 * c; ball1.y = R/2 * s;
  
  for(var i = 0; i < field.length; i++) {
    const point = field[i];
    const dx1 = point.x - ball1.x;
    const dy1 = point.y - ball1.y;
    const d1 = Math.sqrt(dx1*dx1 + dy1*dy1);
    const dx2 = point.x - ball2.x;
    const dy2 = point.y - ball2.y;
    const d2 = Math.sqrt(dx2*dx2 + dy2*dy2);
    point.z = - 7*ball1.m / (d1/5 + 5)
              - 7*ball2.m / (d2/5 + 5);
  }
}

function drawField() {
  const t = Date.now() / 5e3;
  const c = Math.cos(t), s = Math.sin(t);
  var point;
  for(var j = 0; j <= frequency; j++) {
    ctx.beginPath();
    for(var i = 0; i <= frequency; i++) {
      point = projection(getFieldPoint(i, j), c, s);
      ctx.lineTo(W/2 + point.x, H/2 - point.y);
    }
    ctx.stroke();
  }
  for(var i = 0; i <= frequency; i++) {
    ctx.beginPath();
    for(var j = 0; j <= frequency; j++) {
      point = projection(getFieldPoint(i, j), c, s);
      ctx.lineTo(W/2 + point.x, H/2 - point.y);
    }
    ctx.stroke();
  }
}

function drawBall(ball) {
  const t = Date.now() / 5e3;
  const c = Math.cos(t), s = Math.sin(t);
  const point = projection(ball, c, s);
  ctx.beginPath();
  ctx.arc(W/2 + point.x, H/2 - point.y, ball.r, 0, 7);
  ctx.fill();
  ctx.stroke();
}