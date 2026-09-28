"use client";

import {
	ContactShadows,
	Environment,
	Lightformer,
	OrbitControls,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
	type ComponentRef,
	type RefObject,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type * as THREE from "three";
import type { Product } from "@/data/products";
import { formatWeekly, weeklyRate } from "@/lib/selection";
import {
	layoutScene,
	type Placement,
	SIT_HEIGHT,
	STAND_HEIGHT,
	type Vec3,
} from "./layout";
import { type ModelContext, ProductModel } from "./models";
import { PlacedItem } from "./placed-item";
import { Room } from "./room";

const BACKGROUND = "#f1ebe2";
const CAMERA_START: Vec3 = [1.3, 1.95, 3.3];
const CAMERA_TARGET: Vec3 = [0, 0.8, -0.05];

export function WorkspaceScene({
	items,
	standing,
	weeks,
	resetKey,
	onPick,
}: {
	items: Product[];
	standing: boolean;
	/** Rental length, so hover tags show the rate that will actually be charged. */
	weeks: number;
	/** Bump to snap the camera back to its starting view. */
	resetKey: number;
	onPick: (product: Product) => void;
}) {
	const layout = useMemo(() => layoutScene(items, standing), [items, standing]);
	const deskHeight = useRef(standing ? STAND_HEIGHT : SIT_HEIGHT);
	const surface = useRef<THREE.Group>(null);
	const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
	const [hoveredId, setHoveredId] = useState<string | null>(null);
	const context: ModelContext = { deskHeight, hasLaptop: layout.hasLaptop };

	useEffect(() => {
		const orbit = controls.current;
		if (!resetKey || !orbit) return;
		// With damping on, leftover drag momentum would drift the camera straight
		// back, so flush it with damping off before snapping to the start pose.
		orbit.enableDamping = false;
		orbit.update();
		orbit.object.position.set(...CAMERA_START);
		orbit.target.set(...CAMERA_TARGET);
		orbit.update();
		orbit.enableDamping = true;
	}, [resetKey]);

	const renderItem = ({ product, position, rotationY, tilt }: Placement) => (
		<PlacedItem
			key={product.id}
			position={position}
			rotationY={rotationY}
			tilt={tilt}
			tag={{
				name: product.name,
				price: formatWeekly(weeklyRate(product, weeks)),
			}}
			hovered={hoveredId === product.id}
			onHover={(hovering) =>
				setHoveredId((current) =>
					hovering ? product.id : current === product.id ? null : current,
				)
			}
			onPick={() => onPick(product)}
		>
			<ProductModel spec={product.model} context={context} />
		</PlacedItem>
	);

	return (
		<Canvas
			shadows
			dpr={[1, 2]}
			frameloop="demand"
			camera={{ position: CAMERA_START, fov: 38 }}
			aria-label="3D preview of your workspace"
			onPointerMissed={() => setHoveredId(null)}
		>
			<color attach="background" args={[BACKGROUND]} />
			<fog attach="fog" args={[BACKGROUND, 8, 16]} />

			<hemisphereLight args={["#fff8ef", "#d8c3a5", 1.25]} />
			<directionalLight
				position={[-6.5, 4.2, 1.3]}
				intensity={3.2}
				color="#ffe1b5"
				castShadow
				shadow-mapSize={[2048, 2048]}
				shadow-bias={-0.0004}
				shadow-normalBias={0.03}
				shadow-camera-left={-4}
				shadow-camera-right={4}
				shadow-camera-top={4}
				shadow-camera-bottom={-4}
				shadow-camera-near={1}
				shadow-camera-far={16}
			/>
			<directionalLight position={[3, 3, 4]} intensity={0.8} />

			<Environment resolution={256} frames={1} environmentIntensity={0.55}>
				<Lightformer
					form="rect"
					intensity={3}
					color="#fff1dc"
					position={[-4, 2, 1]}
					rotation-y={Math.PI / 2}
					scale={[3, 2, 1]}
				/>
				<Lightformer
					form="rect"
					intensity={1}
					position={[0, 4, 1]}
					rotation-x={Math.PI / 2}
					scale={[6, 6, 1]}
				/>
				<Lightformer
					form="rect"
					intensity={0.6}
					color="#e8f0ff"
					position={[4, 1.5, 3]}
					rotation-y={-Math.PI / 2}
					scale={[4, 2, 1]}
				/>
			</Environment>

			<Room />
			<ContactShadows
				position={[0, 0.005, 0.2]}
				scale={7}
				resolution={512}
				blur={2.2}
				far={1.6}
				opacity={0.45}
				color="#3b2a1a"
			/>

			<DeskHeightDriver
				target={standing ? STAND_HEIGHT : SIT_HEIGHT}
				height={deskHeight}
				surface={surface}
			/>
			{layout.floor.map(renderItem)}
			<group ref={surface} position={[0, deskHeight.current, layout.desk.z]}>
				{layout.onDesk.map(renderItem)}
			</group>

			<OrbitControls
				ref={controls}
				makeDefault
				target={CAMERA_TARGET}
				enablePan={false}
				enableDamping
				minDistance={2.2}
				maxDistance={5.5}
				minPolarAngle={0.85}
				maxPolarAngle={1.45}
				minAzimuthAngle={-0.3}
				maxAzimuthAngle={0.95}
			/>
		</Canvas>
	);
}

/** Eases the shared desk height towards sitting/standing and lifts the desktop items with it. */
function DeskHeightDriver({
	target,
	height,
	surface,
}: {
	target: number;
	height: RefObject<number>;
	surface: RefObject<THREE.Group | null>;
}) {
	const invalidate = useThree((state) => state.invalidate);

	// Wake the on-demand render loop so the frame loop below can start easing.
	useEffect(() => {
		if (height.current !== target) invalidate();
	}, [target, height, invalidate]);

	useFrame((_, rawDelta) => {
		const dt = Math.min(rawDelta, 1 / 30);
		const current = height.current;
		const next = current + (target - current) * (1 - Math.exp(-5 * dt));
		height.current = Math.abs(target - next) < 1e-4 ? target : next;
		if (surface.current) surface.current.position.y = height.current;
		if (height.current !== target) invalidate();
	});

	return null;
}
