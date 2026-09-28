export type Category =
	| "desks"
	| "chairs"
	| "monitors"
	| "gear"
	| "tech"
	| "room";

export type Slot =
	| "desk"
	| "chair"
	| "monitor"
	| "keyboard"
	| "mouse"
	| "mousePad"
	| "laptopStand"
	| "lightBar"
	| "webcam"
	| "monitorStand"
	| "deskLamp"
	| "hub"
	| "laptop"
	| "computer"
	| "headphones"
	| "mic"
	| "speaker"
	| "power"
	| "airPurifier"
	| "fan"
	| "walkingPad"
	| "coffee"
	| "whiteboard"
	| "plant";

export type Wallpaper = "sunset" | "ocean" | "aurora" | "neon" | "mono";

export type ModelSpec =
	| {
			kind: "desk";
			width: number;
			depth: number;
			top: string;
			frame: string;
			column: string;
			legs: "dual" | "crank";
	  }
	| {
			kind: "chair";
			fabric: string;
			frame: string;
			base: string;
			headrest: boolean;
	  }
	| {
			kind: "monitor";
			inches: number;
			aspect: "16:9" | "21:9";
			curved?: boolean;
			bezel: string;
			stand: "t" | "clamp" | "apple";
			wallpaper: Wallpaper;
	  }
	| { kind: "keyboard"; variant: "mx" | "magic" }
	| { kind: "mouse"; variant: "mx" | "magic" }
	| { kind: "mousePad" }
	| { kind: "laptopStand" }
	| { kind: "laptop"; variant: "macbook" | "windows" }
	| { kind: "lightBar" }
	| { kind: "webcam" }
	| { kind: "monitorStand" }
	| { kind: "deskLamp"; variant: "bar" | "hue" }
	| { kind: "hub" }
	| { kind: "macMini" }
	| { kind: "headphones" }
	| { kind: "mic" }
	| { kind: "homePod" }
	| { kind: "powerStrip"; outlets: 3 | 6 }
	| { kind: "airPurifier" }
	| { kind: "towerFan" }
	| { kind: "walkingPad" }
	| { kind: "coffeeMachine" }
	| { kind: "whiteboard" }
	| { kind: "plant"; size: "desk" | "floor" };

