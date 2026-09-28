"use client";

import { useState } from "react";
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
import { ScenePreview } from "./scene-preview";

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
	const selected = selectedIds.flatMap((id) => {
		const product = products.find((p) => p.id === id);
		return product ? [product] : [];
	});
	const checkoutItems = products.filter((p) => selectedIds.includes(p.id));
	const { perWeek } = quote(selected, 1);

	function handleToggle(product: Product) {
		setSelectedIds((prev) => toggleProduct(prev, product, products));
	}

	function closeCheckout() {
		setCheckoutOpen(false);
		setConfirmed(false);
	}

	const bySlot = (slot: Product["slot"]) =>
		selected.filter((p) => p.slot === slot);

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

				<div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-black/10 bg-cream/40 p-6">
					<ScenePreview
						desk={bySlot("desk")[0]}
						chair={bySlot("chair")[0]}
						monitors={bySlot("monitor")}
						lamp={bySlot("deskLamp")[0]}
						plant={bySlot("plant")[0]}
					/>
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
