import { RoundedBox } from "@react-three/drei";
import type { ModelSpec } from "@/data/products";

type ChairSpec = Extract<ModelSpec, { kind: "chair" }>;

const LEG_ANGLES = [0, 1, 2, 3, 4].map((i) => (i / 5) * Math.PI * 2);

/** Office chair facing -z (towards the desk). */
export function Chair({ spec }: { spec: ChairSpec }) {
	const { fabric, frame, headrest } = spec;
	const frameMat = { color: frame, metalness: 0.55, roughness: 0.4 };
	const fabricMat = { color: fabric, roughness: 0.92 };

	return (
		<group>
			{LEG_ANGLES.map((angle) => (
				<group key={angle} rotation-y={angle}>
					<mesh position={[0, 0.075, 0.16]} rotation-x={0.12}>
						<boxGeometry args={[0.045, 0.028, 0.32]} />
						<meshStandardMaterial {...frameMat} />
					</mesh>
					<mesh position={[0, 0.028, 0.31]}>
						<sphereGeometry args={[0.028, 14, 10]} />
						<meshStandardMaterial color="#161616" roughness={0.6} />
					</mesh>
				</group>
			))}
			<mesh position={[0, 0.1, 0]}>
				<cylinderGeometry args={[0.045, 0.06, 0.06, 20]} />
				<meshStandardMaterial {...frameMat} />
			</mesh>
			<mesh position={[0, 0.27, 0]}>
				<cylinderGeometry args={[0.022, 0.022, 0.3, 16]} />
				<meshStandardMaterial color="#c8c8c8" metalness={0.9} roughness={0.2} />
			</mesh>
			<mesh position={[0, 0.43, 0]}>
				<boxGeometry args={[0.22, 0.04, 0.24]} />
				<meshStandardMaterial color="#1a1a1a" roughness={0.6} />
			</mesh>

			<RoundedBox
				args={[0.5, 0.075, 0.48]}
				radius={0.03}
				smoothness={4}
				position={[0, 0.48, 0]}
			>
				<meshStandardMaterial {...fabricMat} />
			</RoundedBox>

			<mesh position={[0, 0.6, 0.26]} rotation-x={-0.12}>
				<boxGeometry args={[0.06, 0.3, 0.03]} />
				<meshStandardMaterial {...frameMat} />
			</mesh>
			<group position={[0, 0.86, 0.3]} rotation-x={-0.14}>
				<RoundedBox args={[0.47, 0.57, 0.03]} radius={0.014}>
					<meshStandardMaterial {...frameMat} />
				</RoundedBox>
				<RoundedBox
					args={[0.42, 0.52, 0.036]}
					radius={0.014}
					position-z={-0.006}
				>
					<meshStandardMaterial {...fabricMat} />
				</RoundedBox>
				<RoundedBox
					args={[0.36, 0.1, 0.04]}
					radius={0.02}
					position={[0, -0.12, -0.02]}
				>
					<meshStandardMaterial {...fabricMat} />
				</RoundedBox>
			</group>

			{headrest && (
				<group position={[0, 1.22, 0.37]} rotation-x={-0.22}>
					<RoundedBox args={[0.28, 0.12, 0.05]} radius={0.02}>
						<meshStandardMaterial {...fabricMat} />
					</RoundedBox>
					<mesh position={[0, -0.1, 0.012]}>
						<boxGeometry args={[0.03, 0.12, 0.02]} />
						<meshStandardMaterial {...frameMat} />
					</mesh>
				</group>
			)}

			{[-1, 1].map((side) => (
				<group key={side} position-x={side * 0.27}>
					<mesh position={[0, 0.57, 0.04]}>
						<boxGeometry args={[0.03, 0.18, 0.04]} />
						<meshStandardMaterial {...frameMat} />
					</mesh>
					<RoundedBox
						args={[0.07, 0.03, 0.25]}
						radius={0.012}
						position={[0, 0.67, 0.01]}
					>
						<meshStandardMaterial color="#1c1c1c" roughness={0.7} />
					</RoundedBox>
				</group>
			))}
		</group>
	);
}
