import type { Product, Slot } from "../data/products";

type SlotRule = { max: number; required?: boolean; requires?: Slot };

const SLOT_RULES: Partial<Record<Slot, SlotRule>> = {
	desk: { max: 1, required: true },
	chair: { max: 1, required: true },
	monitor: { max: 2 },
	lightBar: { max: 1, requires: "monitor" },
	webcam: { max: 1, requires: "monitor" },
	monitorStand: { max: 1, requires: "monitor" },
};

const SLOT_LABELS: Partial<Record<Slot, string>> = {
	monitor: "monitor",
};

function ruleFor(slot: Slot): SlotRule {
	return SLOT_RULES[slot] ?? { max: 1 };
}

function slotsOf(selected: string[], catalog: Product[]): Slot[] {
	return selected.flatMap((id) => {
		const product = catalog.find((p) => p.id === id);
		return product ? [product.slot] : [];
	});
}

/** Why a product can't be added right now, or null if it can. */
export function blockedReason(
	selected: string[],
	product: Product,
	catalog: Product[],
): string | null {
	const needs = ruleFor(product.slot).requires;
	if (!needs || slotsOf(selected, catalog).includes(needs)) return null;
	return `Needs a ${SLOT_LABELS[needs] ?? needs}`;
}

export type CardState = "selected" | "add" | "swap" | "blocked";

export function cardState(
	selected: string[],
	product: Product,
	catalog: Product[],
): CardState {
	if (selected.includes(product.id)) return "selected";
	if (blockedReason(selected, product, catalog)) return "blocked";
	const filled = slotsOf(selected, catalog).filter(
		(slot) => slot === product.slot,
	).length;
	return filled >= ruleFor(product.slot).max ? "swap" : "add";
}

/** Drops items whose required slot (e.g. a light bar's monitor) is gone. */
function pruneOrphans(selected: string[], catalog: Product[]): string[] {
	const present = new Set(slotsOf(selected, catalog));
	return selected.filter((id) => {
		const product = catalog.find((p) => p.id === id);
		const needs = product && ruleFor(product.slot).requires;
		return !needs || present.has(needs);
	});
}

export function toggleProduct(
	selected: string[],
	product: Product,
	catalog: Product[],
): string[] {
	const rule = ruleFor(product.slot);

	if (selected.includes(product.id)) {
		if (rule.required) return selected;
		return pruneOrphans(
			selected.filter((id) => id !== product.id),
			catalog,
		);
	}

	if (blockedReason(selected, product, catalog)) return selected;

	const sameSlot = selected.filter(
		(id) => catalog.find((p) => p.id === id)?.slot === product.slot,
	);
	// Oldest items in the slot make room for the new one.
	const evicted = new Set(sameSlot.slice(0, sameSlot.length - rule.max + 1));
	return [...selected.filter((id) => !evicted.has(id)), product.id];
}

const LONG_TERM_WEEKS = 4;

/** Rental lengths offered; monis.rent counts a month as 4 weeks. */
export const DURATIONS = [
	{ weeks: 1, label: "1 week" },
	{ weeks: 2, label: "2 weeks" },
	{ weeks: 3, label: "3 weeks" },
	{ weeks: 4, label: "1 month" },
	{ weeks: 8, label: "2 months" },
	{ weeks: 12, label: "3 months" },
	{ weeks: 24, label: "6 months" },
] as const;

export function durationLabel(weeks: number): string {
	return DURATIONS.find((d) => d.weeks === weeks)?.label ?? `${weeks} weeks`;
}

export function weeklyRate(product: Product, weeks: number): number {
	return weeks >= LONG_TERM_WEEKS ? product.weeklyLongTerm : product.weekly;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

const dollars = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});
const cents = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 2,
});

/** "$21", "$6.50", "$1,188" — cents only when there are any. */
export function formatMoney(amount: number): string {
	return (Number.isInteger(amount) ? dollars : cents).format(amount);
}

export function formatWeekly(amount: number): string {
	return amount === 0 ? "Free" : `${formatMoney(amount)}/week`;
}

export function quote(items: Product[], weeks: number) {
	const perWeek = items.reduce((sum, p) => sum + weeklyRate(p, weeks), 0);
	const fullPerWeek = items.reduce((sum, p) => sum + p.weekly, 0);
	return {
		perWeek: round2(perWeek),
		total: round2(perWeek * weeks),
		savings: round2((fullPerWeek - perWeek) * weeks),
	};
}
