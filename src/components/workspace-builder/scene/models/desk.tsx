import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { type RefObject, useRef } from "react";
import type * as THREE from "three";
import type { ModelSpec } from "@/data/products";

type DeskSpec = Extract<ModelSpec, { kind: "desk" }>;

const TOP_THICKNESS = 0.028;
const LOWER_COLUMN = 0.44;
const COLUMN_OVERLAP = 0.04;

/** Height-adjustable desk. The desktop and telescoping columns follow `height` every frame. */
export function Desk({
	spec,
	height,
}: {
	spec: DeskSpec;
	height: RefObject<number>;
}) {
	const { width, depth, top, frame, column, legs } = spec;
	const legX = width / 2 - 0.13;
	const metal = { color: frame, metalness: 0.45, roughness: 0.45 };
	const columnMetal = { color: column, metalness: 0.7, roughness: 0.32 };

	const desktop = useRef<THREE.Group>(null);
	const uppers = useRef<(THREE.Mesh | null)[]>([]);

	useFrame(() => {
		const h = height.current;
		if (desktop.current) desktop.current.position.y = h;
		const length = h - TOP_THICKNESS - LOWER_COLUMN + COLUMN_OVERLAP;
		for (const upper of uppers.current) {
			if (!upper) continue;
			upper.scale.y = length;
			upper.position.y = LOWER_COLUMN - COLUMN_OVERLAP + length / 2;
		}
	});

	return (
		<group>
			<group ref={desktop} position-y={height.current}>
				<RoundedBox
					args={[width, TOP_THICKNESS, depth]}
					radius={0.01}
					smoothness={3}
					position-y={-TOP_THICKNESS / 2}
				>
					<meshStandardMaterial color={top} roughness={0.5} />
				</RoundedBox>
				<mesh position={[0, -TOP_THICKNESS - 0.025, -0.02]}>
					<boxGeometry args={[width - 0.24, 0.04, 0.05]} />
					<meshStandardMaterial {...metal} />
				</mesh>
				{[-legX, legX].map((x) => (
					<mesh key={x} position={[x, -TOP_THICKNESS - 0.01, 0]}>
						<boxGeometry args={[0.07, 0.02, depth * 0.78]} />
						<meshStandardMaterial {...metal} />
					</mesh>
				))}
				{legs === "dual" ? (
					<group
						position={[
							width / 2 - 0.28,
							-TOP_THICKNESS - 0.015,
							depth / 2 - 0.035,
						]}
					>
						<RoundedBox args={[0.12, 0.022, 0.05]} radius={0.006}>
							<meshStandardMaterial color="#111" roughness={0.4} />
						</RoundedBox>
						<mesh
							position={[-0.03, -0.004, 0.026]}
							userData={{ noShadow: true }}
						>
							<planeGeometry args={[0.03, 0.008]} />
							<meshBasicMaterial color="#6cf0ff" toneMapped={false} />
						</mesh>
					</group>
				) : (
					<group
						position={[
							width / 2 - 0.2,
							-TOP_THICKNESS - 0.03,
							depth / 2 - 0.05,
						]}
					>
						<mesh rotation-x={Math.PI / 2}>
							<cylinderGeometry args={[0.012, 0.012, 0.1, 12]} />
							<meshStandardMaterial {...metal} />
						</mesh>
						<mesh position={[0, -0.05, 0.05]}>
							<boxGeometry args={[0.014, 0.1, 0.014]} />
							<meshStandardMaterial {...metal} />
						</mesh>
					</group>
				)}
			</group>

			{[-legX, legX].map((x, i) => (
				<group key={x} position-x={x}>
					<RoundedBox
						args={[0.065, 0.035, depth * 0.9]}
						radius={0.012}
						position-y={0.0175}
					>
						<meshStandardMaterial {...metal} />
					</RoundedBox>
					<mesh position-y={0.035 + LOWER_COLUMN / 2}>
						<boxGeometry args={[0.078, LOWER_COLUMN, 0.058]} />
						<meshStandardMaterial {...columnMetal} />
					</mesh>
					<mesh
						ref={(mesh) => {
							uppers.current[i] = mesh;
						}}
					>
						<boxGeometry args={[0.064, 1, 0.046]} />
						<meshStandardMaterial {...columnMetal} roughness={0.25} />
					</mesh>
				</group>
			))}
		</group>
	);
}
