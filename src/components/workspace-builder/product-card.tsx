import Image from "next/image";
import type { Product } from "@/data/products";
import {
	type CardState,
	formatMoney,
	formatWeekly,
	weeklyRate,
} from "@/lib/selection";

const BADGE: Record<CardState, string> = {
	selected: "✓ Added",
	add: "+ Add",
	swap: "Swap",
	blocked: "",
};

export function ProductCard({
	product,
	state,
	reason,
	weeks,
	flash = false,
	onSelect,
}: {
	product: Product;
	state: CardState;
	reason: string | null;
	weeks: number;
	/** Briefly highlights the card after it was picked in the 3D room. */
	flash?: boolean;
	onSelect: () => void;
}) {
	const selected = state === "selected";
	const blocked = state === "blocked";
	const rate = weeklyRate(product, weeks);

	return (
		<button
			type="button"
			onClick={onSelect}
			disabled={blocked}
			aria-pressed={selected}
			data-product-id={product.id}
			className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all ${
				flash ? "animate-pulse ring-4 ring-prime/35" : ""
			} ${
				selected
					? "border-prime ring-2 ring-prime"
					: "border-black/10 hover:-translate-y-0.5 hover:border-prime/40 hover:shadow-md"
			} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none`}
		>
			<div className="relative aspect-square w-full bg-white">
				{product.image ? (
					<Image
						src={product.image}
						alt={product.name}
						fill
						sizes="(min-width: 1024px) 160px, 45vw"
						className="object-contain p-2"
					/>
				) : (
					<PlaceholderIcon />
				)}
				{!blocked && (
					<span
						className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[11px] font-medium shadow-sm ${
							selected
								? "bg-prime text-prime-foreground"
								: "bg-white/90 text-prime group-hover:bg-prime group-hover:text-prime-foreground"
						}`}
					>
						{BADGE[state]}
					</span>
				)}
			</div>
			<div className="border-t border-black/5 p-2">
				<p className="truncate text-xs font-medium text-black">
					{product.name}
				</p>
				<p className="text-xs text-prime/60">
					{blocked ? (
						reason
					) : (
						<>
							{rate < product.weekly && (
								<s className="mr-1 text-prime/35">
									{formatMoney(product.weekly)}
								</s>
							)}
							{formatWeekly(rate)}
						</>
					)}
				</p>
			</div>
		</button>
	);
}

function PlaceholderIcon() {
	return (
		<svg
			viewBox="0 0 48 48"
			className="absolute inset-0 m-auto h-12 w-12 text-prime/30"
			aria-hidden="true"
		>
			<path
				fill="currentColor"
				d="M24 6C14 10 8 18 8 28c0 6 4 12 10 14 1-9 3-15 6-20-2 7-3 13-2 20 9-1 18-8 18-20 0-7-5-13-16-16Z"
			/>
		</svg>
	);
}
