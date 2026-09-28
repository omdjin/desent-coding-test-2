"use client";

import {
	ContactShadows,
	Environment,
	Lightformer,
	OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import type { Product } from "@/data/products";
import { layoutScene, SIT_HEIGHT } from "./layout";
import { ProductModel } from "./models";
import { PlacedItem } from "./placed-item";
import { Room } from "./room";

const BACKGROUND = "#f1ebe2";

export function WorkspaceScene({ items }: { items: Product[] }) {
	const layout = useMemo(() => layoutScene(items), [items]);
	const deskHeight = SIT_HEIGHT;
	const context = { deskHeight, hasLaptop: layout.hasLaptop };

	return (
		<Canvas
			shadows
			dpr={[1, 2]}
			frameloop="demand"
			camera={{ position: [1.3, 1.95, 3.3], fov: 38 }}
			aria-label="3D preview of your workspace"
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

			{layout.floor.map(({ product, position, rotationY }) => (
				<PlacedItem key={product.id} position={position} rotationY={rotationY}>
					<ProductModel spec={product.model} context={context} />
				</PlacedItem>
			))}
			<group position={[0, deskHeight, layout.desk.z]}>
				{layout.onDesk.map(({ product, position, rotationY, tilt }) => (
					<PlacedItem
						key={product.id}
						position={position}
						rotationY={rotationY}
						tilt={tilt}
					>
						<ProductModel spec={product.model} context={context} />
					</PlacedItem>
				))}
			</group>

			<OrbitControls
				makeDefault
				target={[0, 0.8, -0.05]}
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
