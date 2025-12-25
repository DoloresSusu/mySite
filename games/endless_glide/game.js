/**
 * Endless Glide (无尽滑行) - Core Logic
 * Re-implemented to strictly match the provided UI screenshots and mechanics.
 **/

const CONFIG = {
    ASPECT_RATIO: 12 / 8,
    LOGICAL_WIDTH: 1200,
    LOGICAL_HEIGHT: 800,
    GRAVITY: 0.18,
    JUMP_FORCE: -6,
    BASE_VX: 8, // 基础速度加倍，从 4 提升至 8
    ACCEL_FORCE: 0.3, // 加速力度也略微提升
    MAX_VX: 25, // 最高速度上限提升，从 12 提升至 25
    FRICTION: 0.98,
    TERRAIN_SAMPLE_STEP: 15,
    RIBBON_LENGTH: 60,
    DISTANCE_PER_COLOR_STAGE: 500, // 修改为 500 米切换一次风景
    COLOR_STAGES: [
        { top: '#ff5f6d', bottom: '#6a11cb' }, // 日落红-深紫
        { top: '#2193b0', bottom: '#6dd5ed' }, // 浅蓝-青
        { top: '#1f1c2c', bottom: '#928dab' }, // 迷雾灰-紫
        { top: '#f8ff00', bottom: '#3ad59f' }, // 黄-绿
        { top: '#e65100', bottom: '#fb8c00' }  // 亮橙-深橙
    ],
    PARALLAX_LAYERS: [
        { speed: 0.2, color: '#321432', freq: 0.001, amp: 100, offset: 50 },
        { speed: 0.5, color: '#4b1e4b', freq: 0.002, amp: 150, offset: 150 },
        { speed: 1.0, color: '#000000', freq: 0.005, amp: 200, offset: 250 } // Main foreground
    ],
    TREE_CHANCE: 0.05
};

class Utils {
    static lerp(a, b, t) { return a + (b - a) * t; }
    static noise(x) {
        let i = Math.floor(x);
        let f = x - i;
        let u = f * f * (3 - 2 * f);
        return Utils.lerp(Utils.hash(i), Utils.hash(i + 1), u);
    }
    static hash(x) {
        let h = Math.sin(x) * 43758.5453123;
        return h - Math.floor(h);
    }
    static interpolateColor(c1, c2, t) {
        const parse = (c) => c.startsWith('#') ? [parseInt(c.substring(1, 3), 16), parseInt(c.substring(3, 5), 16), parseInt(c.substring(5, 7), 16)] : [0, 0, 0];
        const [r1, g1, b1] = parse(c1);
        const [r2, g2, b2] = parse(c2);
        const r = Math.round(Utils.lerp(r1, r2, t));
        const g = Math.round(Utils.lerp(g1, g2, t));
        const b = Math.round(Utils.lerp(b1, b2, t));
        return `rgb(${r},${g},${b})`;
    }
}

