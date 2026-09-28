import type { ModelSpec } from "@/data/products";

type PlantSpec = Extract<ModelSpec, { kind: "plant" }>;

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
		<group scale={spec.size === "floor" ? 2.8 : 1}>
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
