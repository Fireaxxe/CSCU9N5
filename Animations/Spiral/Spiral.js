var W, H, R, ctx, FPS = 60;
var step = 0.01;

window.onload = function() {
  setTimeout(function() {
    var canvas = document.querySelector('canvas');
    canvas.width = W = window.innerWidth;
    canvas.height = H = window.innerHeight;
    R = Math.min(W, H) / 2;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.strokeStyle = 'gold';
    animate();
  }, 200);
}

function animate() {
  setTimeout(function() {
    window.requestAnimationFrame(animate);
  }, 1000/FPS);
  
  ctx.fillRect(0, 0, W, H);
  ctx.beginPath();
  var now = Date.now()/1000;
  for(var t = -R; t <= R; t += step) {
    var a = t/R * 2*Math.PI * 8*Math.sin(now/8);
    var b = Math.cos(a+now/5);
    var c = Math.sin(a+now/7);
    var x = t*(b*Math.cos(a) - c*Math.sin(a));
    var y = t*(c*Math.sin(a) + b*Math.cos(a));
    ctx.lineTo(W/2+x, H/2+y);
  }
  ctx.stroke();
}