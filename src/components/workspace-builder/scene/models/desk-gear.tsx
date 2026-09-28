import { RoundedBox } from "@react-three/drei";
import type { ModelSpec } from "@/data/products";

type DeskLampSpec = Extract<ModelSpec, { kind: "deskLamp" }>;

/** Xiaomi-style bar lamp: base on the left, light bar reaching over +x. */
export function DeskLamp(_: { spec: DeskLampSpec }) {
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
