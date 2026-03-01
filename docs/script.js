const canvas = document.getElementById('windCanvas');
const ctx = canvas.getContext('2d');
let width, height, particles;
let mouse = { x: -2000, y: -2000 };
let targetMouse = { x: -2000, y: -2000 };

// --- PARÂMETROS DE CONTROLE ---
const lowRadius = 600;     // Tamanho da área de influência do ciclone
const flowSpeed = 1;       // VELOCIDADE GERAL
const particleCount = 500; // Quantidade de parcelas na tela

window.addEventListener('mousemove', e => { 
    mouse.x = e.clientX; 
    mouse.y = e.clientY; 
});

function getWindVelocity(x, y) {
    let vx = flowSpeed; 
    let vy = Math.sin(x * 0.005) * 0.1; 

    let dx = targetMouse.x - x;
    let dy = targetMouse.y - y;
    let dist = Math.sqrt(dx*dx + dy*dy);

    if (dist < lowRadius) {
        let force = Math.pow((lowRadius - dist) / lowRadius, 1.5);
        let angle = Math.atan2(dy, dx);

        let rotMag = 3.0 * force; 
        let rotX = Math.sin(angle) * rotMag;
        let rotY = -Math.cos(angle) * rotMag;

        let convMag = 0.7 * force;
        let convX = Math.cos(angle) * convMag;
        let convY = Math.sin(angle) * convMag;

        vx += rotX + convX; 
        vy += rotY + convY;
    }
    return { vx, vy };
}

class WindTrace {
    constructor() { this.init(true); }

    init(firstTime = false) {
        this.x = firstTime ? Math.random() * width : -50;
        this.y = Math.random() * height;
        this.history = []; 
        this.maxLen = Math.floor(Math.random() * 20) + 20; 
        this.opacity = Math.random() * 0.4 + 0.2;
        this.speedModifier = Math.random() * 0.3 + 0.7;
    }

    draw() {
        let vel = getWindVelocity(this.x, this.y);
        this.x += vel.vx * this.speedModifier; 
        this.y += vel.vy * this.speedModifier;

        this.history.push({x: this.x, y: this.y});
        if (this.history.length > this.maxLen) this.history.shift();

        if (this.history.length > 1) {
            ctx.beginPath(); 
            ctx.globalAlpha = this.opacity;
            ctx.moveTo(this.history[0].x, this.history[0].y);
            for (let i = 1; i < this.history.length; i++) {
                ctx.lineTo(this.history[i].x, this.history[i].y);
            }
            ctx.stroke();
        }

        let distToCenter = Math.sqrt(Math.pow(targetMouse.x - this.x, 2) + Math.pow(targetMouse.y - this.y, 2));
        
        if (this.x > width + 100 || this.y < -100 || this.y > height + 100 || distToCenter < 15) {
            this.init(false);
        }
    }
}

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = Array.from({length: particleCount}, () => new WindTrace());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    targetMouse.x += (mouse.x - targetMouse.x) * 0.03;
    targetMouse.y += (mouse.y - targetMouse.y) * 0.03;
    ctx.strokeStyle = '#25a4d7'; 
    ctx.lineWidth = 1.3;          
    particles.forEach(p => p.draw());
    requestAnimationFrame(animate);
}

window.addEventListener('resize', init);
init();
animate();