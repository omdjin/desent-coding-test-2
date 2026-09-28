import type { Product } from "@/data/products";
import { ProductCard } from "./product-card";

export type PanelTab = "chairs" | "desks" | "accessories";

const TABS: { key: PanelTab; label: string }[] = [
	{ key: "chairs", label: "Chairs" },
	{ key: "desks", label: "Desks" },
	{ key: "accessories", label: "Accessories" },
];

export function ProductPanel({
	activeTab,
	onTabChange,
	products,
	selectedIds,
	onToggle,
}: {
	activeTab: PanelTab;
	onTabChange: (tab: PanelTab) => void;
	products: Product[];
	selectedIds: Set<string>;
	onToggle: (product: Product) => void;
}) {
	return (
		<div className="rounded-2xl border border-black/10 bg-white p-4">
			<div className="flex gap-2 rounded-full bg-cream p-1">
				{TABS.map((tab) => (
					<button
						key={tab.key}
						type="button"
						onClick={() => onTabChange(tab.key)}
						className={`flex-1 rounded-full px-3 py-1.5 text-center text-sm font-medium transition-colors ${
							activeTab === tab.key
								? "bg-prime text-prime-foreground"
								: "text-prime hover:bg-white/60"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div className="mt-4 grid grid-cols-2 gap-3">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						selected={selectedIds.has(product.id)}
						onSelect={() => onToggle(product)}
					/>
				))}
			</div>
		</div>
	);
}
