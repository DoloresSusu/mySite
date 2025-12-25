const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Helper function for rounded rectangles (Cross-browser compatible)
function drawRoundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

// --- Configuration ---
const CONFIG = {
    WIDTH: 600,
    HEIGHT: 700,
    GRID_SIZE: 9,
    TILE_SIZE: 60,
    MARGIN: 30,
    get OFFSET_X() { return (this.WIDTH - (this.GRID_SIZE * this.TILE_SIZE)) / 2; },
    get OFFSET_Y() { return 150; },
    ANIMATION_TIME: 0.5,
    FADE_TIME: 0.4
};

// --- Colors ---
const COLORS = {
    background: [15, 12, 41], // Deep Blue
    grid_bg: 'rgba(24, 20, 50, 0.6)',
    selection: '#00f2fe',
    text: '#ffffff',
    ui_accent: '#ffd93d'
};

// --- Assets ---
const CHARACTERS = [
    { name: "Judy", color: "rgb(120, 140, 255)", symbol: "🐰", img_file: "judy.png" },
    { name: "Nick", color: "rgb(255, 107, 107)", symbol: "🦊", img_file: "nick.png" },
    { name: "Flash", color: "rgb(199, 236, 238)", symbol: "🦥", img_file: "flash.png" },
    { name: "Bogo", color: "rgb(72, 84, 96)", symbol: "🐃", img_file: "bogo.png" },
    { name: "Clawhauser", color: "rgb(255, 190, 118)", symbol: "🐆", img_file: "clawhauser.png" }
];

const ASSETS = {
    images: {},
    sounds: {}
};

// Load Assets
function loadAssets() {
    CHARACTERS.forEach(char => {
        const img = new Image();
        img.src = `assets/characters/${char.img_file}`;
        ASSETS.images[char.name] = img;
    });

    ASSETS.images.score_icon = new Image();
    ASSETS.images.score_icon.src = 'assets/ui/score_icon.png'; // Assuming this existed in original

    ASSETS.sounds.match = new Audio('assets/sounds/match.wav');
}

