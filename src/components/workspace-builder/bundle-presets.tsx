import { type Bundle, bundles } from "@/data/bundles";
import { products } from "@/data/products";
import { formatMoney, quote } from "@/lib/selection";

function sameItems(a: string[], b: string[]) {
	return a.length === b.length && a.every((id) => b.includes(id));
}

export function BundlePresets({
	selectedIds,
	weeks,
	onApply,
}: {
	selectedIds: string[];
	weeks: number;
	onApply: (bundle: Bundle) => void;
}) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
			<p className="shrink-0 text-sm font-medium text-prime">
				Start from a monis bundle
			</p>
			<div className="flex flex-wrap gap-2">
				{bundles.map((bundle) => {
					const items = products.filter((p) =>
						bundle.productIds.includes(p.id),
					);
					const active = sameItems(selectedIds, bundle.productIds);
					return (
						<button
							key={bundle.id}
							type="button"
							title={bundle.tagline}
							aria-pressed={active}
							onClick={() => onApply(bundle)}
							className={`flex items-baseline gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
								active
									? "border-prime bg-prime text-prime-foreground"
									: "border-black/10 bg-white text-prime hover:border-prime/40 hover:bg-cream"
							}`}
						>
							<span className="font-medium">{bundle.name}</span>
							<span
								className={
									active ? "text-xs opacity-75" : "text-xs text-prime/55"
								}
							>
								{formatMoney(quote(items, weeks).perWeek)}/wk
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