export type Product = {
	/** monis.rent product slug — the product page is /products/<id>. */
	id: string;
	name: string;
	category: Category;
	slot: Slot;
	/** Weekly rate for rentals shorter than a month. */
	weekly: number;
	/** Weekly rate once the rental is a month or longer. */
	weeklyLongTerm: number;
	image?: string;
	/** Styling extra that monis.rent doesn't rent out — free, no product page. */
	decor?: boolean;
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
const BEZEL = "#18191c";

// Prices and photos snapshotted from monis.rent's public catalogue (Bali, Sep 2026).
export const products: Product[] = [
	{
		id: "electrical-adjustable-desk",
		name: "Electrical Adjustable Desk",
		category: "desks",
		slot: "desk",
		weekly: 7,
		weeklyLongTerm: 5,
		image: `${UPLOADS}/desk_titel_new_3db151d44c.jpg`,
		model: {
			kind: "desk",
			width: 1.2,
			depth: 0.6,
			top: "#232323",
			frame: "#161616",
			column: "#b9bcc0",
			legs: "dual",
		},
	},
	{
		id: "dual-motor-electric-standing-desk",
		name: "Dual-Motor Electric Standing Desk",
		category: "desks",
		slot: "desk",
		weekly: 16,
		weeklyLongTerm: 9,
		image: `${UPLOADS}/Dual_Motor_Standing_Desk_8_9f364ae87f.jpg`,
		model: {
			kind: "desk",
			width: 1.4,
			depth: 0.7,
			top: "#6b4a2f",
			frame: "#1a1a1a",
			column: "#26272a",
			legs: "dual",
		},
	},
	{
		id: "adjustable-wooden-desk",
		name: "Mechanical Adjustable Desk",
		category: "desks",
		slot: "desk",
		weekly: 13,
		weeklyLongTerm: 9,
		image: `${UPLOADS}/Mechanical_Adjustable_Desk_front_new_a83b8077b0.jpg`,
		model: {
			kind: "desk",
			width: 1.2,
			depth: 0.6,
			top: "#ecebe7",
			frame: "#1f1f1f",
			column: "#1f1f1f",
			legs: "crank",
		},
	},
	{
		id: "ergonomic-office-chair",
		name: "Ergonomic Office Chair",
		category: "chairs",
		slot: "chair",
		weekly: 9,
		weeklyLongTerm: 6,
		image: `${UPLOADS}/fantech_oca259s_chair_6_b632a0c529.jpg`,
		model: {
			kind: "chair",
			fabric: "#1d1f22",
			frame: "#3a3d42",
			base: "#2a2c30",
			headrest: true,
		},
	},
	{
		id: "ergonomic-chair-furradec-cm",
		name: "Ergonomic Chair Furradec",
		category: "chairs",
		slot: "chair",
		weekly: 13,
		weeklyLongTerm: 8,
		image: `${UPLOADS}/Furradec_Haru_Plus_1_452a27fb44.jpg`,
		model: {
			kind: "chair",
			fabric: "#4a4d52",
			frame: "#2b2d31",
			base: "#cfd2d6",
			headrest: true,
		},
	},
	{
		id: "ergonomic-office-chair-anya-cm",
		name: "Ergonomic Office Chair Anya",
		category: "chairs",
		slot: "chair",
		weekly: 13,
		weeklyLongTerm: 8,
		image: `${UPLOADS}/Modena_Anya_4_387695b8a1.jpg`,
		model: {
			kind: "chair",
			fabric: "#141517",
			frame: "#1e1f22",
			base: "#cfd2d6",
			headrest: true,
		},
	},
	{
		id: "24-full-hd-office-monitor-a24i-2026",
		name: '24" Full HD Office Monitor A24i',
		category: "monitors",
		slot: "monitor",
		weekly: 9,
		weeklyLongTerm: 6.5,
		image: `${UPLOADS}/24_full_HD_office_monitor_a24i_2026_be9e6bf958.jpg`,
		model: {
			kind: "monitor",
			inches: 24,
			aspect: "16:9",
			bezel: BEZEL,
			stand: "t",
			wallpaper: "ocean",
		},
	},
	{
		id: "27-4-k-multimedia-monitor",
		name: '27" 4K Multimedia Monitor',
		category: "monitors",
		slot: "monitor",
		weekly: 21,
		weeklyLongTerm: 13,
		image: `${UPLOADS}/27_4_K_A27_U_Multitasking_Monitor_1_ce29d15357.jpg`,
		model: {
			kind: "monitor",
			inches: 27,
			aspect: "16:9",
			bezel: BEZEL,
			stand: "t",
			wallpaper: "sunset",
		},
	},
	{
		id: "32-4-k-ergonomic-monitor",
		name: '32" QHD Ergonomic Monitor',
		category: "monitors",
		slot: "monitor",
		weekly: 26,
		weeklyLongTerm: 19,
		image: `${UPLOADS}/32_LG_Fine_Art_addtition_1_1c49831c40.jpg`,
		model: {
			kind: "monitor",
			inches: 32,
			aspect: "16:9",
			bezel: BEZEL,
			stand: "clamp",
			wallpaper: "aurora",
		},
	},
	{
		id: "34-4-k-curved-monitor-180-hz",
		name: '34" 4K Gaming Monitor',
		category: "monitors",
		slot: "monitor",
		weekly: 23,
		weeklyLongTerm: 19,
		image: `${UPLOADS}/34_4_K_Gaming_Monitor_7_3f6b2ba627.jpg`,
		model: {
			kind: "monitor",
			inches: 34,
			aspect: "21:9",
			curved: true,
			bezel: BEZEL,
			stand: "t",
			wallpaper: "neon",
		},
	},
	{
		id: "apple-studio-display",
		name: '27" 5K Apple Studio Display',
		category: "monitors",
		slot: "monitor",
		weekly: 99,
		weeklyLongTerm: 75,
		image: `${UPLOADS}/Apple_Studio_Display_6_94c6329a05.jpg`,
		model: {
			kind: "monitor",
			inches: 27,
			aspect: "16:9",
			bezel: "#101012",
			stand: "apple",
			wallpaper: "mono",
		},
	},
	{
		id: "logitech-mx-keyboard",
		name: "Logitech MX Keys",
		category: "gear",
		slot: "keyboard",
		weekly: 7,
		weeklyLongTerm: 7,
		image: `${UPLOADS}/Logitech_MX_keys_1_9977480ae1.jpg`,
		model: { kind: "keyboard", variant: "mx" },
	},
	{
		id: "apple-magic-keyboard",
		name: "Apple Magic Keyboard",
		category: "gear",
		slot: "keyboard",
		weekly: 12,
		weeklyLongTerm: 8,
		image: `${UPLOADS}/magic_keyboard_with_touch_id_1_7124075f1d.jpg`,
		model: { kind: "keyboard", variant: "magic" },
	},
	{
		id: "logitech-mx-master-mouse-s3",
		name: "Logitech MX Master 3S",
		category: "gear",
		slot: "mouse",
		weekly: 5,
		weeklyLongTerm: 3,
		image: `${UPLOADS}/Logitech_S3_6_4cf1e523b8.jpg`,
		model: { kind: "mouse", variant: "mx" },
	},
	{
		id: "apple-magic-mouse",
		name: "Apple Magic Mouse",
		category: "gear",
		slot: "mouse",
		weekly: 9,
		weeklyLongTerm: 6,
		image: `${UPLOADS}/Apple_Magic_Mouse_4_022f966524.jpg`,
		model: { kind: "mouse", variant: "magic" },
	},
	{
		id: "mouse-pad",
		name: "Mouse Pad",
		category: "gear",
		slot: "mousePad",
		weekly: 2,
		weeklyLongTerm: 1,
		image: `${UPLOADS}/Mouse_pad_1_e6684ebc31.jpg`,
		model: { kind: "mousePad" },
	},
	{
		id: "ergonomic-laptop-stand",
		name: "Ergonomic Laptop Stand",
		category: "gear",
		slot: "laptopStand",
		weekly: 3,
		weeklyLongTerm: 2,
		image: `${UPLOADS}/Laptop_stand_back_new2_91df29c3c8.jpg`,
		model: { kind: "laptopStand" },
	},
	{
		id: "metal-monitor-light-bar",
		name: "Monitor Light Bar",
		category: "gear",
		slot: "lightBar",
		weekly: 5,
		weeklyLongTerm: 3,
		image: `${UPLOADS}/Monitor_Light_Bar_1_8e97972171.jpg`,
		model: { kind: "lightBar" },
	},
	{
		id: "logitech-4-k-webcam",
		name: "Logitech 4K Webcam",
		category: "gear",
		slot: "webcam",
		weekly: 9,
		weeklyLongTerm: 6,
		image: `${UPLOADS}/Logitech_Brio_4_K_Webcam_6_d7ea7e69b0.jpg`,
		model: { kind: "webcam" },
	},
	{
		id: "adjustable-monitor-stand",
		name: "Adjustable Monitor Stand",
		category: "gear",
		slot: "monitorStand",
		weekly: 3,
		weeklyLongTerm: 2,
		image: `${UPLOADS}/Adjustable_Monitor_Stand_4_e6ae3a1d06.jpg`,
		model: { kind: "monitorStand" },
	},
	{
		id: "smart-led-desk-lamp-1-s",
		name: "Smart LED Desk Lamp 1S",
		category: "gear",
		slot: "deskLamp",
		weekly: 4,
		weeklyLongTerm: 3,
		image: `${UPLOADS}/Xiaomi_Mi_Led_Desk_Lamp_1_S_10_3777ddd163.jpg`,
		model: { kind: "deskLamp", variant: "bar" },
	},
	{
		id: "hue-signe-gradient-lamp",
		name: "Hue Signe Gradient Lamp",
		category: "gear",
		slot: "deskLamp",
		weekly: 12,
		weeklyLongTerm: 8,
		image: `${UPLOADS}/Philips_Hue_Signe_gradient_table_lamp_new_e4eeba8c56.jpg`,
		model: { kind: "deskLamp", variant: "hue" },
	},
	{
		id: "6-in-1-converter-hub",
		name: "6-in-1 Converter Hub",
		category: "gear",
		slot: "hub",
		weekly: 2,
		weeklyLongTerm: 1.5,
		image: `${UPLOADS}/mac_dongle_product_photo_0316bc4b50.jpg`,
		model: { kind: "hub" },
	},
	{
		id: "apple-mac-book-neo",
		name: "Apple MacBook Neo",
		category: "tech",
		slot: "laptop",
		weekly: 32,
		weeklyLongTerm: 24,
		image: `${UPLOADS}/Mac_Book_Neo_Silver_6_ceb2d1d671.jpg`,
		model: { kind: "laptop", variant: "macbook" },
	},
	{
		id: "office-windows-laptop",
		name: '15" Office Windows Laptop',
		category: "tech",
		slot: "laptop",
		weekly: 24,
		weeklyLongTerm: 16,
		image: `${UPLOADS}/15_Office_Windows_Laptop_1_c1221bb234.jpg`,
		model: { kind: "laptop", variant: "windows" },
	},
	{
		id: "apple-mac-mini-m4",
		name: "Apple Mac Mini M4",
		category: "tech",
		slot: "computer",
		weekly: 39,
		weeklyLongTerm: 29,
		image: `${UPLOADS}/Mac_mini_M4_front_b152d10743.jpg`,
		model: { kind: "macMini" },
	},
	{
		id: "logitech-wireless-headphones",
		name: "Wireless Headphones",
		category: "tech",
		slot: "headphones",
		weekly: 7,
		weeklyLongTerm: 4,
		image: `${UPLOADS}/zone_300_graphite_4_17d41d1a5b.webp`,
		model: { kind: "headphones" },
	},
	{
		id: "podcast-microphone-kit",
		name: "Podcast Microphone Kit",
		category: "tech",
		slot: "mic",
		weekly: 18,
		weeklyLongTerm: 12,
		image: `${UPLOADS}/Shure_MV_7_Podcast_Microphone_Kit_1_fefd9453fb.jpg`,
		model: { kind: "mic" },
	},
	{
		id: "apple-home-pod",
		name: "Apple HomePod",
		category: "tech",
		slot: "speaker",
		weekly: 21,
		weeklyLongTerm: 15,
		image: `${UPLOADS}/Apple_homepod_1_4fe0a77250.jpg`,
		model: { kind: "homePod" },
	},
	{
		id: "international-power-strip",
		name: "Smart Power Strip 3",
		category: "room",
		slot: "power",
		weekly: 1.5,
		weeklyLongTerm: 1,
		image: `${UPLOADS}/Xiaomi_MI_Smart_Power_Strip_Plug_black_3965e07e42.jpg`,
		model: { kind: "powerStrip", outlets: 3 },
	},
	{
		id: "smart-power-strip-6",
		name: "Smart Power Strip 6",
		category: "room",
		slot: "power",
		weekly: 3,
		weeklyLongTerm: 2,
		image: `${UPLOADS}/Xiaomi_MI_Smart_Power_Strip_Plug_white_4b97124ba0.jpg`,
		model: { kind: "powerStrip", outlets: 6 },
	},
	{
		id: "smart-air-purifier",
		name: "Smart Air Purifier",
		category: "room",
		slot: "airPurifier",
		weekly: 11,
		weeklyLongTerm: 7,
		image: `${UPLOADS}/Smart_Air_Purifier_6_5_bad4579786.jpg`,
		model: { kind: "airPurifier" },
	},
	{
		id: "smart-tower-fan",
		name: "Smart Tower Fan",
		category: "room",
		slot: "fan",
		weekly: 8,
		weeklyLongTerm: 5,
		image: `${UPLOADS}/Xiaomi_Smart_Tower_Fan_2_1_564cd4ec1e.jpg`,
		model: { kind: "towerFan" },
	},
	{
		id: "foldable-walk-pad",
		name: "Foldable Walking Pad R2 Pro",
		category: "room",
		slot: "walkingPad",
		weekly: 28,
		weeklyLongTerm: 18,
		image: `${UPLOADS}/Walking_pad_new_05f1ab2d48.jpg`,
		model: { kind: "walkingPad" },
	},
	{
		id: "nespresso-essenza-coffee-machine",
		name: "Nespresso Essenza Coffee Machine",
		category: "room",
		slot: "coffee",
		weekly: 12,
		weeklyLongTerm: 7,
		image: `${UPLOADS}/NESPRESSO_Essenza_Mini_2_4ea4cc0abc.jpg`,
		model: { kind: "coffeeMachine" },
	},
	{
		id: "magnetic-whiteboard",
		name: "Magnetic Whiteboard",
		category: "room",
		slot: "whiteboard",
		weekly: 6.5,
		weeklyLongTerm: 4.5,
		image: `${UPLOADS}/Standing_Whiteboard_and_Flip_Chart_2c6d390161.jpg`,
		model: { kind: "whiteboard" },
	},
	{
		id: "monstera-plant",
		name: "Monstera (on the house)",
		category: "room",
		slot: "plant",
		weekly: 0,
		weeklyLongTerm: 0,
		decor: true,
		model: { kind: "plant", size: "floor" },
	},
];

export function getProduct(id: string): Product | undefined {
	return products.find((product) => product.id === id);
}