// --- Classes ---

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.life = 1.0;
        this.color = color;
    }

    update(dt) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= dt * 2;
    }

    draw(ctx) {
        if (this.life > 0) {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.life * 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}

class Tile {
    constructor(row, col, charIndex) {
        this.row = row;
        this.col = col;
        this.charIndex = charIndex;

        this.x = this.getPosX(col);
        this.y = this.getPosY(row);
        this.alpha = 1.0;
        this.scale = 1.0;
        this.isMoving = false;
        this.isFading = false;
    }

    getPosX(col) { return CONFIG.OFFSET_X + col * CONFIG.TILE_SIZE; }
    getPosY(row) { return CONFIG.OFFSET_Y + row * CONFIG.TILE_SIZE; }

    update(dt) {
        const targetX = this.getPosX(this.col);
        const targetY = this.getPosY(this.row);

        const dx = targetX - this.x;
        const dy = targetY - this.y;

        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
            this.x += dx * (dt * 10);
            this.y += dy * (dt * 10);
            this.isMoving = true;
        } else {
            this.x = targetX;
            this.y = targetY;
            this.isMoving = false;
        }

        if (this.isFading) {
            this.alpha -= (1.0 / CONFIG.FADE_TIME) * dt;
            this.scale -= (1.0 / CONFIG.FADE_TIME) * dt;
            if (this.alpha < 0) this.alpha = 0;
            if (this.scale < 0) this.scale = 0;
        }
    }

    draw(ctx) {
        if (this.alpha <= 0) return;

        const char = CHARACTERS[this.charIndex];
        const size = CONFIG.TILE_SIZE * 0.9 * this.scale;
        const rectX = this.x + (CONFIG.TILE_SIZE - size) / 2;
        const rectY = this.y + (CONFIG.TILE_SIZE - size) / 2;

        ctx.save();
        ctx.globalAlpha = this.alpha;

        // Background
        ctx.fillStyle = char.color;
        this.roundRect(ctx, rectX, rectY, size, size, 12);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        drawRoundRect(ctx, rectX + 2, rectY + 2, size - 4, size / 2, 10);
        ctx.fill();

        // Character Image
        const img = ASSETS.images[char.name];
        if (img && img.complete && img.naturalWidth !== 0) {
            const imgSize = size * 0.8;
            ctx.drawImage(img, rectX + (size - imgSize) / 2, rectY + (size - imgSize) / 2, imgSize, imgSize);
        } else {
            // Fallback Emoji
            ctx.fillStyle = "#fff";
            ctx.font = `${size * 0.6}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(char.symbol, rectX + size / 2, rectY + size / 2);
        }

        ctx.restore();
    }

    roundRect(ctx, x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }
}

class Game {
    constructor() {
        this.grid = Array(CONFIG.GRID_SIZE).fill().map(() => Array(CONFIG.GRID_SIZE).fill(null));
        this.selected = null;
        this.score = 0;
        this.state = "IDLE";
        this.waitTimer = 0;
        this.particles = [];
        this.swapBackData = null;

        this.initBoard();
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Input Handling
        canvas.addEventListener('mousedown', (e) => this.handleClick(e));
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scroll
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }, { passive: false });

        this.lastTime = 0;
        requestAnimationFrame((t) => this.loop(t));
    }

    resize() {
        // Fit canvas to screen but maintain aspect ratio if needed, or just center content
        // For simplicity, let's keep internal resolution fixed and scale via CSS/Transform or just map input.
        // Actually, to make it look sharp, let's set canvas width/height to window but scale drawing?
        // Let's stick to fixed internal resolution for logical simplicity, but render scaled.

        // Strategy: Canvas has fixed width/height (CONFIG.WIDTH, CONFIG.HEIGHT)
        // CSS scales it to fit window.
        canvas.width = CONFIG.WIDTH;
        canvas.height = CONFIG.HEIGHT;

        // We need to know scaling factor for input mapping
        const rect = canvas.getBoundingClientRect();
        this.scaleX = canvas.width / rect.width;
        this.scaleY = canvas.height / rect.height;
    }

    handleClick(e) {
        if (this.state !== "IDLE") return;

        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);

        const col = Math.floor((mx - CONFIG.OFFSET_X) / CONFIG.TILE_SIZE);
        const row = Math.floor((my - CONFIG.OFFSET_Y) / CONFIG.TILE_SIZE);

        if (row >= 0 && row < CONFIG.GRID_SIZE && col >= 0 && col < CONFIG.GRID_SIZE) {
            if (this.selected) {
                const [r1, c1] = this.selected;
                if ((Math.abs(r1 - row) === 1 && c1 === col) || (Math.abs(c1 - col) === 1 && r1 === row)) {
                    this.swapTiles(r1, c1, row, col);
                    this.selected = null;
                } else {
                    this.selected = [row, col];
                }
            } else {
                this.selected = [row, col];
            }
        }
    }

    initBoard() {
        for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
            for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
                let charIdx;
                do {
                    charIdx = Math.floor(Math.random() * CHARACTERS.length);
                } while (this.wouldMatch(r, c, charIdx));
                this.grid[r][c] = new Tile(r, c, charIdx);
            }
        }
    }

    wouldMatch(r, c, charIdx) {
        if (c >= 2 &&
            this.grid[r][c - 1] && this.grid[r][c - 1].charIndex === charIdx &&
            this.grid[r][c - 2] && this.grid[r][c - 2].charIndex === charIdx) return true;

        if (r >= 2 &&
            this.grid[r - 1][c] && this.grid[r - 1][c].charIndex === charIdx &&
            this.grid[r - 2][c] && this.grid[r - 2][c].charIndex === charIdx) return true;

        return false;
    }

    getMatches() {
        const matches = new Set();
        // Horizontal
        for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
            for (let c = 0; c < CONFIG.GRID_SIZE - 2; c++) {
                if (!this.grid[r][c] || !this.grid[r][c + 1] || !this.grid[r][c + 2]) continue;
                const idx = this.grid[r][c].charIndex;
                if (idx === this.grid[r][c + 1].charIndex && idx === this.grid[r][c + 2].charIndex) {
                    matches.add(`${r},${c}`);
                    matches.add(`${r},${c + 1}`);
                    matches.add(`${r},${c + 2}`);
                }
            }
        }
        // Vertical
        for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
            for (let r = 0; r < CONFIG.GRID_SIZE - 2; r++) {
                if (!this.grid[r][c] || !this.grid[r + 1][c] || !this.grid[r + 2][c]) continue;
                const idx = this.grid[r][c].charIndex;
                if (idx === this.grid[r + 1][c].charIndex && idx === this.grid[r + 2][c].charIndex) {
                    matches.add(`${r},${c}`);
                    matches.add(`${r + 1},${c}`);
                    matches.add(`${r + 2},${c}`);
                }
            }
        }
        return Array.from(matches).map(s => {
            const [r, c] = s.split(',').map(Number);
            return { r, c };
        });
    }

    swapTiles(r1, c1, r2, c2, rollback = true) {
        const t1 = this.grid[r1][c1];
        const t2 = this.grid[r2][c2];

        // Swap in grid
        this.grid[r1][c1] = t2;
        this.grid[r2][c2] = t1;

        // Update tile data
        if (t1) { t1.row = r2; t1.col = c2; }
        if (t2) { t2.row = r1; t2.col = c1; }

        if (rollback) {
            if (this.getMatches().length === 0) {
                this.state = "ROLLBACK";
                this.waitTimer = CONFIG.ANIMATION_TIME;
                this.swapBackData = [r1, c1, r2, c2];
            } else {
                this.state = "MATCHING";
                this.waitTimer = CONFIG.ANIMATION_TIME;
            }
        } else {
            this.state = "MATCHING";
            this.waitTimer = CONFIG.ANIMATION_TIME;
        }
    }

    applyGravity() {
        let moved = false;
        for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
            let emptySpots = [];
            for (let r = CONFIG.GRID_SIZE - 1; r >= 0; r--) {
                if (this.grid[r][c] === null) {
                    emptySpots.push(r);
                } else if (emptySpots.length > 0) {
                    const targetR = emptySpots.shift();
                    this.grid[targetR][c] = this.grid[r][c];
                    this.grid[targetR][c].row = targetR;
                    this.grid[r][c] = null;
                    emptySpots.push(r);
                    moved = true;
                }
            }
        }
        return moved;
    }

    refillTop() {
        let refilled = false;
        for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
            if (this.grid[0][c] === null) {
                const charIdx = Math.floor(Math.random() * CHARACTERS.length);
                const newTile = new Tile(-1, c, charIdx);
                newTile.row = 0;
                this.grid[0][c] = newTile;
                refilled = true;
            }
        }
        return refilled;
    }

    update(dt) {
        // Update tiles
        for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
            for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
                if (this.grid[r][c]) this.grid[r][c].update(dt);
            }
        }

        if (this.waitTimer > 0) {
            this.waitTimer -= dt;
            return;
        }

        if (this.state === "ROLLBACK") {
            const [r1, c1, r2, c2] = this.swapBackData;
            this.swapTiles(r1, c1, r2, c2, false);
            this.state = "IDLE";

        } else if (this.state === "MATCHING") {
            const matches = this.getMatches();
            if (matches.length > 0) {
                this.score += matches.length * 10;
                try { ASSETS.sounds.match.currentTime = 0; ASSETS.sounds.match.play(); } catch (e) { }

                matches.forEach(({ r, c }) => {
                    const tile = this.grid[r][c];
                    if (tile) {
                        tile.isFading = true;
                        // Add particles
                        for (let i = 0; i < 5; i++) {
                            const char = CHARACTERS[tile.charIndex];
                            this.particles.push(new Particle(tile.x + CONFIG.TILE_SIZE / 2, tile.y + CONFIG.TILE_SIZE / 2, char.color));
                        }
                    }
                });
                this.state = "FADING";
                this.waitTimer = CONFIG.FADE_TIME;
            } else {
                this.state = "IDLE";
            }

        } else if (this.state === "FADING") {
            for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
                for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
                    if (this.grid[r][c] && this.grid[r][c].alpha <= 0) {
                        this.grid[r][c] = null;
                    }
                }
            }
            this.state = "FALLING";

        } else if (this.state === "FALLING") {
            if (this.applyGravity()) {
                this.waitTimer = 0.2;
            } else {
                this.state = "REFILLING";
            }

        } else if (this.state === "REFILLING") {
            if (this.refillTop()) {
                this.state = "FALLING";
                this.waitTimer = 0.1;
            } else {
                if (this.getMatches().length > 0) {
                    this.state = "MATCHING";
                } else {
                    this.state = "IDLE";
                }
            }
        }
    }

    draw() {
        // Clear
        ctx.fillStyle = `rgb(${COLORS.background[0]}, ${COLORS.background[1]}, ${COLORS.background[2]})`;
        ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Background Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.HEIGHT);
        gradient.addColorStop(0, '#0f0c29');
        gradient.addColorStop(1, '#302b63');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Header
        ctx.font = 'bold 40px "Fredoka One", cursive';
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillText("ZOOTOPIA MATCH 3", CONFIG.WIDTH / 2 + 2, 53); // Shadow
        ctx.fillStyle = COLORS.ui_accent;
        ctx.textAlign = 'center';
        ctx.fillText("ZOOTOPIA MATCH 3", CONFIG.WIDTH / 2, 50);

        // Score Pill
        const pillW = 220, pillH = 50, pillX = CONFIG.WIDTH / 2 - pillW / 2, pillY = 75;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        drawRoundRect(ctx, pillX, pillY, pillW, pillH, 25);
        ctx.fill();

        // Score Icon & Text
        const iconSize = 40;
        if (ASSETS.images.score_icon && ASSETS.images.score_icon.complete) {
            ctx.drawImage(ASSETS.images.score_icon, pillX + 10, pillY + 5, iconSize, iconSize);
        } else {
            // Fallback
            ctx.fillStyle = "gold";
            ctx.beginPath();
            ctx.arc(pillX + 30, pillY + 25, 15, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = COLORS.text;
        ctx.font = 'bold 28px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.score, pillX + 60, pillY + pillH / 2);

        // Grid Background
        ctx.fillStyle = COLORS.grid_bg;
        drawRoundRect(ctx, CONFIG.OFFSET_X - 10, CONFIG.OFFSET_Y - 10,
            CONFIG.GRID_SIZE * CONFIG.TILE_SIZE + 20,
            CONFIG.GRID_SIZE * CONFIG.TILE_SIZE + 20, 15);
        ctx.fill();

        // Tiles
        for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
            for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
                if (this.grid[r][c]) this.grid[r][c].draw(ctx);
            }
        }

        // Selection
        if (this.selected && this.state === "IDLE") {
            const [r, c] = this.selected;
            const x = CONFIG.OFFSET_X + c * CONFIG.TILE_SIZE;
            const y = CONFIG.OFFSET_Y + r * CONFIG.TILE_SIZE;
            const pulse = (Math.sin(Date.now() / 100) + 1) / 2;
            const glowSize = 4 + pulse * 4;

            ctx.strokeStyle = COLORS.selection;
            ctx.lineWidth = 3;
            drawRoundRect(ctx, x - glowSize / 2, y - glowSize / 2, CONFIG.TILE_SIZE + glowSize, CONFIG.TILE_SIZE + glowSize, 12);
            ctx.stroke();
        }

        // Particles
        this.particles.forEach((p, index) => {
            p.update(1 / 60);
            p.draw(ctx);
            if (p.life <= 0) this.particles.splice(index, 1);
        });
    }

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt > 0.1 ? 0.1 : dt); // Cap dt
        this.draw();
        requestAnimationFrame((t) => this.loop(t));
    }
}

// Start
loadAssets();
const game = new Game();
