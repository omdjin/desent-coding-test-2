"use client";

import { Html } from "@react-three/drei";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { Vec3 } from "./layout";

const DROP_HEIGHT = 0.6;
// Under-damped spring: settles in ~0.5s with one small bounce.
const STIFFNESS = 220;
const DAMPING = 18;
const HOVER_SCALE = 1.04;
/** Pointer travel (px) above which a release counts as an orbit drag, not a click. */
const CLICK_SLOP = 4;

export type ItemTag = { name: string; price: string };

export function PlacedItem({
	position,
	rotationY = 0,
	tilt = 0,
	tag,
	hovered = false,
	onHover,
	onPick,
	children,
}: {
	position: Vec3;
	rotationY?: number;
	tilt?: number;
	tag?: ItemTag;
	hovered?: boolean;
	onHover?: (hovering: boolean) => void;
	onPick?: () => void;
	children: ReactNode;
}) {
	const ref = useRef<THREE.Group>(null);
	const velocity = useRef({ y: 0, scale: 0 });
	const mounted = useRef(false);
	const [tagHeight, setTagHeight] = useState(0.3);
	const invalidate = useThree((state) => state.invalidate);
	const gl = useThree((state) => state.gl);

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
		const targetScale = hovered ? HOVER_SCALE : 1;

		v.y += (STIFFNESS * (position[1] - group.position.y) - DAMPING * v.y) * dt;
		group.position.y += v.y * dt;
		v.scale +=
			(STIFFNESS * (targetScale - group.scale.x) - DAMPING * v.scale) * dt;
		group.scale.setScalar(group.scale.x + v.scale * dt);

		const ease = 1 - Math.exp(-10 * dt);
		group.position.x += (position[0] - group.position.x) * ease;
		group.position.z += (position[2] - group.position.z) * ease;
		group.rotation.y += (rotationY - group.rotation.y) * ease;

		const settling =
			Math.abs(v.y) + Math.abs(v.scale) > 1e-3 ||
			Math.abs(targetScale - group.scale.x) > 1e-4 ||
			Math.abs(position[1] - group.position.y) > 1e-4 ||
			Math.abs(position[0] - group.position.x) > 1e-4 ||
			Math.abs(position[2] - group.position.z) > 1e-4 ||
			Math.abs(rotationY - group.rotation.y) > 1e-4;
		if (settling) invalidate();
	});

	const interactive = Boolean(tag);

	function handleOver(event: ThreeEvent<PointerEvent>) {
		event.stopPropagation();
		const group = ref.current;
		if (group) {
			// Measure once the item has settled so the tag floats just above it.
			const box = new THREE.Box3().setFromObject(group);
			setTagHeight(
				(box.max.y - group.getWorldPosition(new THREE.Vector3()).y) /
					group.scale.y,
			);
		}
		gl.domElement.style.cursor = "pointer";
		onHover?.(true);
	}

	function handleOut(event: ThreeEvent<PointerEvent>) {
		event.stopPropagation();
		gl.domElement.style.cursor = "";
		onHover?.(false);
	}

	function handleClick(event: ThreeEvent<MouseEvent>) {
		event.stopPropagation();
		if (event.delta > CLICK_SLOP) return;
		onPick?.();
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: a three.js group, not a DOM element; the product panel is the accessible control
		<group
			ref={ref}
			onPointerOver={interactive ? handleOver : undefined}
			onPointerOut={interactive ? handleOut : undefined}
			onClick={interactive ? handleClick : undefined}
		>
			<group rotation-x={tilt}>{children}</group>
			{hovered && tag && (
				<Html
					position={[0, tagHeight + 0.05, 0]}
					center
					zIndexRange={[20, 0]}
					style={{ pointerEvents: "none" }}
				>
					<div className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-prime shadow-lg ring-1 ring-black/5">
						<span className="h-1.5 w-1.5 rounded-full bg-prime" />
						{tag.name}
						<span className="text-prime/55">· {tag.price}</span>
					</div>
				</Html>
			)}
		</group>
	);
}
