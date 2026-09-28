import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import { LEFT_WALL_X, WALL_Z } from "./layout";
import {
	juteRugTexture,
	wallpaperTexture,
	windowViewTexture,
	woodFloorTexture,
} from "./textures";

const WALL_COLOR = "#f3ebdf";
const TRIM_COLOR = "#fbf8f3";
const ROOM_RIGHT_X = 3.4;
const ROOM_FRONT_Z = 4;
const WALL_HEIGHT = 3;
const THICKNESS = 0.1;

// Window opening in the left wall.
const WIN = { z0: 0.2, z1: 1.9, y0: 0.8, y1: 2.4 };

export function Room() {
	const floorTexture = useMemo(() => {
		const texture = woodFloorTexture();
		// planks run along x, ~20cm wide
		texture.repeat.set(7, 7.5);
		return texture;
	}, []);

	return (
		<group>
			<mesh rotation-x={-Math.PI / 2} position={[1, 0, 2.5]} receiveShadow>
				<planeGeometry args={[14, 12]} />
				<meshStandardMaterial map={floorTexture} roughness={0.72} />
			</mesh>

			<BackWall />
			<LeftWall />
			<WindowView />

			<mesh
				rotation-x={-Math.PI / 2}
				position={[0.1, 0.003, 0.55]}
				receiveShadow
			>
				<planeGeometry args={[2.3, 1.8]} />
				<meshStandardMaterial map={juteRugTexture()} roughness={1} />
			</mesh>

			<Shelf />
			<FramedPrint />
		</group>
	);
}

function BackWall() {
	const width = ROOM_RIGHT_X - LEFT_WALL_X;
	const centerX = (ROOM_RIGHT_X + LEFT_WALL_X) / 2;
	return (
		<group>
			<mesh
				position={[centerX, WALL_HEIGHT / 2, WALL_Z - THICKNESS / 2]}
				receiveShadow
			>
				<boxGeometry args={[width, WALL_HEIGHT, THICKNESS]} />
				<meshStandardMaterial color={WALL_COLOR} roughness={0.95} />
			</mesh>
			<mesh position={[centerX, 0.04, WALL_Z + 0.008]} receiveShadow>
				<boxGeometry args={[width, 0.08, 0.016]} />
				<meshStandardMaterial color={TRIM_COLOR} roughness={0.6} />
			</mesh>
		</group>
	);
}

/** Built from four pieces around the window so sunlight comes through the opening. */
function LeftWall() {
	const x = LEFT_WALL_X - THICKNESS / 2;
	const length = ROOM_FRONT_Z - WALL_Z;
	const pieces: { y: [number, number]; z: [number, number] }[] = [
		{ y: [0, WIN.y0], z: [WALL_Z, ROOM_FRONT_Z] },
		{ y: [WIN.y1, WALL_HEIGHT], z: [WALL_Z, ROOM_FRONT_Z] },
		{ y: [WIN.y0, WIN.y1], z: [WALL_Z, WIN.z0] },
		{ y: [WIN.y0, WIN.y1], z: [WIN.z1, ROOM_FRONT_Z] },
	];
	const mullionZ = (WIN.z0 + WIN.z1) / 2;
	const frame = { color: TRIM_COLOR, roughness: 0.5 };

	return (
		<group>
			{pieces.map(({ y, z }) => (
				<mesh
					key={`${y[0]}-${z[0]}`}
					position={[x, (y[0] + y[1]) / 2, (z[0] + z[1]) / 2]}
					castShadow
					receiveShadow
				>
					<boxGeometry args={[THICKNESS, y[1] - y[0], z[1] - z[0]]} />
					<meshStandardMaterial color={WALL_COLOR} roughness={0.95} />
				</mesh>
			))}
			<mesh
				position={[LEFT_WALL_X + 0.008, 0.04, (WALL_Z + ROOM_FRONT_Z) / 2]}
				receiveShadow
			>
				<boxGeometry args={[0.016, 0.08, length]} />
				<meshStandardMaterial color={TRIM_COLOR} roughness={0.6} />
			</mesh>

			<mesh position={[LEFT_WALL_X + 0.06, WIN.y0 - 0.015, mullionZ]}>
				<boxGeometry args={[0.16, 0.03, WIN.z1 - WIN.z0 + 0.1]} />
				<meshStandardMaterial {...frame} />
			</mesh>
			<mesh position={[x, WIN.y1, mullionZ]} castShadow>
				<boxGeometry args={[0.12, 0.05, WIN.z1 - WIN.z0]} />
				<meshStandardMaterial {...frame} />
			</mesh>
			{[WIN.z0, mullionZ, WIN.z1].map((z) => (
				<mesh key={z} position={[x, (WIN.y0 + WIN.y1) / 2, z]} castShadow>
					<boxGeometry args={[0.12, WIN.y1 - WIN.y0, 0.045]} />
					<meshStandardMaterial {...frame} />
				</mesh>
			))}
		</group>
	);
}

function WindowView() {
	return (
		<mesh
			position={[LEFT_WALL_X - 1.6, 1.6, (WIN.z0 + WIN.z1) / 2]}
			rotation-y={Math.PI / 2}
			userData={{ noShadow: true }}
		>
			<planeGeometry args={[6.4, 4.8]} />
			<meshBasicMaterial map={windowViewTexture()} toneMapped={false} />
		</mesh>
	);
}

function Shelf() {
	const z = WALL_Z + 0.11;
	return (
		<group position={[1.45, 1.6, z]}>
			<mesh castShadow receiveShadow>
				<boxGeometry args={[0.9, 0.03, 0.22]} />
				<meshStandardMaterial color="#a67c52" roughness={0.6} />
			</mesh>
			<mesh position={[-0.28, 0.1, 0]} castShadow>
				<cylinderGeometry args={[0.045, 0.06, 0.17, 24]} />
				<meshStandardMaterial color="#8a5a3c" roughness={0.5} />
			</mesh>
			{[
				{ x: 0.1, h: 0.2, c: "#15252e" },
				{ x: 0.135, h: 0.18, c: "#d6c3a3" },
				{ x: 0.165, h: 0.22, c: "#7a8c7a" },
			].map((book) => (
				<mesh
					key={book.x}
					position={[book.x, 0.015 + book.h / 2, 0]}
					castShadow
				>
					<boxGeometry args={[0.028, book.h, 0.15]} />
					<meshStandardMaterial color={book.c} roughness={0.8} />
				</mesh>
			))}
			<mesh position={[0.32, 0.06, 0]} castShadow>
				<sphereGeometry args={[0.05, 20, 16]} />
				<meshStandardMaterial color="#e9dfd0" roughness={0.4} />
			</mesh>
		</group>
	);
}

function FramedPrint() {
	return (
		<group position={[-1.25, 1.55, WALL_Z + 0.015]}>
			<RoundedBox args={[0.5, 0.66, 0.025]} radius={0.004} castShadow>
				<meshStandardMaterial color="#2b2b2b" roughness={0.5} />
			</RoundedBox>
			<mesh position-z={0.0135}>
				<planeGeometry args={[0.42, 0.58]} />
				<meshStandardMaterial
					map={wallpaperTexture("sunset")}
					roughness={0.8}
				/>
			</mesh>
		</group>
	);
}
