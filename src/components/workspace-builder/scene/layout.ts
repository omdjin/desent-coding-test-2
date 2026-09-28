import type { ModelSpec, Product, Slot } from "@/data/products";

export type Vec3 = [number, number, number];

export const WALL_Z = -0.5;
export const LEFT_WALL_X = -2.1;
export const SIT_HEIGHT = 0.74;
export const SCREEN_BOTTOM = 0.12;
export const MONITOR_BEZEL = 0.008;
export const RISER_HEIGHT = 0.1;
export const LAPTOP_STAND = { top: 0.174, tilt: 0.3 };

const FALLBACK_DESK = { width: 1.4, depth: 0.7 };

type MonitorSpec = Extract<ModelSpec, { kind: "monitor" }>;

export function monitorSize(spec: MonitorSpec) {
	const [a, b] = spec.aspect === "21:9" ? [21, 9] : [16, 9];
	const k = (spec.inches * 0.0254) / Math.hypot(a, b);
	return { width: a * k, height: b * k };
}

export type Placement = {
	product: Product;
	/** World coords for floor items; relative to the desktop centre for desk items. */
	position: Vec3;
	rotationY: number;
	/** Forward tilt, e.g. a laptop resting on an angled stand. */
	tilt?: number;
};

export type SceneLayout = {
	desk: { width: number; depth: number; z: number };
	floor: Placement[];
	onDesk: Placement[];
	hasLaptop: boolean;
};

/** Approximate footprint depth of items stacked in the desk's right column. */
const COLUMN_DEPTH: Partial<Record<Slot, number>> = {
	computer: 0.13,
	speaker: 0.14,
	mic: 0.14,
};

