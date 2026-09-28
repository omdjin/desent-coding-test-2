import { RoundedBox } from "@react-three/drei";
import type { ModelSpec } from "@/data/products";
import { LAPTOP_STAND } from "../layout";
import { hueGradientTexture, keyboardTexture } from "../textures";
import { Laptop } from "./tech";

type Spec<K extends ModelSpec["kind"]> = Extract<ModelSpec, { kind: K }>;

const ALUMINIUM = { color: "#c9ccd1", metalness: 0.85, roughness: 0.28 };
const GRAPHITE = { color: "#2f3034", roughness: 0.55, metalness: 0.15 };
const BLACK_METAL = { color: "#1b1c1e", metalness: 0.6, roughness: 0.35 };

export function DeskLamp({ spec }: { spec: Spec<"deskLamp"> }) {
	return spec.variant === "hue" ? <HueLamp /> : <BarLamp />;
}

/** Xiaomi-style bar lamp: base on the left, light bar reaching over +x. */
function BarLamp() {
	const white = { color: "#ecebe8", roughness: 0.35, metalness: 0.1 };
	return (
		<group>
			<mesh position-y={0.008}>
				<cylinderGeometry args={[0.075, 0.08, 0.016, 36]} />
				<meshStandardMaterial {...white} />
			</mesh>
			<mesh position-y={0.23}>
				<cylinderGeometry args={[0.009, 0.009, 0.44, 12]} />
				<meshStandardMaterial {...white} />
			</mesh>
			<group position-y={0.45} rotation-z={-0.06}>
				<RoundedBox
					args={[0.42, 0.018, 0.034]}
					radius={0.008}
					position-x={0.19}
				>
					<meshStandardMaterial {...white} />
				</RoundedBox>
				<mesh
					position={[0.2, -0.0095, 0]}
					rotation-x={Math.PI / 2}
					userData={{ noShadow: true }}
				>
					<planeGeometry args={[0.34, 0.018]} />
					<meshBasicMaterial color="#fff4dc" toneMapped={false} />
				</mesh>
				<pointLight
					position={[0.22, -0.08, 0]}
					intensity={0.9}
					distance={1.2}
					decay={2}
					color="#ffe2b8"
				/>
			</group>
		</group>
	);
}

/** Philips Hue Signe table lamp: a slim gradient light bar on a round foot. */
function HueLamp() {
	return (
		<group>
			<mesh position-y={0.006}>
				<cylinderGeometry args={[0.06, 0.065, 0.012, 32]} />
				<meshStandardMaterial {...BLACK_METAL} />
			</mesh>
			<mesh position={[0, 0.3, -0.006]}>
				<boxGeometry args={[0.018, 0.58, 0.012]} />
				<meshStandardMaterial {...BLACK_METAL} />
			</mesh>
			<mesh position={[0, 0.3, 0.001]} userData={{ noShadow: true }}>
				<boxGeometry args={[0.014, 0.56, 0.006]} />
				<meshBasicMaterial map={hueGradientTexture()} toneMapped={false} />
			</mesh>
			<pointLight
				position={[0, 0.35, 0.12]}
				intensity={0.8}
				distance={1.1}
				decay={2}
				color="#ff8a6b"
			/>
		</group>
	);
}

export function Keyboard({ spec }: { spec: Spec<"keyboard"> }) {
	const magic = spec.variant === "magic";
	const body = magic ? "#2a2a2c" : "#35363a";
	const keys = keyboardTexture(
		body,
		magic ? "#0f0f10" : "#46474c",
		magic ? "#5a5a5e" : "#8a8b90",
	);
	const [w, d] = magic ? [0.418, 0.114] : [0.43, 0.132];
	return (
		<group rotation-x={magic ? 0.03 : 0.05}>
			<RoundedBox
				args={[w, magic ? 0.008 : 0.02, d]}
				radius={magic ? 0.003 : 0.006}
				position-y={magic ? 0.006 : 0.012}
			>
				<meshStandardMaterial color={body} roughness={0.5} metalness={0.2} />
			</RoundedBox>
			<mesh
				rotation-x={-Math.PI / 2}
				position-y={magic ? 0.0105 : 0.0225}
				userData={{ noShadow: true }}
			>
				<planeGeometry args={[w * 0.97, d * 0.92]} />
				<meshStandardMaterial map={keys} roughness={0.6} />
			</mesh>
		</group>
	);
}

export function Mouse({ spec }: { spec: Spec<"mouse"> }) {
	if (spec.variant === "magic") {
		return (
			<group>
				<mesh position-y={0.006} scale={[0.029, 0.006, 0.057]}>
					<sphereGeometry args={[1, 24, 12]} />
					<meshStandardMaterial color="#e8e8ea" roughness={0.3} />
				</mesh>
				<mesh position-y={0.01} scale={[0.028, 0.009, 0.056]}>
					<sphereGeometry args={[1, 24, 12]} />
					<meshStandardMaterial color="#111113" roughness={0.2} />
				</mesh>
			</group>
		);
	}
	return (
		<group rotation-y={-0.15}>
			<mesh position-y={0.02} scale={[0.042, 0.024, 0.062]} rotation-z={-0.18}>
				<sphereGeometry args={[1, 28, 16]} />
				<meshStandardMaterial {...GRAPHITE} />
			</mesh>
			<mesh position={[-0.004, 0.043, -0.02]} rotation-x={Math.PI / 2}>
				<cylinderGeometry args={[0.006, 0.006, 0.012, 14]} />
				<meshStandardMaterial color="#8d8f94" metalness={0.8} roughness={0.3} />
			</mesh>
		</group>
	);
}

