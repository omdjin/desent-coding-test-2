"use client";

import { useMemo, useState } from "react";
import { accessories, chairs, desks, type Product } from "@/data/products";
import { type PanelTab, ProductPanel } from "./product-panel";
import { ScenePreview } from "./scene-preview";

export function WorkspaceBuilder() {
	const [activeTab, setActiveTab] = useState<PanelTab>("chairs");
	const [deskId, setDeskId] = useState<string | undefined>(desks[0]?.id);
	const [chairId, setChairId] = useState<string | undefined>(chairs[0]?.id);
	const [accessoryIds, setAccessoryIds] = useState<Set<string>>(new Set());

	const desk = desks.find((d) => d.id === deskId);
	const chair = chairs.find((c) => c.id === chairId);
	const selectedAccessories = accessories.filter((a) => accessoryIds.has(a.id));
	const monitors = selectedAccessories.filter((a) => a.category === "monitor");
	const lamp = selectedAccessories.find((a) => a.category === "lamp");
	const plant = selectedAccessories.find((a) => a.category === "plant");

	const tabProducts: Record<PanelTab, Product[]> = {
		chairs,
		desks,
		accessories,
	};

	const selectedIds = useMemo(() => {
		if (activeTab === "chairs") return new Set(chairId ? [chairId] : []);
		if (activeTab === "desks") return new Set(deskId ? [deskId] : []);
		return accessoryIds;
	}, [activeTab, chairId, deskId, accessoryIds]);

	function handleToggle(product: Product) {
		if (product.category === "chair") return setChairId(product.id);
		if (product.category === "desk") return setDeskId(product.id);

		setAccessoryIds((prev) => {
			const next = new Set(prev);
			if (next.has(product.id)) next.delete(product.id);
			else next.add(product.id);
			return next;
		});
	}

	const readyToRent = Boolean(deskId && chairId);
	const total =
		(desk?.pricePerWeek ?? 0) +
		(chair?.pricePerWeek ?? 0) +
		selectedAccessories.reduce((sum, a) => sum + a.pricePerWeek, 0);

	return (
		<div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-32">
			<div className="grid gap-6 lg:grid-cols-[280px_1fr]">
				<ProductPanel
					activeTab={activeTab}
					onTabChange={setActiveTab}
					products={tabProducts[activeTab]}
					selectedIds={selectedIds}
					onToggle={handleToggle}
				/>

				<div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-black/10 bg-cream/40 p-6">
					<ScenePreview
						desk={desk}
						chair={chair}
						monitors={monitors}
						lamp={lamp}
						plant={plant}
					/>
				</div>
			</div>

			<div className="flex items-center justify-between rounded-full border border-black/10 bg-white px-6 py-4 shadow-sm">
				<div>
					<p className="text-sm font-semibold text-black">Ready to rent?</p>
					<p className="text-xs text-prime/60">
						{readyToRent
							? `Your setup is $${total}/week`
							: "Select a desk and chair to get started"}
					</p>
				</div>
				<button
					type="button"
					disabled={!readyToRent}
					className="rounded-full bg-prime px-5 py-2.5 text-sm font-medium text-prime-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
				>
					Rent your setup
				</button>
			</div>
		</div>
	);
}
