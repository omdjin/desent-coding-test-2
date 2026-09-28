export type Category =
	| "desks"
	| "chairs"
	| "monitors"
	| "gear"
	| "tech"
	| "room";

export type Slot = "desk" | "chair" | "monitor" | "deskLamp" | "plant";

export type Wallpaper = "sunset" | "ocean" | "aurora" | "neon" | "mono";

export type ModelSpec =
	| {
			kind: "desk";
			width: number;
			depth: number;
			top: string;
			frame: string;
			legs: "dual" | "crank";
	  }
	| { kind: "chair"; fabric: string; frame: string; headrest: boolean }
	| {
			kind: "monitor";
			inches: number;
			aspect: "16:9" | "21:9";
			curved?: boolean;
			bezel: string;
			stand: "v" | "column" | "apple";
			wallpaper: Wallpaper;
	  }
	| { kind: "deskLamp"; variant: "bar" }
	| { kind: "plant"; size: "desk" | "floor" };

export type Product = {
	id: string;
	name: string;
	category: Category;
	slot: Slot;
	/** Weekly rate for rentals shorter than a month. */
	weekly: number;
	/** Weekly rate once the rental is a month or longer. */
	weeklyLongTerm: number;
	image?: string;
	model: ModelSpec;
};

export const CATEGORIES: { key: Category; label: string }[] = [
	{ key: "desks", label: "Desks" },
	{ key: "chairs", label: "Chairs" },
	{ key: "monitors", label: "Monitors" },
	{ key: "gear", label: "Desk gear" },
	{ key: "tech", label: "Tech" },
	{ key: "room", label: "Room" },
];

const UPLOADS = "https://strapi.monis.rent/uploads";

export const products: Product[] = [
	{
		id: "standing-desk",
		name: "Dual Motor Standing Desk",
		category: "desks",
		slot: "desk",
		weekly: 15,
		weeklyLongTerm: 15,
		image: `${UPLOADS}/Dual_Motor_Standing_Desk_8_9f364ae87f.jpg`,
		model: {
			kind: "desk",
			width: 1.4,
			depth: 0.7,
			top: "#6b4a2f",
			frame: "#1f1f1f",
			legs: "dual",
		},
	},
	{
		id: "mechanical-desk",
		name: "Mechanical Adjustable Desk",
		category: "desks",
		slot: "desk",
		weekly: 12,
		weeklyLongTerm: 12,
		image: `${UPLOADS}/Mechanical_Adjustable_Desk_front_new_a83b8077b0.jpg`,
		model: {
			kind: "desk",
			width: 1.2,
			depth: 0.6,
			top: "#ecebe7",
			frame: "#1f1f1f",
			legs: "crank",
		},
	},
	{
		id: "fantech-chair",
		name: "Fantech Ergonomic Chair",
		category: "chairs",
		slot: "chair",
		weekly: 10,
		weeklyLongTerm: 10,
		image: `${UPLOADS}/fantech_oca259s_chair_6_b632a0c529.jpg`,
		model: {
			kind: "chair",
			fabric: "#1d1f22",
			frame: "#3a3d42",
			headrest: true,
		},
	},
	{
		id: "classic-chair",
		name: "Classic Office Chair",
		category: "chairs",
		slot: "chair",
		weekly: 7,
		weeklyLongTerm: 7,
		model: {
			kind: "chair",
			fabric: "#7a4a2f",
			frame: "#2a2a2a",
			headrest: false,
		},
	},
	{
		id: "monitor-a24",
		name: '24" Office Monitor',
		category: "monitors",
		slot: "monitor",
		weekly: 5,
		weeklyLongTerm: 5,
		image: `${UPLOADS}/24_Full_HD_Office_Monitor_A24i_1_7f987306af.jpg`,
		model: {
			kind: "monitor",
			inches: 24,
			aspect: "16:9",
			bezel: "#1b1c1f",
			stand: "v",
			wallpaper: "aurora",
		},
	},
	{
		id: "monitor-a27",
		name: '27" 4K Monitor',
		category: "monitors",
		slot: "monitor",
		weekly: 8,
		weeklyLongTerm: 8,
		image: `${UPLOADS}/27_4_K_A27_U_Multitasking_Monitor_1_ce29d15357.jpg`,
		model: {
			kind: "monitor",
			inches: 27,
			aspect: "16:9",
			bezel: "#1b1c1f",
			stand: "column",
			wallpaper: "sunset",
		},
	},
	{
		id: "desk-lamp",
		name: "Xiaomi LED Desk Lamp",
		category: "gear",
		slot: "deskLamp",
		weekly: 3,
		weeklyLongTerm: 3,
		image: `${UPLOADS}/Xiaomi_Mi_Led_Desk_Lamp_1_S_10_3777ddd163.jpg`,
		model: { kind: "deskLamp", variant: "bar" },
	},
	{
		id: "desk-plant",
		name: "Desk Plant",
		category: "room",
		slot: "plant",
		weekly: 2,
		weeklyLongTerm: 2,
		model: { kind: "plant", size: "desk" },
	},
];

export function getProduct(id: string): Product | undefined {
	return products.find((product) => product.id === id);
}
