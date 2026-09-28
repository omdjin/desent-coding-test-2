import { RoundedBox } from "@react-three/drei";
import type { ModelSpec } from "@/data/products";

type DeskSpec = Extract<ModelSpec, { kind: "desk" }>;

const TOP_THICKNESS = 0.028;
const LOWER_COLUMN = 0.44;

export function Desk({ spec, height }: { spec: DeskSpec; height: number }) {
	const { width, depth, top, frame, legs } = spec;
	const legX = width / 2 - 0.13;
	const underTop = height - TOP_THICKNESS;
	const upperLength = underTop - LOWER_COLUMN + 0.04;
	const metal = { color: frame, metalness: 0.45, roughness: 0.45 };

	return (
		<group>
			<RoundedBox
				args={[width, TOP_THICKNESS, depth]}
				radius={0.01}
				smoothness={3}
				position={[0, height - TOP_THICKNESS / 2, 0]}
			>
				<meshStandardMaterial color={top} roughness={0.5} />
			</RoundedBox>

			<mesh position={[0, underTop - 0.025, -0.02]}>
				<boxGeometry args={[width - 0.24, 0.04, 0.05]} />
				<meshStandardMaterial {...metal} />
			</mesh>

			{[-legX, legX].map((x) => (
				<group key={x} position-x={x}>
					<RoundedBox
						args={[0.065, 0.035, depth * 0.9]}
						radius={0.012}
						position={[0, 0.0175, 0]}
					>
						<meshStandardMaterial {...metal} />
					</RoundedBox>
					<mesh position={[0, 0.035 + LOWER_COLUMN / 2, 0]}>
						<boxGeometry args={[0.078, LOWER_COLUMN, 0.058]} />
						<meshStandardMaterial {...metal} />
					</mesh>
					<mesh
						position={[0, LOWER_COLUMN - 0.04 + upperLength / 2, 0]}
						scale-y={upperLength}
					>
						<boxGeometry args={[0.064, 1, 0.046]} />
						<meshStandardMaterial
							color={legs === "dual" ? "#9a9da1" : frame}
							metalness={0.7}
							roughness={0.3}
						/>
					</mesh>
					<mesh position={[0, underTop - 0.01, 0]}>
						<boxGeometry args={[0.07, 0.02, depth * 0.78]} />
						<meshStandardMaterial {...metal} />
					</mesh>
				</group>
			))}

			{legs === "dual" ? (
				<group
					position={[width / 2 - 0.28, underTop - 0.015, depth / 2 - 0.035]}
				>
					<RoundedBox args={[0.12, 0.022, 0.05]} radius={0.006}>
						<meshStandardMaterial color="#111" roughness={0.4} />
					</RoundedBox>
					<mesh position={[-0.03, -0.004, 0.026]} userData={{ noShadow: true }}>
						<planeGeometry args={[0.03, 0.008]} />
						<meshBasicMaterial color="#6cf0ff" toneMapped={false} />
					</mesh>
				</group>
			) : (
				<group position={[width / 2 - 0.2, underTop - 0.03, depth / 2 - 0.05]}>
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
	);
}
