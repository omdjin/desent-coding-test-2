"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
	CATEGORIES,
	type Category,
	type Product,
	products,
} from "@/data/products";
import {
	blockedReason,
	cardState,
	durationLabel,
	formatMoney,
	quote,
	toggleProduct,
} from "@/lib/selection";
import { BundlePresets } from "./bundle-presets";
import { CheckoutSummary } from "./checkout-summary";
import { DurationPicker } from "./duration-picker";
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
	const [standing, setStanding] = useState(false);
	const [resetKey, setResetKey] = useState(0);
	const [flashId, setFlashId] = useState<string | null>(null);
	const [weeks, setWeeks] = useState(1);

	useEffect(() => {
		if (!flashId) return;
		document
			.querySelector(`[data-product-id="${flashId}"]`)
			?.scrollIntoView({ block: "nearest", behavior: "smooth" });
		const timer = setTimeout(() => setFlashId(null), 1400);
		return () => clearTimeout(timer);
	}, [flashId]);

	/** Clicking an object in the room jumps to its card in the panel. */
	function handlePick(product: Product) {
		setActiveCategory(product.category);
		setFlashId(product.id);
	}

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
	const { perWeek, total, savings } = quote(selected, weeks);

	function handleToggle(product: Product) {
		setSelectedIds((prev) => toggleProduct(prev, product, products));
	}

	function closeCheckout() {
		setCheckoutOpen(false);
		setConfirmed(false);
	}

	return (
		<div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-32">
			<BundlePresets
				selectedIds={selectedIds}
				weeks={weeks}
				onApply={(bundle) => setSelectedIds(bundle.productIds)}
			/>
			<div className="grid gap-6 lg:grid-cols-[340px_1fr]">
				<ProductPanel
					categories={categories}
					activeCategory={activeCategory}
					onCategoryChange={setActiveCategory}
					products={products.filter((p) => p.category === activeCategory)}
					stateOf={(p) => cardState(selectedIds, p, products)}
					reasonOf={(p) => blockedReason(selectedIds, p, products)}
					flashId={flashId}
					weeks={weeks}
					onToggle={handleToggle}
				/>

				<div className="relative h-[420px] overflow-hidden rounded-2xl border border-black/10 bg-[#f1ebe2] sm:h-[540px]">
					<WorkspaceScene
						items={selected}
						standing={standing}
						weeks={weeks}
						resetKey={resetKey}
						onPick={handlePick}
					/>
					<div className="absolute top-3 right-3 flex items-center gap-2">
						<div className="flex rounded-full bg-white/90 p-1 shadow-sm backdrop-blur">
							{[
								{ label: "Sit", value: false },
								{ label: "Stand", value: true },
							].map((mode) => (
								<button
									key={mode.label}
									type="button"
									aria-pressed={standing === mode.value}
									onClick={() => setStanding(mode.value)}
									className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
										standing === mode.value
											? "bg-prime text-prime-foreground"
											: "text-prime hover:bg-cream"
									}`}
								>
									{mode.label}
								</button>
							))}
						</div>
						<button
							type="button"
							onClick={() => setResetKey((key) => key + 1)}
							className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-prime shadow-sm backdrop-blur hover:bg-white"
						>
							Reset view
						</button>
					</div>
					<p className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-xs text-prime/70 shadow-sm backdrop-blur">
						Drag to look around · hover anything to see what it is
					</p>
				</div>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-black/10 bg-white px-6 py-4 shadow-sm sm:rounded-full">
				<div>
					<p className="text-sm font-semibold text-black">Ready to rent?</p>
					<p className="text-xs text-prime/60">
						{selected.length} items · {formatMoney(perWeek)}/week
						{savings > 0 && (
							<span className="font-medium text-prime">
								{" "}
								· you save {formatMoney(savings)}
							</span>
						)}
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-4">
					<DurationPicker weeks={weeks} onChange={setWeeks} />
					<div className="text-right">
						<p className="text-lg leading-tight font-semibold text-black">
							{formatMoney(total)}
						</p>
						<p className="text-xs text-prime/60">for {durationLabel(weeks)}</p>
					</div>
					<button
						type="button"
						onClick={() => setCheckoutOpen(true)}
						className="rounded-full bg-prime px-5 py-2.5 text-sm font-medium text-prime-foreground transition-opacity hover:opacity-90"
					>
						Rent your setup
					</button>
				</div>
			</div>

			{checkoutOpen && (
				<CheckoutSummary
					items={checkoutItems}
					weeks={weeks}
					confirmed={confirmed}
					onClose={closeCheckout}
					onConfirm={() => setConfirmed(true)}
				/>
			)}
		</div>
	);
}
