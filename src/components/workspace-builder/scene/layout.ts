import type { ModelSpec, Product } from "@/data/products";

export type Vec3 = [number, number, number];

export const WALL_Z = -0.5;
export const LEFT_WALL_X = -2.1;
export const SIT_HEIGHT = 0.74;

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
};

export type SceneLayout = {
	desk: { width: number; depth: number; z: number };
	floor: Placement[];
	onDesk: Placement[];
};

export function layoutScene(items: Product[]): SceneLayout {
	const deskProduct = items.find((p) => p.slot === "desk");
	const { width, depth } =
		deskProduct?.model.kind === "desk" ? deskProduct.model : FALLBACK_DESK;
	const deskZ = WALL_Z + 0.05 + depth / 2;
	const back = -depth / 2;

	const floor: Placement[] = [];
	const onDesk: Placement[] = [];

	for (const product of items) {
		switch (product.slot) {
			case "desk":
				floor.push({ product, position: [0, 0, deskZ], rotationY: 0 });
				break;
			case "chair":
				// Pulled out and swivelled towards the camera so it doesn't hide the desk.
				floor.push({
					product,
					position: [0.42, 0, deskZ + depth / 2 + 0.5],
					rotationY: -1.2,
				});
				break;
			case "deskLamp":
				onDesk.push({
					product,
					position: [-width / 2 + 0.1, 0, 0.02],
					rotationY: -0.15,
				});
				break;
			case "plant":
				onDesk.push({
					product,
					position: [width / 2 - 0.1, 0, depth / 2 - 0.12],
					rotationY: 0,
				});
				break;
		}
	}

	onDesk.push(...placeMonitors(items, back));

	return { desk: { width, depth, z: deskZ }, floor, onDesk };
}

function placeMonitors(items: Product[], back: number): Placement[] {
	const monitors = items.filter((p) => p.model.kind === "monitor");
	const z = back + 0.17;
	if (monitors.length === 1) {
		return [{ product: monitors[0], position: [0, 0, z], rotationY: 0 }];
	}
	return monitors.slice(0, 2).map((product, i) => {
		const { width } = monitorSize(product.model as MonitorSpec);
		const side = i === 0 ? -1 : 1;
		return {
			product,
			// angled towards the chair, pushed out a little so inner edges don't clip
			position: [side * (width / 2 + 0.03), 0, z + 0.02],
			rotationY: -side * 0.22,
		};
	});
}