export function layoutScene(items: Product[]): SceneLayout {
	const bySlot = (slot: Slot) => items.filter((p) => p.slot === slot);
	const one = (slot: Slot) => bySlot(slot)[0];

	const deskProduct = one("desk");
	const { width: W, depth: D } =
		deskProduct?.model.kind === "desk" ? deskProduct.model : FALLBACK_DESK;
	const deskZ = WALL_Z + 0.05 + D / 2;
	const back = -D / 2;
	const front = D / 2;

	const floor: Placement[] = [];
	const onDesk: Placement[] = [];
	const put = (
		list: Placement[],
		product: Product | undefined,
		position: Vec3,
		rotationY = 0,
		tilt?: number,
	) => {
		if (product) list.push({ product, position, rotationY, tilt });
	};

	// Floor
	put(floor, deskProduct, [0, 0, deskZ]);
	const walkingPad = one("walkingPad");
	put(floor, walkingPad, [0, 0, deskZ + 0.32]);
	if (walkingPad) {
		put(floor, one("chair"), [W / 2 + 0.55, 0, deskZ + front + 0.15], -2.2);
	} else {
		// Pulled out and swivelled so it doesn't hide the desk.
		put(floor, one("chair"), [0.42, 0, deskZ + front + 0.5], -1.2);
	}
	put(floor, one("power"), [0.25, 0, WALL_Z + 0.12]);
	put(floor, one("airPurifier"), [-W / 2 - 0.32, 0, WALL_Z + 0.2]);
	put(floor, one("fan"), [-W / 2 - 0.4, 0, deskZ + 0.65]);
	put(floor, one("plant"), [W / 2 + 0.42, 0, WALL_Z + 0.25]);
	put(floor, one("coffee"), [W / 2 + 1.15, 0, WALL_Z + 0.21]);
	put(floor, one("whiteboard"), [W / 2 + 1.95, 0, WALL_Z + 0.4], -0.35);

	// Back of the desk: monitors and what mounts on them
	const monitors = placeMonitors(
		bySlot("monitor"),
		back,
		one("monitorStand") ? RISER_HEIGHT : 0,
	);
	onDesk.push(...monitors);
	const primary = monitors[0];
	if (primary) {
		const [x, , z] = primary.position;
		put(onDesk, one("monitorStand"), [x, 0, z + 0.01], primary.rotationY);

		const lightBar = one("lightBar");
		put(onDesk, lightBar, [x, monitorTop(primary), z], primary.rotationY);

		const camHost = monitors[1] ?? primary;
		const shift =
			camHost === primary && lightBar ? monitorWidth(primary) * 0.32 : 0;
		const r = camHost.rotationY;
		put(
			onDesk,
			one("webcam"),
			[
				camHost.position[0] + Math.cos(r) * shift,
				monitorTop(camHost),
				camHost.position[2] - Math.sin(r) * shift,
			],
			r,
		);
	}

	// Front: typing area
	const keyboardZ = front - 0.19;
	put(onDesk, one("keyboard"), [0, 0, keyboardZ]);
	const pad = one("mousePad");
	put(onDesk, pad, [0.36, 0, keyboardZ]);
	put(onDesk, one("mouse"), [0.36, pad ? 0.003 : 0, keyboardZ + 0.02]);

	// Left: laptop (on its stand if rented), hub, lamp
	const laptop = one("laptop");
	const stand = one("laptopStand");
	const spot: Vec3 = [-W / 2 + 0.2, 0, -0.02];
	const spotRotation = 0.35;
	put(onDesk, stand, spot, spotRotation);
	if (stand) {
		put(
			onDesk,
			laptop,
			[spot[0], LAPTOP_STAND.top, spot[2]],
			spotRotation,
			LAPTOP_STAND.tilt,
		);
	} else {
		put(onDesk, laptop, spot, spotRotation);
	}
	put(
		onDesk,
		one("hub"),
		laptop || stand
			? [spot[0] + 0.2, 0, spot[2] + 0.15]
			: [-0.32, 0, front - 0.1],
		0.3,
	);

	const lamp = one("deskLamp");
	if (lamp?.model.kind === "deskLamp" && lamp.model.variant === "hue") {
		put(onDesk, lamp, [-W / 2 + 0.07, 0, back + 0.07], 0.4);
	} else {
		put(onDesk, lamp, [-W / 2 + 0.08, 0, front - 0.1], 0.64);
	}

	// Right column, stacked back to front
	let cursor = back + 0.05;
	for (const slot of ["computer", "speaker", "mic"] as const) {
		const product = one(slot);
		if (!product) continue;
		const depth = COLUMN_DEPTH[slot] ?? 0.12;
		put(onDesk, product, [W / 2 - 0.1, 0, cursor + depth / 2], -0.3);
		cursor += depth + 0.03;
	}

	// Hanging off the right edge of the desktop
	put(onDesk, one("headphones"), [W / 2 + 0.03, -0.03, 0.05]);

	return {
		desk: { width: W, depth: D, z: deskZ },
		floor,
		onDesk,
		hasLaptop: Boolean(laptop),
	};
}

function monitorWidth(placement: Placement) {
	return monitorSize(placement.product.model as MonitorSpec).width;
}

function monitorTop(placement: Placement) {
	const { height } = monitorSize(placement.product.model as MonitorSpec);
	return placement.position[1] + SCREEN_BOTTOM + height + MONITOR_BEZEL;
}

function placeMonitors(
	monitors: Product[],
	back: number,
	riser: number,
): Placement[] {
	const z = back + 0.17;
	if (monitors.length === 1) {
		return [{ product: monitors[0], position: [0, riser, z], rotationY: 0 }];
	}
	return monitors.slice(0, 2).map((product, i) => {
		const { width } = monitorSize(product.model as MonitorSpec);
		const side = i === 0 ? -1 : 1;
		return {
			product,
			// angled towards the chair, pushed out a little so inner edges don't clip
			position: [side * (width / 2 + 0.03), i === 0 ? riser : 0, z + 0.02],
			rotationY: -side * 0.22,
		};
	});
}
