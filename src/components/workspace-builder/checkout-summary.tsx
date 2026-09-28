"use client";

import { useEffect } from "react";
import type { Product } from "@/data/products";
import {
	durationLabel,
	formatMoney,
	formatWeekly,
	quote,
	weeklyRate,
} from "@/lib/selection";

export function CheckoutSummary({
	items,
	weeks,
	confirmed,
	onClose,
	onConfirm,
}: {
	items: Product[];
	weeks: number;
	confirmed: boolean;
	onClose: () => void;
	onConfirm: () => void;
}) {
	const { perWeek, total, savings } = quote(items, weeks);
	const duration = durationLabel(weeks);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

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
				className="relative flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-xl"
			>
				{confirmed ? (
					<div className="py-6 text-center">
						<svg
							viewBox="0 0 48 48"
							className="mx-auto h-12 w-12 text-prime"
							aria-hidden="true"
						>
							<circle cx="24" cy="24" r="22" fill="currentColor" />
							<path
								d="M15 24.5l6 6 12-13"
								fill="none"
								stroke="#f9f2ea"
								strokeWidth="3.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						<h2 className="mt-4 text-lg font-semibold text-black">
							Your workspace is booked!
						</h2>
						<p className="mt-2 text-sm text-prime/70">
							We'll reach out to schedule delivery and setup in Bali.{" "}
							{formatMoney(total)} for {duration}.
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
						<p className="mt-1 text-sm text-prime/60">
							{items.length} items · rented for {duration}
						</p>
						<ul className="-mx-2 mt-4 flex flex-col gap-1 overflow-y-auto px-2">
							{items.map((item) => {
								const rate = weeklyRate(item, weeks);
								return (
									<li
										key={item.id}
										className="flex items-center justify-between gap-4 py-1.5 text-sm"
									>
										{item.decor ? (
											<span className="text-black">{item.name}</span>
										) : (
											<a
												href={`https://www.monis.rent/products/${item.id}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-black underline-offset-2 hover:underline"
											>
												{item.name}
												<span aria-hidden="true" className="ml-1 text-prime/40">
													↗
												</span>
											</a>
										)}
										<span className="shrink-0 text-prime/70">
											{rate < item.weekly && (
												<s className="mr-1.5 text-prime/35">
													{formatMoney(item.weekly)}
												</s>
											)}
											{formatWeekly(rate)}
										</span>
									</li>
								);
							})}
						</ul>
						<dl className="mt-4 flex flex-col gap-1.5 border-t border-black/10 pt-4 text-sm">
							<div className="flex justify-between text-prime/70">
								<dt>Per week</dt>
								<dd>{formatMoney(perWeek)}</dd>
							</div>
							{savings > 0 && (
								<div className="flex justify-between text-prime/70">
									<dt>Long-rental savings</dt>
									<dd>−{formatMoney(savings)}</dd>
								</div>
							)}
							<div className="flex justify-between text-base font-semibold text-black">
								<dt>Total for {duration}</dt>
								<dd>{formatMoney(total)}</dd>
							</div>
						</dl>
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
