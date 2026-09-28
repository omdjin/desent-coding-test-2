import Image from "next/image";
import type { Product } from "@/data/products";

export function ProductCard({
	product,
	selected,
	onSelect,
}: {
	product: Product;
	selected: boolean;
	onSelect: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onSelect}
			aria-pressed={selected}
			className={`flex flex-col overflow-hidden rounded-xl border text-left transition-colors ${
				selected
					? "border-prime ring-2 ring-prime"
					: "border-black/10 hover:border-prime/40"
			}`}
		>
			<div className="relative aspect-square w-full bg-cream/40">
				{product.image ? (
					<Image
						src={product.image}
						alt={product.name}
						fill
						sizes="200px"
						className="object-cover"
					/>
				) : (
					<div
						className="flex h-full w-full items-center justify-center text-3xl"
						style={{ color: product.tint }}
					>
						●
					</div>
				)}
			</div>
			<div className="p-2">
				<p className="truncate text-xs font-medium text-black">
					{product.name}
				</p>
				<p className="text-xs text-prime/60">${product.pricePerWeek}/week</p>
			</div>
		</button>
	);
}
