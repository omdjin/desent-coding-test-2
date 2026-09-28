"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
	CATEGORIES,
	type Category,
	type Product,
	products,
} from "@/data/products";
import {
	blockedReason,
	cardState,
	quote,
	toggleProduct,
} from "@/lib/selection";
import { CheckoutSummary } from "./checkout-summary";
import { ProductPanel } from "./product-panel";

const WorkspaceScene = dynamic(
	() => import("./scene/workspace-scene").then((m) => m.WorkspaceScene),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-full items-center justify-center text-sm text-prime/50">
				Setting up your room…
			</div>
		),
	},
);

const categories = CATEGORIES.filter((c) =>
	products.some((p) => p.category === c.key),
);

const defaultSelection = ["desk", "chair"].flatMap((slot) => {
	const first = products.find((p) => p.slot === slot);
	return first ? [first.id] : [];
});

export function WorkspaceBuilder() {
	const [selectedIds, setSelectedIds] = useState(defaultSelection);
	const [activeCategory, setActiveCategory] = useState<Category>("desks");
	const [checkoutOpen, setCheckoutOpen] = useState(false);
	const [confirmed, setConfirmed] = useState(false);

	// Selection order drives the scene (newest monitor lands on the right);
	// catalog order keeps the checkout list grouped.
	const selected = useMemo(
		() =>
			selectedIds.flatMap((id) => {
				const product = products.find((p) => p.id === id);
				return product ? [product] : [];
			}),
		[selectedIds],
	);
	const checkoutItems = products.filter((p) => selectedIds.includes(p.id));
	const { perWeek } = quote(selected, 1);

	function handleToggle(product: Product) {
		setSelectedIds((prev) => toggleProduct(prev, product, products));
	}

	function closeCheckout() {
		setCheckoutOpen(false);
		setConfirmed(false);
	}

	return (
		<div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-32">
			<div className="grid gap-6 lg:grid-cols-[340px_1fr]">
				<ProductPanel
					categories={categories}
					activeCategory={activeCategory}
					onCategoryChange={setActiveCategory}
					products={products.filter((p) => p.category === activeCategory)}
					stateOf={(p) => cardState(selectedIds, p, products)}
					reasonOf={(p) => blockedReason(selectedIds, p, products)}
					onToggle={handleToggle}
				/>

				<div className="relative h-[420px] overflow-hidden rounded-2xl border border-black/10 bg-[#f1ebe2] sm:h-[540px]">
					<WorkspaceScene items={selected} />
					<p className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-xs text-prime/70 shadow-sm backdrop-blur">
						Drag to look around · scroll to zoom
					</p>
				</div>
			</div>

			<div className="flex items-center justify-between rounded-full border border-black/10 bg-white px-6 py-4 shadow-sm">
				<div>
					<p className="text-sm font-semibold text-black">Ready to rent?</p>
					<p className="text-xs text-prime/60">
						{selected.length} items · ${perWeek}/week
					</p>
				</div>
				<button
					type="button"
					onClick={() => setCheckoutOpen(true)}
					className="rounded-full bg-prime px-5 py-2.5 text-sm font-medium text-prime-foreground transition-opacity hover:opacity-90"
				>
					Rent your setup
				</button>
			</div>

			{checkoutOpen && (
				<CheckoutSummary
					items={checkoutItems}
					total={perWeek}
					confirmed={confirmed}
					onClose={closeCheckout}
					onConfirm={() => setConfirmed(true)}
				/>
			)}
		</div>
	);
}
