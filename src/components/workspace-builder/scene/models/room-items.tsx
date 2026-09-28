import { RoundedBox } from "@react-three/drei";
import type { ModelSpec } from "@/data/products";
import { whiteboardTexture } from "../textures";

type PlantSpec = Extract<ModelSpec, { kind: "plant" }>;
type PowerStripSpec = Extract<ModelSpec, { kind: "powerStrip" }>;

const WHITE_PLASTIC = { color: "#f2f2f0", roughness: 0.45, metalness: 0.05 };
const GRILLE_SLATS = Array.from({ length: 14 }, (_, i) => 0.06 + i * 0.022);

/** Lies on the floor; the cable runs back (-z) to the wall socket. */
export function PowerStrip({ spec }: { spec: PowerStripSpec }) {
	const length = spec.outlets === 6 ? 0.32 : 0.2;
	const color = spec.outlets === 6 ? "#f2f2f0" : "#1d1e20";
	return (
		<group>
			<RoundedBox
				args={[length, 0.035, 0.06]}
				radius={0.01}
				position-y={0.0175}
			>
				<meshStandardMaterial color={color} roughness={0.45} />
			</RoundedBox>
			{Array.from({ length: spec.outlets }, (_, i) => {
				const x = -length / 2 + ((i + 0.5) * length) / spec.outlets;
				return (
					<mesh key={x} position={[x, 0.0355, 0]} rotation-x={-Math.PI / 2}>
						<circleGeometry args={[0.012, 16]} />
						<meshStandardMaterial color="#8f9296" roughness={0.6} />
					</mesh>
				);
			})}
			<mesh
				position={[-length / 2 - 0.1, 0.006, -0.08]}
				rotation={[Math.PI / 2, 0, 0.9]}
			>
				<cylinderGeometry args={[0.003, 0.003, 0.26, 8]} />
				<meshStandardMaterial color="#e8e8e6" roughness={0.6} />
			</mesh>
		</group>
	);
}

export function AirPurifier() {
	return (
		<group>
			<RoundedBox args={[0.26, 0.54, 0.26]} radius={0.03} position-y={0.27}>
				<meshStandardMaterial {...WHITE_PLASTIC} />
			</RoundedBox>
			<mesh position-y={0.541} rotation-x={-Math.PI / 2}>
				<circleGeometry args={[0.1, 36]} />
				<meshStandardMaterial color="#cfd1d3" roughness={0.8} />
			</mesh>
			<mesh position={[0, 0.46, 0.131]} userData={{ noShadow: true }}>
				<circleGeometry args={[0.018, 24]} />
				<meshBasicMaterial color="#1a1a1a" />
			</mesh>
			<mesh position={[0, 0.46, 0.1315]} userData={{ noShadow: true }}>
				<ringGeometry args={[0.012, 0.015, 24]} />
				<meshBasicMaterial color="#35d07f" toneMapped={false} />
			</mesh>
			{GRILLE_SLATS.map((y) => (
				<mesh key={y} position={[0, y, 0.1305]}>
					<boxGeometry args={[0.2, 0.004, 0.001]} />
					<meshStandardMaterial color="#d9dbdd" roughness={0.9} />
				</mesh>
			))}
		</group>
	);
}

export function TowerFan() {
	return (
		<group>
			<mesh position-y={0.012}>
				<cylinderGeometry args={[0.13, 0.14, 0.024, 36]} />
				<meshStandardMaterial {...WHITE_PLASTIC} />
			</mesh>
			<RoundedBox
				args={[0.12, 0.92, 0.12]}
				radius={0.05}
				smoothness={6}
				position-y={0.5}
			>
				<meshStandardMaterial {...WHITE_PLASTIC} />
			</RoundedBox>
			<mesh position={[0, 0.48, 0.0605]}>
				<planeGeometry args={[0.05, 0.68]} />
				<meshStandardMaterial color="#c9ccd0" roughness={0.9} />
			</mesh>
		</group>
	);
}

/** Folded-down walking pad, long axis along z. */
export function WalkingPad() {
	return (
		<group>
			<RoundedBox args={[0.55, 0.09, 1.3]} radius={0.03} position-y={0.045}>
				<meshStandardMaterial color="#3a3c40" roughness={0.5} metalness={0.3} />
			</RoundedBox>
			<mesh position={[0, 0.0905, 0.08]} rotation-x={-Math.PI / 2}>
				<planeGeometry args={[0.45, 1.05]} />
				<meshStandardMaterial color="#1c1d1f" roughness={0.95} />
			</mesh>
			<RoundedBox
				args={[0.55, 0.11, 0.16]}
				radius={0.03}
				position={[0, 0.055, -0.6]}
			>
				<meshStandardMaterial
					color="#2a2b2e"
					roughness={0.45}
					metalness={0.3}
				/>
			</RoundedBox>
		</group>
	);
}

