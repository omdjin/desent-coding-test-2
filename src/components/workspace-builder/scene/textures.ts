import * as THREE from "three";
import type { Wallpaper } from "@/data/products";

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

const cache = new Map<string, THREE.CanvasTexture>();

function canvasTexture(
	key: string,
	width: number,
	height: number,
	draw: Draw,
	repeat = false,
): THREE.CanvasTexture {
	const cached = cache.get(key);
	if (cached) return cached;
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("2D canvas is not available");
	draw(ctx, width, height);
	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 8;
	if (repeat) texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	cache.set(key, texture);
	return texture;
}

/** Seeded PRNG so textures look identical on every load. */
function random(seed: number) {
	return () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function shade(hex: string, factor: number) {
	const n = Number.parseInt(hex.slice(1), 16);
	const c = (v: number) => Math.min(255, Math.round(v * factor));
	return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

export function woodFloorTexture() {
	return canvasTexture(
		"wood-floor",
		1024,
		1024,
		(ctx, w, h) => {
			const r = random(7);
			const rows = 8;
			const rowH = h / rows;
			for (let row = 0; row < rows; row++) {
				const y0 = row * rowH;
				let x = -r() * 300;
				while (x < w) {
					const len = 280 + r() * 360;
					ctx.fillStyle = shade("#c9a07a", 0.95 + r() * 0.08);
					ctx.fillRect(x, y0, len, rowH);
					ctx.lineWidth = 1.2;
					for (let g = 0; g < 16; g++) {
						const y = y0 + r() * rowH;
						ctx.strokeStyle = `rgba(95,58,28,${0.05 + r() * 0.09})`;
						ctx.beginPath();
						ctx.moveTo(x, y);
						ctx.bezierCurveTo(
							x + len * 0.33,
							y + (r() - 0.5) * 8,
							x + len * 0.66,
							y + (r() - 0.5) * 8,
							x + len,
							y + (r() - 0.5) * 5,
						);
						ctx.stroke();
					}
					ctx.fillStyle = "rgba(70,40,18,0.35)";
					ctx.fillRect(x, y0, 2, rowH);
					x += len;
				}
				ctx.fillStyle = "rgba(70,40,18,0.4)";
				ctx.fillRect(0, y0, w, 2);
			}
		},
		true,
	);
}

export function juteRugTexture() {
	return canvasTexture("jute-rug", 512, 512, (ctx, w, h) => {
		const r = random(3);
		ctx.fillStyle = "#cdb58c";
		ctx.fillRect(0, 0, w, h);
		for (let y = 0; y < h; y += 6) {
			for (let x = (y / 6) % 2 === 0 ? 0 : 5; x < w; x += 10) {
				ctx.fillStyle = `rgba(120,92,52,${0.12 + r() * 0.14})`;
				ctx.fillRect(x, y, 6, 3);
			}
		}
		for (let i = 0; i < 2500; i++) {
			ctx.fillStyle = `rgba(255,245,220,${r() * 0.12})`;
			ctx.fillRect(r() * w, r() * h, 1.5, 1.5);
		}
		ctx.strokeStyle = "#a88c62";
		ctx.lineWidth = 22;
		ctx.strokeRect(11, 11, w - 22, h - 22);
	});
}

function palm(
	ctx: CanvasRenderingContext2D,
	x: number,
	base: number,
	height: number,
	lean: number,
	r: () => number,
) {
	const topX = x + lean;
	const topY = base - height;
	const ctrlX = x + lean * 0.2;
	const ctrlY = base - height * 0.55;
	ctx.strokeStyle = "#4a3b2c";
	ctx.lineCap = "round";
	const steps = 24;
	for (let i = 0; i < steps; i++) {
		const t0 = i / steps;
		const t1 = (i + 1) / steps;
		const pt = (t: number) => [
			(1 - t) ** 2 * x + 2 * (1 - t) * t * ctrlX + t ** 2 * topX,
			(1 - t) ** 2 * base + 2 * (1 - t) * t * ctrlY + t ** 2 * topY,
		];
		const [ax, ay] = pt(t0);
		const [bx, by] = pt(t1);
		ctx.lineWidth = 16 * (1 - t0) + 6;
		ctx.beginPath();
		ctx.moveTo(ax, ay);
		ctx.lineTo(bx, by);
		ctx.stroke();
	}
	for (let i = 0; i < 11; i++) {
		const angle = -Math.PI + (i / 10) * Math.PI + (r() - 0.5) * 0.3;
		const len = height * (0.34 + r() * 0.12);
		const endX = topX + Math.cos(angle) * len;
		const endY = topY + Math.sin(angle) * len * 0.45 + len * 0.35;
		const midX = topX + Math.cos(angle) * len * 0.55;
		const midY = topY + Math.sin(angle) * len * 0.5 - len * 0.12;
		ctx.fillStyle = shade("#2f5b3c", 0.85 + r() * 0.3);
		ctx.beginPath();
		ctx.moveTo(topX, topY);
		ctx.quadraticCurveTo(midX, midY - 14, endX, endY);
		ctx.quadraticCurveTo(midX, midY + 14, topX, topY);
		ctx.fill();
	}
}

export function windowViewTexture() {
	return canvasTexture("window-view", 1024, 768, (ctx, w, h) => {
		const r = random(11);
		const horizon = h * 0.6;
		const sky = ctx.createLinearGradient(0, 0, 0, horizon);
		sky.addColorStop(0, "#6fbbe6");
		sky.addColorStop(0.65, "#bfe3f3");
		sky.addColorStop(1, "#fbe8cc");
		ctx.fillStyle = sky;
		ctx.fillRect(0, 0, w, horizon);

		const sun = ctx.createRadialGradient(
			w * 0.7,
			h * 0.3,
			0,
			w * 0.7,
			h * 0.3,
			h * 0.4,
		);
		sun.addColorStop(0, "rgba(255,246,220,0.95)");
		sun.addColorStop(1, "rgba(255,246,220,0)");
		ctx.fillStyle = sun;
		ctx.fillRect(0, 0, w, h);

		const sea = ctx.createLinearGradient(0, horizon, 0, h * 0.72);
		sea.addColorStop(0, "#3f93b5");
		sea.addColorStop(1, "#8fd3da");
		ctx.fillStyle = sea;
		ctx.fillRect(0, horizon, w, h * 0.12);

		ctx.fillStyle = "#efd8a9";
		ctx.fillRect(0, h * 0.72, w, h * 0.28);

		palm(ctx, w * 0.18, h * 0.95, h * 0.78, w * 0.06, r);
		palm(ctx, w * 0.42, h * 0.98, h * 0.6, -w * 0.05, r);
		palm(ctx, w * 0.86, h * 0.96, h * 0.7, -w * 0.08, r);

		for (let i = 0; i < 14; i++) {
			ctx.fillStyle = shade("#3c6f45", 0.7 + r() * 0.45);
			ctx.beginPath();
			ctx.ellipse(
				r() * w,
				h * (0.9 + r() * 0.1),
				60 + r() * 90,
				30 + r() * 40,
				0,
				0,
				Math.PI * 2,
			);
			ctx.fill();
		}
	});
}

/** Full-size keyboard layout: 6 rows of keys plus a numpad block. */
export function keyboardTexture(body: string, key: string, legend: string) {
	return canvasTexture(`keyboard-${body}-${key}`, 1024, 320, (ctx, w, h) => {
		ctx.fillStyle = body;
		ctx.fillRect(0, 0, w, h);
		const pad = 18;
		const rows = 6;
		const unit = (h - pad * 2) / rows;
		const mainWidth = w * 0.78;
		const drawKey = (x: number, y: number, kw: number, kh: number) => {
			ctx.fillStyle = key;
			ctx.beginPath();
			ctx.roundRect(x + 3, y + 3, kw - 6, kh - 6, 7);
			ctx.fill();
			ctx.fillStyle = legend;
			ctx.fillRect(x + kw * 0.3, y + kh * 0.45, kw * 0.12, 3);
		};
		const layout = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
			[1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
			[1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.2],
			[2.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.7],
			[1.3, 1.3, 1.3, 6, 1.3, 1.3, 1, 1, 1],
		];
		layout.forEach((row, r) => {
			const total = row.reduce((a, b) => a + b, 0);
			const u = (mainWidth - pad) / total;
			let x = pad;
			for (const size of row) {
				drawKey(x, pad + r * unit, size * u, r === 0 ? unit * 0.8 : unit);
				x += size * u;
			}
		});
		const numX = mainWidth + 12;
		const numU = (w - numX - pad) / 4;
		for (let r = 1; r < rows; r++) {
			for (let c = 0; c < 4; c++)
				drawKey(numX + c * numU, pad + r * unit, numU, unit);
		}
	});
}

export function hueGradientTexture() {
	return canvasTexture("hue-gradient", 64, 512, (ctx, w, h) => {
		const g = ctx.createLinearGradient(0, 0, 0, h);
		g.addColorStop(0, "#ff4fa3");
		g.addColorStop(0.5, "#ff7a45");
		g.addColorStop(1, "#ffc15e");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, w, h);
	});
}

export function whiteboardTexture() {
	return canvasTexture("whiteboard", 512, 720, (ctx, w, h) => {
		ctx.fillStyle = "#fbfbf9";
		ctx.fillRect(0, 0, w, h);
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.fillStyle = "#15252e";
		ctx.font = "600 44px 'Comic Sans MS', 'Marker Felt', system-ui, sans-serif";
		ctx.fillText("Bali launch", 48, 96);
		ctx.strokeStyle = "#15252e";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(48, 118);
		ctx.lineTo(330, 112);
		ctx.stroke();
		const items = ["ship MVP", "surf break", "demo day"];
		ctx.font = "36px 'Comic Sans MS', 'Marker Felt', system-ui, sans-serif";
		items.forEach((item, i) => {
			const y = 200 + i * 80;
			ctx.strokeStyle = i === 1 ? "#1f7a52" : "#2563eb";
			ctx.strokeRect(56, y - 30, 30, 30);
			if (i === 0) {
				ctx.beginPath();
				ctx.moveTo(60, y - 14);
				ctx.lineTo(70, y - 4);
				ctx.lineTo(92, y - 38);
				ctx.stroke();
			}
			ctx.fillStyle = "#333";
			ctx.fillText(item, 108, y - 2);
		});
		ctx.strokeStyle = "#d7263d";
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo(90, 560);
		ctx.bezierCurveTo(180, 470, 300, 640, 420, 520);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(420, 520);
		ctx.lineTo(392, 522);
		ctx.moveTo(420, 520);
		ctx.lineTo(414, 548);
		ctx.stroke();
	});
}

type Blob = { x: number; y: number; r: number; c: string };

const WALLPAPERS: Record<Wallpaper, { bg: string; blobs: Blob[] }> = {
	sunset: {
		bg: "#1a0d0a",
		blobs: [
			{ x: 0.35, y: 0.55, r: 0.45, c: "rgba(255,110,40,0.95)" },
			{ x: 0.65, y: 0.4, r: 0.35, c: "rgba(215,38,61,0.85)" },
			{ x: 0.55, y: 0.7, r: 0.25, c: "rgba(255,196,80,0.8)" },
		],
	},
	ocean: {
		bg: "#041a2b",
		blobs: [
			{ x: 0.3, y: 0.6, r: 0.5, c: "rgba(0,140,190,0.9)" },
			{ x: 0.7, y: 0.35, r: 0.35, c: "rgba(60,220,210,0.7)" },
		],
	},
	aurora: {
		bg: "#0c0a24",
		blobs: [
			{ x: 0.3, y: 0.4, r: 0.45, c: "rgba(120,80,255,0.9)" },
			{ x: 0.7, y: 0.6, r: 0.4, c: "rgba(40,170,255,0.85)" },
			{ x: 0.5, y: 0.5, r: 0.2, c: "rgba(255,120,220,0.6)" },
		],
	},
	neon: {
		bg: "#07070c",
		blobs: [
			{ x: 0.3, y: 0.5, r: 0.35, c: "rgba(255,30,70,0.95)" },
			{ x: 0.72, y: 0.5, r: 0.35, c: "rgba(30,120,255,0.9)" },
		],
	},
	mono: {
		bg: "#15252e",
		blobs: [{ x: 0.5, y: 0.5, r: 0.5, c: "rgba(60,90,105,0.7)" }],
	},
};

export function wallpaperTexture(kind: Wallpaper) {
	return canvasTexture(`wallpaper-${kind}`, 1024, 576, (ctx, w, h) => {
		const { bg, blobs } = WALLPAPERS[kind];
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, w, h);
		ctx.globalCompositeOperation = "lighter";
		for (const b of blobs) {
			const g = ctx.createRadialGradient(
				b.x * w,
				b.y * h,
				0,
				b.x * w,
				b.y * h,
				b.r * w,
			);
			g.addColorStop(0, b.c);
			g.addColorStop(1, "rgba(0,0,0,0)");
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, w, h);
		}
		ctx.globalCompositeOperation = "source-over";
		if (kind === "mono") {
			ctx.fillStyle = "#f9f2ea";
			ctx.font = "700 150px Inter, system-ui, sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("monis", w / 2, h / 2);
		}
	});
}
