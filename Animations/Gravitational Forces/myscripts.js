var W, H, ctx, r, kx = 30, ky = 40;
var field = [], forces = [];

window.onload = function() {
  var canvas = document.querySelector('canvas');
  canvas.width = W = window.innerWidth;
  canvas.height = H = window.innerHeight;
  ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  
  r = Math.min(W/kx, H/ky) / 2 - 1;
  for(var x = W/kx/2; x < W; x += W/kx)
  for(var y = H/ky/2; y < H; y += H/ky)
    field.push({x:x, y:y, dx:0, dy:0});
  
  addForce(W/2, H/2, W/2, -W/kx);
  addForce(W/2, H/2, W/2, W/kx);
  
  animate();
}

function animate() {
  setTimeout(function() {
    window.requestAnimationFrame(animate);
  }, 1000/60);
  
  const t = Date.now()/3000;
  forces[0].x = W/2 + W/4*Math.cos(t);
  forces[0].y = H/2 + W/4*Math.sin(t);
  forces[1].x = W/2 - W/4*Math.cos(t);
  forces[1].y = H/2 + W/4*Math.sin(t);
  applyForces();
  applyColors();
  ctx.fillRect(0, 0, W, H);
  
  for(var i = 0; i < field.length; i++) {
    const p = field[i];
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x+p.dx, p.y+p.dy);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.x+p.dx, p.y+p.dy, r, 0, 7);
    ctx.strokeStyle = p.c;
    ctx.stroke();
  }
}

function addForce(x, y, r, f) {
  forces.push({x:x, y:y, r:r, f:f});
}

function applyForces() {
  field.map(function(p) {
    p.dx = p.dy = 0;
    forces.map(function(f) {
      const dx = f.x-p.x, dy = f.y-p.y;
      const d = Math.hypot(dx, dy);
      if(d < f.r) {
        const mag = (f.r - d)/f.r;
        p.dx += dx/d * mag * mag * f.f;
        p.dy += dy/d * mag * mag * f.f;
      }
    });
  });
}

function applyColors() {
  const max = field
   .map(function(p) {return Math.hypot(p.dx,p.dy)})
   .sort(function(a, b) {return b-a})[0];
  
  field.map(function(p) {
    const c = ~~(-Math.hypot(p.dx, p.dy)/max*120)+120;
    p.c = 'hsl('+c+', 100%, 50%)';
  });
}