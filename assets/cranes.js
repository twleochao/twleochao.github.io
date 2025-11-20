const canvas = document.getElementById('craneCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let cranes = [];
const mouse = { x: null, y: null };

const CRANE_COUNT = 35;
const CONNECTION_DIST = 100;
const MOUSE_RADIUS = 200;
const SPEED = 0.8; 

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
    this.size = Math.random() * 3 + 5; 
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (mouse.x != null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx*dx + dy*dy);
      
      if (distance < MOUSE_RADIUS) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
        
        this.vx += forceDirectionX * force * 0.05;
        this.vy += forceDirectionY * force * 0.05;
      }
    }

    const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
    if (speed > 2) {
      this.vx = (this.vx / speed) * 2;
      this.vy = (this.vy / speed) * 2;
    }

    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;
  }

  draw() {
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
    
    ctx.fillStyle = 'rgba(100, 100, 100, 0.15)';
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
    crane.update();
    crane.draw();
  });
  
  requestAnimationFrame(animate);
}

init();
animate();