export function MousePad() {
	return (
		<RoundedBox args={[0.32, 0.003, 0.27]} radius={0.0015} position-y={0.0015}>
			<meshStandardMaterial color="#151517" roughness={0.95} />
		</RoundedBox>
	);
}

/** Z-shaped aluminium laptop riser. Shows a ghost laptop when none is rented. */
export function LaptopStand({ hasLaptop }: { hasLaptop: boolean }) {
	return (
		<group>
			<RoundedBox args={[0.24, 0.008, 0.22]} radius={0.003} position-y={0.004}>
				<meshStandardMaterial {...BLACK_METAL} />
			</RoundedBox>
			{[-0.1, 0.1].map((x) => (
				<group key={x} position-x={x}>
					<mesh position={[0, 0.06, 0.05]} rotation-x={-0.9}>
						<boxGeometry args={[0.018, 0.16, 0.01]} />
						<meshStandardMaterial {...BLACK_METAL} />
					</mesh>
					<mesh position={[0, 0.13, 0]} rotation-x={0.9}>
						<boxGeometry args={[0.018, 0.12, 0.01]} />
						<meshStandardMaterial {...BLACK_METAL} />
					</mesh>
				</group>
			))}
			<group
				position-y={LAPTOP_STAND.top - 0.004}
				rotation-x={LAPTOP_STAND.tilt}
			>
				<RoundedBox args={[0.26, 0.006, 0.22]} radius={0.003}>
					<meshStandardMaterial {...BLACK_METAL} />
				</RoundedBox>
				{!hasLaptop && (
					<group position-y={0.004}>
						<Laptop spec={{ kind: "laptop", variant: "macbook" }} ghost />
					</group>
				)}
			</group>
		</group>
	);
}

/** Clamps over the top of a monitor; lights the desk in front of it. */
export function LightBar() {
	return (
		<group>
			<mesh position={[0, 0.02, 0.035]} rotation-z={Math.PI / 2}>
				<cylinderGeometry args={[0.012, 0.012, 0.45, 20]} />
				<meshStandardMaterial {...BLACK_METAL} />
			</mesh>
			<mesh
				position={[0, 0.007, 0.042]}
				rotation-x={Math.PI / 2 + 0.5}
				userData={{ noShadow: true }}
			>
				<planeGeometry args={[0.42, 0.008]} />
				<meshBasicMaterial color="#fff6e4" toneMapped={false} />
			</mesh>
			<mesh position={[0, 0.005, -0.005]}>
				<boxGeometry args={[0.05, 0.03, 0.06]} />
				<meshStandardMaterial {...BLACK_METAL} />
			</mesh>
			<mesh position={[0, -0.025, -0.03]}>
				<boxGeometry args={[0.05, 0.06, 0.015]} />
				<meshStandardMaterial {...BLACK_METAL} />
			</mesh>
			<spotLight
				position={[0, 0, 0.05]}
				angle={0.9}
				penumbra={0.8}
				intensity={1.4}
				distance={1}
				color="#fff1dc"
			/>
		</group>
	);
}

export function Webcam() {
	return (
		<group>
			<RoundedBox
				args={[0.1, 0.028, 0.028]}
				radius={0.01}
				position={[0, 0.02, 0.02]}
			>
				<meshStandardMaterial color="#141416" roughness={0.4} />
			</RoundedBox>
			<mesh position={[0, 0.02, 0.0345]} rotation-x={Math.PI / 2}>
				<cylinderGeometry args={[0.009, 0.009, 0.002, 20]} />
				<meshStandardMaterial
					color="#0a0a14"
					metalness={0.9}
					roughness={0.05}
				/>
			</mesh>
			<mesh position={[0, 0.004, 0]}>
				<boxGeometry args={[0.04, 0.008, 0.05]} />
				<meshStandardMaterial color="#141416" roughness={0.5} />
			</mesh>
			<mesh position={[0, -0.02, -0.022]}>
				<boxGeometry args={[0.04, 0.05, 0.008]} />
				<meshStandardMaterial color="#141416" roughness={0.5} />
			</mesh>
		</group>
	);
}

/** Black riser the primary monitor stands on. */
export function MonitorStand() {
	return (
		<group>
			<RoundedBox args={[0.34, 0.008, 0.2]} radius={0.003} position-y={0.004}>
				<meshStandardMaterial {...BLACK_METAL} />
			</RoundedBox>
			<mesh position={[0, 0.05, -0.02]}>
				<boxGeometry args={[0.14, 0.09, 0.012]} />
				<meshStandardMaterial {...BLACK_METAL} />
			</mesh>
			<RoundedBox args={[0.55, 0.012, 0.24]} radius={0.004} position-y={0.094}>
				<meshStandardMaterial
					color="#111214"
					metalness={0.3}
					roughness={0.15}
				/>
			</RoundedBox>
		</group>
	);
}

export function Hub() {
	return (
		<group>
			<RoundedBox args={[0.11, 0.012, 0.035]} radius={0.005} position-y={0.006}>
				<meshStandardMaterial {...ALUMINIUM} color="#8e9196" />
			</RoundedBox>
			<mesh position={[-0.075, 0.006, 0]} rotation-z={Math.PI / 2}>
				<cylinderGeometry args={[0.0025, 0.0025, 0.05, 8]} />
				<meshStandardMaterial color="#2b2c2f" roughness={0.6} />
			</mesh>
		</group>
	);
}
