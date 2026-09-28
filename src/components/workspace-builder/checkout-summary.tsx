"use client";

import type { Product } from "@/data/products";

export function CheckoutSummary({
	items,
	total,
	confirmed,
	onClose,
	onConfirm,
}: {
	items: Product[];
	total: number;
	confirmed: boolean;
	onClose: () => void;
	onConfirm: () => void;
}) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
			<button
				type="button"
				aria-label="Close checkout"
				onClick={onClose}
				className="absolute inset-0 bg-black/40"
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Your setup"
				className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
			>
				{confirmed ? (
					<div className="py-6 text-center">
						<p className="text-3xl">🎉</p>
						<h2 className="mt-3 text-lg font-semibold text-black">
							Your workspace is booked!
						</h2>
						<p className="mt-2 text-sm text-prime/70">
							We'll reach out to schedule delivery in Bali. Total: ${total}
							/week.
						</p>
						<button
							type="button"
							onClick={onClose}
							className="mt-5 rounded-full bg-prime px-5 py-2.5 text-sm font-medium text-prime-foreground"
						>
							Close
						</button>
					</div>
				) : (
					<>
						<h2 className="text-lg font-semibold text-black">Your setup</h2>
						<ul className="mt-4 flex flex-col gap-3">
							{items.map((item) => (
								<li
									key={item.id}
									className="flex items-center justify-between text-sm"
								>
									<span className="text-black">{item.name}</span>
									<span className="text-prime/70">
										${item.pricePerWeek}/week
									</span>
								</li>
							))}
						</ul>
						<div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4 text-sm font-semibold text-black">
							<span>Total</span>
							<span>${total}/week</span>
						</div>
						<div className="mt-6 flex gap-3">
							<button
								type="button"
								onClick={onClose}
								className="flex-1 rounded-full border border-black/10 px-4 py-2.5 text-sm font-medium text-black"
							>
								Keep editing
							</button>
							<button
								type="button"
								onClick={onConfirm}
								className="flex-1 rounded-full bg-prime px-4 py-2.5 text-sm font-medium text-prime-foreground"
							>
								Confirm rental
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
