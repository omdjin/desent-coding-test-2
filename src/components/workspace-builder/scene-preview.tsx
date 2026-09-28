import type { Product } from "@/data/products";

export function ScenePreview({
	desk,
	chair,
	monitors,
	lamp,
	plant,
}: {
	desk?: Product;
	chair?: Product;
	monitors: Product[];
	lamp?: Product;
	plant?: Product;
}) {
	const deskWidth = desk?.id === "standing-desk" ? 300 : 260;
	const deskX = 200 - deskWidth / 2;
	const deskColor = desk?.model.kind === "desk" ? desk.model.top : "#e5ded2";
	const chairColor =
		chair?.model.kind === "chair" ? chair.model.fabric : "#d9d9d9";
	const monitorSlots = [-70, 0, 70];

	return (
		<svg
			viewBox="0 0 400 260"
			className="h-full w-full max-w-lg"
			role="img"
			aria-label="Illustrated preview of the selected workspace"
		>
			{/* floor shadow */}
			<ellipse cx="200" cy="230" rx="150" ry="14" fill="#00000008" />

			{/* chair */}
			<g
				className="transition-all duration-300"
				style={{ opacity: chair ? 1 : 0.35 }}
			>
				<rect
					x="170"
					y="150"
					width="60"
					height="55"
					rx="14"
					fill={chairColor}
				/>
				<rect
					x="176"
					y="110"
					width="48"
					height="50"
					rx="12"
					fill={chairColor}
				/>
				<rect x="190" y="205" width="20" height="16" fill="#00000022" />
			</g>

			{/* desk */}
			<g className="transition-all duration-300">
				<rect
					x={deskX}
					y="150"
					width={deskWidth}
					height="14"
					rx="4"
					fill={deskColor}
				/>
				<rect x={deskX + 10} y="164" width="8" height="50" fill={deskColor} />
				<rect
					x={deskX + deskWidth - 18}
					y="164"
					width="8"
					height="50"
					fill={deskColor}
				/>
			</g>

			{/* monitors */}
			{monitorSlots.map((offset, i) => {
				const monitor = monitors[i];
				if (!monitor) return null;
				return (
					<g
						key={monitor.id}
						className="transition-all duration-300"
						transform={`translate(${200 + offset}, 100)`}
					>
						<rect x="-24" y="0" width="48" height="34" rx="3" fill="#1f2937" />
						<rect x="-6" y="34" width="12" height="10" fill="#1f2937" />
					</g>
				);
			})}

			{/* lamp */}
			{lamp && (
				<g
					className="transition-all duration-300"
					transform="translate(90, 100)"
				>
					<rect x="-3" y="30" width="6" height="24" fill="#15252e" />
					<path d="M-3 30 L-30 5 L-18 -5 L4 22 Z" fill="#f9f2ea" />
				</g>
			)}

			{/* plant */}
			{plant && (
				<g
					className="transition-all duration-300"
					transform="translate(320, 110)"
				>
					<rect x="-14" y="30" width="28" height="24" rx="3" fill="#b08968" />
					<circle cx="0" cy="10" r="22" fill="#4d7c4a" />
				</g>
			)}
		</svg>
	);
}
