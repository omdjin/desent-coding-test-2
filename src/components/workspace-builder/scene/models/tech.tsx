import { RoundedBox } from "@react-three/drei";
import type { ModelSpec } from "@/data/products";
import { keyboardTexture, wallpaperTexture } from "../textures";

type Spec<K extends ModelSpec["kind"]> = Extract<ModelSpec, { kind: K }>;

const GHOST = {
	color: "#9aa0a6",
	transparent: true,
	opacity: 0.35,
	roughness: 0.6,
	depthWrite: false,
};

/** Open laptop, hinge at the back edge, screen facing +z. */
export function Laptop({
	spec,
	ghost = false,
}: {
	spec: Spec<"laptop">;
	ghost?: boolean;
}) {
	const mac = spec.variant === "macbook";
	const shell = ghost
		? GHOST
		: mac
			? { color: "#d6d8dc", metalness: 0.8, roughness: 0.3 }
			: { color: "#26272a", metalness: 0.3, roughness: 0.5 };
	const [w, d] = mac ? [0.3, 0.21] : [0.35, 0.235];
	const screenH = d * 0.92;

	return (
		<group>
			<RoundedBox args={[w, 0.012, d]} radius={0.004} position-y={0.006}>
				<meshStandardMaterial {...shell} />
			</RoundedBox>
			{!ghost && (
				<mesh
					rotation-x={-Math.PI / 2}
					position={[0, 0.0122, -d * 0.12]}
					userData={{ noShadow: true }}
				>
					<planeGeometry args={[w * 0.86, d * 0.4]} />
					<meshStandardMaterial
						map={keyboardTexture(
							mac ? "#c3c5c9" : "#1d1e20",
							"#161618",
							"#55565a",
						)}
						roughness={0.6}
					/>
				</mesh>
			)}
			<group position={[0, 0.012, -d / 2]} rotation-x={-0.3}>
				<RoundedBox
					args={[w, screenH + 0.012, 0.006]}
					radius={0.003}
					position={[0, (screenH + 0.012) / 2, -0.003]}
				>
					<meshStandardMaterial {...shell} />
				</RoundedBox>
				{!ghost && (
					<mesh
						position={[0, (screenH + 0.012) / 2, 0.0005]}
						userData={{ noShadow: true }}
					>
						<planeGeometry args={[w * 0.94, screenH * 0.92]} />
						<meshBasicMaterial
							map={wallpaperTexture(mac ? "aurora" : "ocean")}
							toneMapped={false}
						/>
					</mesh>
				)}
			</group>
		</group>
	);
}

export function MacMini() {
	return (
		<group>
			<RoundedBox args={[0.127, 0.05, 0.127]} radius={0.014} position-y={0.025}>
				<meshStandardMaterial
					color="#d0d2d6"
					metalness={0.85}
					roughness={0.28}
				/>
			</RoundedBox>
			{[-0.022, -0.006].map((x) => (
				<mesh key={x} position={[x, 0.026, 0.0636]}>
					<boxGeometry args={[0.009, 0.004, 0.001]} />
					<meshStandardMaterial color="#222" />
				</mesh>
			))}
			<mesh position={[0.045, 0.026, 0.0637]} userData={{ noShadow: true }}>
				<circleGeometry args={[0.0015, 10]} />
				<meshBasicMaterial color="#e8fff0" toneMapped={false} />
			</mesh>
		</group>
	);
}

/** Over-ear headphones hanging from a small hook, band at the top. */
export function Headphones() {
	const mat = { color: "#34363a", roughness: 0.55, metalness: 0.2 };
	return (
		<group>
			<mesh position={[0, 0.012, 0]}>
				<boxGeometry args={[0.02, 0.012, 0.05]} />
				<meshStandardMaterial color="#1b1c1e" metalness={0.5} roughness={0.4} />
			</mesh>
			<group position-y={-0.075}>
				<mesh rotation-y={Math.PI / 2}>
					<torusGeometry args={[0.08, 0.009, 12, 32, Math.PI]} />
					<meshStandardMaterial {...mat} />
				</mesh>
				{[-1, 1].map((side) => (
					<mesh
						key={side}
						position={[0, -0.02, side * 0.08]}
						rotation-x={Math.PI / 2}
					>
						<cylinderGeometry args={[0.042, 0.042, 0.03, 28]} />
						<meshStandardMaterial {...mat} />
					</mesh>
				))}
			</group>
		</group>
	);
}

/** Podcast mic on a mini tripod, tilted towards the chair (+z). */
export function Mic() {
	const black = { color: "#141416", roughness: 0.45, metalness: 0.3 };
	return (
		<group>
			{[0, 2.1, 4.2].map((angle) => (
				<mesh
					key={angle}
					position={[Math.sin(angle) * 0.04, 0.035, Math.cos(angle) * 0.04]}
					rotation={[Math.cos(angle) * 0.9, 0, -Math.sin(angle) * 0.9]}
				>
					<cylinderGeometry args={[0.004, 0.004, 0.1, 8]} />
					<meshStandardMaterial {...black} />
				</mesh>
			))}
			<mesh position-y={0.1}>
				<cylinderGeometry args={[0.007, 0.007, 0.1, 10]} />
				<meshStandardMaterial {...black} />
			</mesh>
			<group position-y={0.18} rotation-x={0.6}>
				<mesh>
					<cylinderGeometry args={[0.028, 0.026, 0.13, 24]} />
					<meshStandardMaterial {...black} />
				</mesh>
				<mesh position-y={0.065}>
					<sphereGeometry args={[0.03, 20, 12]} />
					<meshStandardMaterial color="#202124" roughness={0.95} />
				</mesh>
			</group>
		</group>
	);
}

export function HomePod() {
	return (
		<group>
			<mesh position-y={0.085}>
				<cylinderGeometry args={[0.068, 0.068, 0.13, 36]} />
				<meshStandardMaterial color="#1e1f24" roughness={1} />
			</mesh>
			<mesh position-y={0.15} scale={[1, 0.3, 1]}>
				<sphereGeometry
					args={[0.068, 36, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
				/>
				<meshStandardMaterial color="#1e1f24" roughness={1} />
			</mesh>
			<mesh
				position-y={0.1705}
				rotation-x={-Math.PI / 2}
				userData={{ noShadow: true }}
			>
				<circleGeometry args={[0.035, 32]} />
				<meshBasicMaterial color="#7a5cff" toneMapped={false} />
			</mesh>
			<mesh position-y={0.02} scale={[1, 0.3, 1]}>
				<sphereGeometry
					args={[0.068, 36, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}
				/>
				<meshStandardMaterial color="#1e1f24" roughness={1} />
			</mesh>
		</group>
	);
}