/** Small side cabinet with a Nespresso Essenza Mini and a cup on top. */
export function CoffeeStation() {
	const top = 0.72;
	return (
		<group>
			<RoundedBox args={[0.6, top, 0.4]} radius={0.01} position-y={top / 2}>
				<meshStandardMaterial color="#a67c52" roughness={0.6} />
			</RoundedBox>
			{[0.2, 0.46].map((y) => (
				<mesh key={y} position={[0, y, 0.201]}>
					<boxGeometry args={[0.56, 0.004, 0.001]} />
					<meshStandardMaterial color="#6e4f33" />
				</mesh>
			))}
			<group position={[-0.08, top, 0]}>
				<RoundedBox args={[0.085, 0.2, 0.3]} radius={0.02} position-y={0.1}>
					<meshStandardMaterial
						color="#b3171d"
						roughness={0.35}
						metalness={0.1}
					/>
				</RoundedBox>
				<RoundedBox
					args={[0.087, 0.06, 0.22]}
					radius={0.015}
					position={[0, 0.17, -0.03]}
				>
					<meshStandardMaterial color="#1a1a1a" roughness={0.3} />
				</RoundedBox>
				<mesh position={[0, 0.012, 0.13]}>
					<boxGeometry args={[0.08, 0.02, 0.07]} />
					<meshStandardMaterial color="#1a1a1a" roughness={0.4} />
				</mesh>
				<mesh position={[0, 0.045, 0.13]}>
					<cylinderGeometry args={[0.025, 0.02, 0.05, 20]} />
					<meshStandardMaterial color="#f7f4ef" roughness={0.3} />
				</mesh>
			</group>
			<mesh position={[0.15, top + 0.04, 0.05]}>
				<cylinderGeometry args={[0.035, 0.03, 0.08, 20]} />
				<meshStandardMaterial color="#15252e" roughness={0.4} />
			</mesh>
		</group>
	);
}

/** Flip-chart easel, board facing +z. */
export function Whiteboard() {
	const legMat = { color: "#2a2b2e", metalness: 0.6, roughness: 0.35 };
	return (
		<group>
			{[-0.28, 0.28].map((x) => (
				<mesh
					key={x}
					position={[x, 0.85, 0.02]}
					rotation-z={x > 0 ? -0.08 : 0.08}
				>
					<cylinderGeometry args={[0.01, 0.01, 1.7, 8]} />
					<meshStandardMaterial {...legMat} />
				</mesh>
			))}
			<mesh position={[0, 0.8, -0.28]} rotation-x={-0.35}>
				<cylinderGeometry args={[0.01, 0.01, 1.62, 8]} />
				<meshStandardMaterial {...legMat} />
			</mesh>
			<group position={[0, 1.25, 0.03]} rotation-x={-0.08}>
				<RoundedBox args={[0.7, 1.0, 0.02]} radius={0.006}>
					<meshStandardMaterial
						color="#b8bcc1"
						metalness={0.6}
						roughness={0.35}
					/>
				</RoundedBox>
				<mesh position-z={0.0105}>
					<planeGeometry args={[0.66, 0.96]} />
					<meshStandardMaterial map={whiteboardTexture()} roughness={0.35} />
				</mesh>
				<mesh position={[0, -0.52, 0.03]}>
					<boxGeometry args={[0.66, 0.02, 0.05]} />
					<meshStandardMaterial {...legMat} />
				</mesh>
			</group>
		</group>
	);
}

const LEAVES = [
	{ angle: 0.2, tilt: 0.5, reach: 0.12, lift: 0.26, color: "#2f6b3f" },
	{ angle: 1.3, tilt: 0.7, reach: 0.14, lift: 0.2, color: "#3b7d4b" },
	{ angle: 2.4, tilt: 0.6, reach: 0.11, lift: 0.3, color: "#285c37" },
	{ angle: 3.3, tilt: 0.8, reach: 0.15, lift: 0.18, color: "#35744a" },
	{ angle: 4.2, tilt: 0.55, reach: 0.12, lift: 0.27, color: "#2f6b3f" },
	{ angle: 5.2, tilt: 0.75, reach: 0.14, lift: 0.21, color: "#3f8550" },
	{ angle: 5.9, tilt: 0.35, reach: 0.06, lift: 0.34, color: "#2a6139" },
];

/** Monstera in a ceramic pot. Desk size is ~35cm tall; floor size ~1m. */
export function Plant({ spec }: { spec: PlantSpec }) {
	return (
		<group scale={spec.size === "floor" ? 2.1 : 1}>
			<mesh position-y={0.06}>
				<cylinderGeometry args={[0.07, 0.055, 0.12, 28]} />
				<meshStandardMaterial color="#efe7da" roughness={0.6} />
			</mesh>
			<mesh position-y={0.118}>
				<cylinderGeometry args={[0.064, 0.064, 0.006, 24]} />
				<meshStandardMaterial color="#4a3526" roughness={1} />
			</mesh>
			{LEAVES.map((leaf) => {
				const x = Math.cos(leaf.angle) * leaf.reach;
				const z = Math.sin(leaf.angle) * leaf.reach;
				const stemLength = Math.hypot(leaf.reach, leaf.lift);
				return (
					<group key={leaf.angle}>
						<mesh
							position={[x / 2, 0.12 + leaf.lift / 2, z / 2]}
							rotation={[
								Math.atan2(z, leaf.lift),
								0,
								-Math.atan2(x, leaf.lift),
							]}
						>
							<cylinderGeometry args={[0.003, 0.004, stemLength, 6]} />
							<meshStandardMaterial color="#3d6b35" roughness={0.8} />
						</mesh>
						<mesh
							position={[x, 0.12 + leaf.lift, z]}
							rotation={[
								leaf.tilt * Math.sin(leaf.angle),
								-leaf.angle,
								leaf.tilt * Math.cos(leaf.angle),
							]}
							scale={[0.095, 0.012, 0.07]}
						>
							<sphereGeometry args={[1, 18, 10]} />
							<meshStandardMaterial color={leaf.color} roughness={0.55} />
						</mesh>
					</group>
				);
			})}
		</group>
	);
}
