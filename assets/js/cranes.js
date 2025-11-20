const canvas = document.getElementById('craneCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let cranes = [];
const mouse = { x: null, y: null };

const CRANE_COUNT = 40;    
const MOUSE_RADIUS = 350; 
const FORCE_STRENGTH = 0.12;
const SPEED = 1.0;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

class Crane {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * SPEED;
    this.vy = (Math.random() - 0.5) * SPEED;
    this.size = Math.random() * 3 + 6; 
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    let distToMouse = 9999;

    if (mouse.x != null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      distToMouse = Math.sqrt(dx*dx + dy*dy);
      
      if (distToMouse < MOUSE_RADIUS) {
        const forceDirectionX = dx / distToMouse;
        const forceDirectionY = dy / distToMouse;
        const force = (MOUSE_RADIUS - distToMouse) / MOUSE_RADIUS;
        
        this.vx += forceDirectionX * force * FORCE_STRENGTH;
        this.vy += forceDirectionY * force * FORCE_STRENGTH;
      }
    }

    const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
    const maxSpeed = 3.5;
    if (speed > maxSpeed) {
      this.vx = (this.vx / speed) * maxSpeed;
      this.vy = (this.vy / speed) * maxSpeed;
    }

    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;

    return distToMouse;
  }

  draw(distToMouse) {
    const angle = Math.atan2(this.vy, this.vx);
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(angle + Math.PI/2);

    ctx.beginPath();
    ctx.moveTo(0, -this.size * 1.5);
    ctx.lineTo(this.size, this.size);
    ctx.lineTo(0, this.size * 0.5);  
    ctx.lineTo(-this.size, this.size);
    ctx.closePath();
    
    if (distToMouse < MOUSE_RADIUS) {
        const intensity = 1 - (distToMouse / MOUSE_RADIUS);
        ctx.fillStyle = `rgba(72, 199, 116, ${0.3 + intensity * 0.7})`;
        ctx.shadowBlur = 15 * intensity;
        ctx.shadowColor = '#48c774';
    } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.shadowBlur = 0;
    }
    
    ctx.fill();
    ctx.restore();
  }
}

function init() {
  cranes = [];
  for (let i = 0; i < CRANE_COUNT; i++) {
    cranes.push(new Crane());
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  
  cranes.forEach(crane => {
    const dist = crane.update();
    crane.draw(dist);
  });
  
  requestAnimationFrame(animate);
}

init();
animate();