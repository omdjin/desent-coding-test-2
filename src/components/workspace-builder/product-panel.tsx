import type { Category, Product } from "@/data/products";
import type { CardState } from "@/lib/selection";
import { ProductCard } from "./product-card";

export function ProductPanel({
	categories,
	activeCategory,
	onCategoryChange,
	products,
	stateOf,
	reasonOf,
	onToggle,
}: {
	categories: { key: Category; label: string }[];
	activeCategory: Category;
	onCategoryChange: (category: Category) => void;
	products: Product[];
	stateOf: (product: Product) => CardState;
	reasonOf: (product: Product) => string | null;
	onToggle: (product: Product) => void;
}) {
	return (
		<div className="flex min-w-0 flex-col rounded-2xl border border-black/10 bg-white p-4 lg:h-[540px]">
			<div className="flex flex-wrap gap-2">
				{categories.map((category) => (
					<button
						key={category.key}
						type="button"
						onClick={() => onCategoryChange(category.key)}
						aria-pressed={activeCategory === category.key}
						className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
							activeCategory === category.key
								? "bg-prime text-prime-foreground"
								: "bg-cream text-prime hover:bg-cream/60"
						}`}
					>
						{category.label}
					</button>
				))}
			</div>
			<div className="-mx-1 mt-4 grid min-h-0 flex-1 auto-rows-max grid-cols-2 gap-3 overflow-y-auto px-1 pt-1 pb-2">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						state={stateOf(product)}
						reason={reasonOf(product)}
						onSelect={() => onToggle(product)}
					/>
				))}
			</div>
		</div>
	);
}
