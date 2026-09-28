import assert from "node:assert/strict";
import { test } from "node:test";
import type { Product, Slot } from "../data/products";
import { blockedReason, cardState, quote, toggleProduct } from "./selection.ts";

const item = (
	id: string,
	slot: Slot,
	weekly: number,
	weeklyLongTerm = weekly,
): Product => ({
	id,
	name: id,
	category: "gear",
	slot,
	weekly,
	weeklyLongTerm,
	model: { kind: "plant", size: "desk" },
});

const catalog = [
	item("desk-a", "desk", 7, 5),
	item("desk-b", "desk", 16, 9),
	item("chair-a", "chair", 9, 6),
	item("mon-1", "monitor", 9, 6.5),
	item("mon-2", "monitor", 21, 13),
	item("mon-3", "monitor", 23, 19),
	item("lamp", "deskLamp", 4, 3),
	item("light-bar", "lightBar", 5, 3),
	item("webcam", "webcam", 9, 6),
];
const get = (id: string) => catalog.find((p) => p.id === id) as Product;

test("desk swaps and can never be removed", () => {
	const start = ["desk-a", "chair-a"];
	assert.deepEqual(toggleProduct(start, get("desk-b"), catalog), [
		"chair-a",
		"desk-b",
	]);
	assert.deepEqual(toggleProduct(start, get("desk-a"), catalog), start);
});

test("optional items toggle on and off", () => {
	const on = toggleProduct(["desk-a"], get("lamp"), catalog);
	assert.deepEqual(on, ["desk-a", "lamp"]);
	assert.deepEqual(toggleProduct(on, get("lamp"), catalog), ["desk-a"]);
});

test("a third monitor replaces the oldest", () => {
	let sel = ["desk-a"];
	sel = toggleProduct(sel, get("mon-1"), catalog);
	sel = toggleProduct(sel, get("mon-2"), catalog);
	assert.equal(cardState(sel, get("mon-3"), catalog), "swap");
	sel = toggleProduct(sel, get("mon-3"), catalog);
	assert.deepEqual(sel, ["desk-a", "mon-2", "mon-3"]);
});

test("monitor add-ons need a monitor", () => {
	const sel = ["desk-a"];
	assert.equal(cardState(sel, get("light-bar"), catalog), "blocked");
	assert.equal(
		blockedReason(sel, get("light-bar"), catalog),
		"Needs a monitor",
	);
	assert.deepEqual(toggleProduct(sel, get("light-bar"), catalog), sel);
});

test("removing the last monitor drops its add-ons", () => {
	let sel = ["desk-a", "mon-1", "mon-2"];
	sel = toggleProduct(sel, get("light-bar"), catalog);
	sel = toggleProduct(sel, get("webcam"), catalog);
	sel = toggleProduct(sel, get("mon-1"), catalog);
	assert.deepEqual(sel, ["desk-a", "mon-2", "light-bar", "webcam"]);
	sel = toggleProduct(sel, get("mon-2"), catalog);
	assert.deepEqual(sel, ["desk-a"]);
});

test("quote switches to long-term rates from 4 weeks", () => {
	const items = [get("desk-a"), get("mon-2")];
	assert.deepEqual(quote(items, 2), { perWeek: 28, total: 56, savings: 0 });
	assert.deepEqual(quote(items, 4), { perWeek: 18, total: 72, savings: 40 });
});

test("quote keeps cents exact", () => {
	const items = [get("mon-1"), item("hub", "deskLamp", 1.5, 0.8)];
	assert.deepEqual(quote(items, 8), {
		perWeek: 7.3,
		total: 58.4,
		savings: 25.6,
	});
});
