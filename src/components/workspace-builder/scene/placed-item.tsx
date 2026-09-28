"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import type * as THREE from "three";
import type { Vec3 } from "./layout";

const DROP_HEIGHT = 0.6;
// Under-damped spring: settles in ~0.5s with one small bounce.
const STIFFNESS = 220;
const DAMPING = 18;

export function PlacedItem({
	position,
	rotationY = 0,
	tilt = 0,
	children,
}: {
	position: Vec3;
	rotationY?: number;
	tilt?: number;
	children: ReactNode;
}) {
	const ref = useRef<THREE.Group>(null);
	const velocity = useRef({ y: 0, scale: 0 });
	const mounted = useRef(false);
	const invalidate = useThree((state) => state.invalidate);

	useLayoutEffect(() => {
		const group = ref.current;
		if (!group) return;
		if (!mounted.current) {
			group.position.set(position[0], position[1] + DROP_HEIGHT, position[2]);
			group.rotation.y = rotationY;
			group.scale.setScalar(0.85);
			mounted.current = true;
		}
		group.traverse((object) => {
			if ((object as THREE.Mesh).isMesh && !object.userData.noShadow) {
				object.castShadow = true;
				object.receiveShadow = true;
			}
		});
		invalidate();
	});

	useFrame((_, rawDelta) => {
		const group = ref.current;
		if (!group) return;
		const dt = Math.min(rawDelta, 1 / 30);
		const v = velocity.current;

		v.y += (STIFFNESS * (position[1] - group.position.y) - DAMPING * v.y) * dt;
		group.position.y += v.y * dt;
		v.scale += (STIFFNESS * (1 - group.scale.x) - DAMPING * v.scale) * dt;
		group.scale.setScalar(group.scale.x + v.scale * dt);

		const ease = 1 - Math.exp(-10 * dt);
		group.position.x += (position[0] - group.position.x) * ease;
		group.position.z += (position[2] - group.position.z) * ease;
		group.rotation.y += (rotationY - group.rotation.y) * ease;

		const settling =
			Math.abs(v.y) + Math.abs(v.scale) > 1e-3 ||
			Math.abs(position[1] - group.position.y) > 1e-4 ||
			Math.abs(position[0] - group.position.x) > 1e-4 ||
			Math.abs(position[2] - group.position.z) > 1e-4 ||
			Math.abs(rotationY - group.rotation.y) > 1e-4;
		if (settling) invalidate();
	});

	return (
		<group ref={ref}>
			<group rotation-x={tilt}>{children}</group>
		</group>
	);
}
