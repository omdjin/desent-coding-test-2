export type Bundle = {
	/** monis.rent bundle slug — the page is /bundles/<id>. */
	id: string;
	name: string;
	tagline: string;
	productIds: string[];
};

const DESK = "electrical-adjustable-desk";
const CHAIR = "ergonomic-office-chair";

// Core items of monis.rent's bundles, in the order they're added to the room.
export const bundles: Bundle[] = [
	{
		id: "the-essentials",
		name: "The Essentials",
		tagline: "Desk, chair & power",
		productIds: [DESK, CHAIR, "international-power-strip"],
	},
	{
		id: "the-founders-setup",
		name: "The Founders Setup",
		tagline: "4K screen, laptop stand & MX combo",
		productIds: [
			DESK,
			CHAIR,
			"27-4-k-multimedia-monitor",
			"ergonomic-laptop-stand",
			"logitech-mx-keyboard",
			"logitech-mx-master-mouse-s3",
			"mouse-pad",
			"international-power-strip",
			"metal-monitor-light-bar",
		],
	},
	{
		id: "the-trading-setup",
		name: "The Trading Setup",
		tagline: '34" ultrawide & desk lamp',
		productIds: [
			DESK,
			CHAIR,
			"34-4-k-curved-monitor-180-hz",
			"logitech-mx-keyboard",
			"logitech-mx-master-mouse-s3",
			"mouse-pad",
			"smart-led-desk-lamp-1-s",
			"smart-power-strip-6",
		],
	},
	{
		id: "the-studio-setup",
		name: "The Studio Setup",
		tagline: "Studio Display, Magic kit & HomePod",
		productIds: [
			DESK,
			CHAIR,
			"apple-studio-display",
			"apple-magic-keyboard",
			"apple-magic-mouse",
			"mouse-pad",
			"smart-power-strip-6",
			"smart-led-desk-lamp-1-s",
			"apple-home-pod",
		],
	},
];
