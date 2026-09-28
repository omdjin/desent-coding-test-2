import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import type * as THREE from "three";
import type { ModelSpec } from "@/data/products";
import { monitorSize } from "../layout";
import { wallpaperTexture } from "../textures";

type MonitorSpec = Extract<ModelSpec, { kind: "monitor" }>;

const BEZEL = 0.008;
const SCREEN_BOTTOM = 0.12;

/** Monitor with its screen facing +z, standing on y = 0. */
export function Monitor({ spec }: { spec: MonitorSpec }) {
	const { width, height } = monitorSize(spec);
	const texture = wallpaperTexture(spec.wallpaper);
	const centerY = SCREEN_BOTTOM + height / 2;
	const shell = { color: spec.bezel, roughness: 0.45, metalness: 0.25 };

	return (
		<group>
			<Stand stand={spec.stand} centerY={centerY} color={spec.bezel} />
			<group position-y={centerY}>
				{spec.curved ? (
					<CurvedPanel
						width={width}
						height={height}
						texture={texture}
						shell={shell}
					/>
				) : (
					<>
						<RoundedBox
							args={[width + BEZEL * 2, height + BEZEL * 2, 0.02]}
							radius={0.004}
							position-z={-0.01}
						>
							<meshStandardMaterial {...shell} />
						</RoundedBox>
						<mesh position-z={0.0006} userData={{ noShadow: true }}>
							<planeGeometry args={[width, height]} />
							<meshBasicMaterial map={texture} toneMapped={false} />
						</mesh>
						<RoundedBox
							args={[width * 0.45, height * 0.45, 0.035]}
							radius={0.01}
							position-z={-0.035}
						>
							<meshStandardMaterial {...shell} />
						</RoundedBox>
					</>
				)}
			</group>
		</group>
	);
}

function Stand({
	stand,
	centerY,
	color,
}: {
	stand: MonitorSpec["stand"];
	centerY: number;
	color: string;
}) {
	if (stand === "apple") {
		const aluminium = { color: "#c9ccd1", metalness: 0.85, roughness: 0.25 };
		return (
			<group position-z={-0.06}>
				<RoundedBox args={[0.19, 0.008, 0.2]} radius={0.003} position-y={0.004}>
					<meshStandardMaterial {...aluminium} />
				</RoundedBox>
				<mesh position={[0, centerY / 2, -0.03]} rotation-x={-0.28}>
					<boxGeometry args={[0.17, centerY * 1.02, 0.012]} />
					<meshStandardMaterial {...aluminium} />
				</mesh>
			</group>
		);
	}
	const plastic = { color, roughness: 0.5, metalness: 0.2 };
	return (
		<group position-z={-0.05}>
			{stand === "v" ? (
				<>
					<mesh position={[-0.07, 0.006, 0.03]} rotation-y={0.5}>
						<boxGeometry args={[0.04, 0.012, 0.2]} />
						<meshStandardMaterial {...plastic} />
					</mesh>
					<mesh position={[0.07, 0.006, 0.03]} rotation-y={-0.5}>
						<boxGeometry args={[0.04, 0.012, 0.2]} />
						<meshStandardMaterial {...plastic} />
					</mesh>
				</>
			) : (
				<mesh position-y={0.007}>
					<cylinderGeometry args={[0.11, 0.12, 0.014, 40]} />
					<meshStandardMaterial {...plastic} />
				</mesh>
			)}
			<mesh position-y={centerY / 2}>
				<boxGeometry args={[0.04, centerY, 0.03]} />
				<meshStandardMaterial {...plastic} />
			</mesh>
		</group>
	);
}

const CURVE_RADIUS = 1.5;
const SEGMENTS = 14;

function CurvedPanel({
	width,
	height,
	texture,
	shell,
}: {
	width: number;
	height: number;
	texture: THREE.Texture;
	shell: THREE.MeshStandardMaterialParameters;
}) {
	const theta = width / CURVE_RADIUS;
	const segmentWidth = 2 * CURVE_RADIUS * Math.sin(theta / SEGMENTS / 2);
	const segments = useMemo(
		() =>
			Array.from({ length: SEGMENTS }, (_, i) => {
				const angle = -theta / 2 + ((i + 0.5) * theta) / SEGMENTS;
				const slice = texture.clone();
				slice.repeat.set(1 / SEGMENTS, 1);
				slice.offset.set(i / SEGMENTS, 0);
				slice.needsUpdate = true;
				return { angle, slice };
			}),
		[texture, theta],
	);

	// Centre of curvature sits in front of the screen, where the viewer is.
	return (
		<>
			{segments.map(({ angle, slice }) => (
				<group
					key={angle}
					position={[
						CURVE_RADIUS * Math.sin(angle),
						0,
						CURVE_RADIUS - CURVE_RADIUS * Math.cos(angle),
					]}
					rotation-y={-angle}
				>
					<mesh position-z={-0.01}>
						<boxGeometry
							args={[segmentWidth + 0.002, height + BEZEL * 2, 0.02]}
						/>
						<meshStandardMaterial {...shell} />
					</mesh>
					<mesh position-z={0.0006} userData={{ noShadow: true }}>
						<planeGeometry args={[segmentWidth + 0.0005, height]} />
						<meshBasicMaterial map={slice} toneMapped={false} />
					</mesh>
				</group>
			))}
			<RoundedBox
				args={[width * 0.4, height * 0.45, 0.04]}
				radius={0.01}
				position-z={-0.035}
			>
				<meshStandardMaterial {...shell} />
			</RoundedBox>
		</>
	);
}