class Player {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = 240;
        this.y = 400;
        this.vy = 0;
        this.vx = CONFIG.BASE_VX;
        this.isAccelerating = false;
        this.ribbon = [];
        this.angle = 0;
        this.width = 30; // Silhouette dimensions
        this.height = 40;
    }
    update(terrainY) {
        // Horizontal Movement (Acceleration & Friction)
        if (this.isAccelerating) {
            this.vx += CONFIG.ACCEL_FORCE;
        } else {
            this.vx = Utils.lerp(this.vx, CONFIG.BASE_VX, 0.01);
        }
        this.vx = Math.min(this.vx, CONFIG.MAX_VX);

        // Vertical Movement
        this.vy += CONFIG.GRAVITY;
        this.y += this.vy;

        // Ground check
        if (this.y > terrainY - 10) {
            this.y = terrainY - 10;
            this.vy = 0;
            this.angle = 0;
        } else {
            this.angle = Utils.lerp(this.angle, this.vy * 0.05, 0.1);
        }

        // Ribbon
        this.ribbon.unshift({ x: this.x, y: this.y });
        if (this.ribbon.length > CONFIG.RIBBON_LENGTH) this.ribbon.pop();
    }
    jump() {
        this.vy = CONFIG.JUMP_FORCE;
    }
    draw(ctx) {
        // Draw Ribbon (Solid black line like the image)
        if (this.ribbon.length > 2) {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(this.ribbon[0].x, this.ribbon[0].y);
            for (let i = 1; i < this.ribbon.length; i++) {
                ctx.lineTo(this.ribbon[i].x - (i * this.vx * 0.5), this.ribbon[i].y);
            }
            ctx.stroke();
        }

        // Draw Silhouette Surfer
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = '#000';

        // Surfer body (simple humanoid silhouette)
        ctx.beginPath();
        ctx.arc(0, -25, 6, 0, Math.PI * 2); // Head
        ctx.fill();
        ctx.fillRect(-3, -20, 6, 15); // Body
        ctx.fillRect(-10, -18, 20, 4); // Arms
        ctx.beginPath(); // Board
        ctx.ellipse(0, 0, 15, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class TerrainLayer {
    constructor(layerConfig) {
        this.config = layerConfig;
        this.nodes = [];
        this.trees = [];
        this.startX = 0;
        this.fillNodes();
    }
    fillNodes() {
        for (let i = 0; i < CONFIG.LOGICAL_WIDTH / CONFIG.TERRAIN_SAMPLE_STEP + 5; i++) {
            this.addNode();
        }
    }
    addNode() {
        const x = this.nodes.length * CONFIG.TERRAIN_SAMPLE_STEP;
        const totalX = this.startX + x;
        const h = Utils.noise(totalX * this.config.freq) * this.config.amp;
        const y = CONFIG.LOGICAL_HEIGHT - this.config.offset - h;
        this.nodes.push({ x, y });

        // Add tree to foreground layer
        if (this.config.speed === 1.0 && Math.random() < CONFIG.TREE_CHANCE) {
            this.trees.push({ x, y, size: 20 + Math.random() * 40 });
        }
    }
    update(vx) {
        const move = vx * this.config.speed;
        this.startX += move;
        this.nodes.forEach(n => n.x -= move);
        this.trees.forEach(t => t.x -= move);

        while (this.nodes.length > 0 && this.nodes[0].x < -CONFIG.TERRAIN_SAMPLE_STEP) {
            this.nodes.shift();
            this.addNode();
        }
        this.trees = this.trees.filter(t => t.x > -100);
    }
    draw(ctx) {
        ctx.fillStyle = this.config.color;
        ctx.beginPath();
        ctx.moveTo(0, CONFIG.LOGICAL_HEIGHT);
        if (this.nodes.length > 0) {
            ctx.lineTo(this.nodes[0].x, this.nodes[0].y);
            for (let i = 1; i < this.nodes.length - 2; i++) {
                const xc = (this.nodes[i].x + this.nodes[i + 1].x) / 2;
                const yc = (this.nodes[i].y + this.nodes[i + 1].y) / 2;
                ctx.quadraticCurveTo(this.nodes[i].x, this.nodes[i].y, xc, yc);
            }
            ctx.lineTo(CONFIG.LOGICAL_WIDTH, CONFIG.LOGICAL_HEIGHT);
        }
        ctx.fill();

        // Draw trees
        this.trees.forEach(tree => {
            ctx.save();
            ctx.translate(tree.x, tree.y);
            ctx.fillStyle = '#000';
            const s = tree.size;
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.lineTo(-s / 3, 0);
            ctx.lineTo(s / 3, 0);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.7);
            ctx.lineTo(-s / 2.5, -s * 0.2);
            ctx.lineTo(s / 2.5, -s * 0.2);
            ctx.fill();
            ctx.restore();
        });
    }
    getYAt(x) {
        const idx = Math.floor(x / CONFIG.TERRAIN_SAMPLE_STEP);
        if (idx >= 0 && idx < this.nodes.length) return this.nodes[idx].y;
        return CONFIG.LOGICAL_HEIGHT;
    }
}

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.layers = CONFIG.PARALLAX_LAYERS.map(l => new TerrainLayer(l));
        this.player = new Player();
        this.distance = 0;
        this.status = 'IDLE';
        this.initResize();
        this.initInput();
        this.loop();
    }
    initResize() {
        const resize = () => {
            this.canvas.width = CONFIG.LOGICAL_WIDTH;
            this.canvas.height = CONFIG.LOGICAL_HEIGHT;
        };
        window.addEventListener('resize', resize);
        resize();
    }
    initInput() {
        const handleAction = (type, start) => {
            if (this.status === 'IDLE' && start) this.start();
            else if (this.status === 'GAMEOVER' && start) this.reset();
            else if (this.status === 'PLAYING') {
                if (type === 'jump' && start) this.player.jump();
                if (type === 'accel') this.player.isAccelerating = start;
            }
        };

        window.addEventListener('keydown', (e) => {
            if (e.metaKey || e.ctrlKey) return; // 忽略截图等系统快捷键（Command/Control + Shift）

            if (e.code === 'Space') handleAction('jump', true);
            if (e.shiftKey) handleAction('accel', true);
        });
        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space') handleAction('jump', false);
            if (!e.shiftKey) handleAction('accel', false);
        });

        // Touch/Mouse Accelerate
        this.canvas.addEventListener('mousedown', (e) => handleAction('accel', true));
        this.canvas.addEventListener('mouseup', (e) => handleAction('accel', false));
        this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleAction('accel', true); });
        this.canvas.addEventListener('touchend', (e) => handleAction('accel', false));

        document.getElementById('retry-btn').onclick = () => this.reset();
    }
    start() {
        this.status = 'PLAYING';
        document.getElementById('start-screen').classList.remove('active');
        document.getElementById('ingame-ui').classList.add('active');
    }
    reset() {
        this.distance = 0;
        this.player.reset();
        this.layers = CONFIG.PARALLAX_LAYERS.map(l => new TerrainLayer(l));
        this.start();
        document.getElementById('gameover-screen').classList.remove('active');
    }
    update() {
        if (this.status === 'IDLE') {
            // Minimal update for background on start screen
            this.layers.forEach(l => l.update(1));
            return;
        }
        if (this.status !== 'PLAYING') return;

        this.distance += this.player.vx * 0.1;
        this.layers.forEach(l => l.update(this.player.vx));

        const groundY = this.layers[this.layers.length - 1].getYAt(this.player.x);
        this.player.update(groundY);

        // Update UI
        document.getElementById('score-display').innerText = `距离: ${Math.floor(this.distance)} 米`;
        const speedKmh = Math.floor(this.player.vx * 5); // Arbitrary scaling for "km/h" feel
        document.getElementById('speed-display').innerText = `速度: ${speedKmh} 公里/小时`;

        // Death logic (if falling too far below ground - rare in this variant)
        if (this.player.y > CONFIG.LOGICAL_HEIGHT + 100) {
            this.gameOver();
        }
    }
    gameOver() {
        this.status = 'GAMEOVER';
        document.getElementById('gameover-screen').classList.add('active');
        document.getElementById('final-score').innerText = `滑行距离: ${Math.floor(this.distance)} 米`;
    }
    draw() {
        // Calculate dynamic background colors
        const stage = Math.floor(this.distance / CONFIG.DISTANCE_PER_COLOR_STAGE) % CONFIG.COLOR_STAGES.length;
        const nextStage = (stage + 1) % CONFIG.COLOR_STAGES.length;
        const transition = (this.distance % CONFIG.DISTANCE_PER_COLOR_STAGE) / CONFIG.DISTANCE_PER_COLOR_STAGE;

        const currentColors = CONFIG.COLOR_STAGES[stage];
        const nextColors = CONFIG.COLOR_STAGES[nextStage];

        const topColor = Utils.interpolateColor(currentColors.top, nextColors.top, transition);
        const bottomColor = Utils.interpolateColor(currentColors.bottom, nextColors.bottom, transition);

        const grd = this.ctx.createLinearGradient(0, 0, 0, CONFIG.LOGICAL_HEIGHT);
        grd.addColorStop(0, topColor);
        grd.addColorStop(1, bottomColor);

        this.ctx.fillStyle = grd;
        this.ctx.fillRect(0, 0, CONFIG.LOGICAL_WIDTH, CONFIG.LOGICAL_HEIGHT);

        this.layers.forEach(l => l.draw(this.ctx));
        this.player.draw(this.ctx);
    }
    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

window.onload = () => new GameEngine();
