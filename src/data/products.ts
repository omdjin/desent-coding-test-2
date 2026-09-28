export type Category = "desk" | "chair" | "monitor" | "lamp" | "plant";

export type Product = {
	id: string;
	name: string;
	category: Category;
	pricePerWeek: number;
	/** Real product photo shown in the selection card. Omit to fall back to an illustrated icon. */
	image?: string;
	/** Tint applied to this item's shape in the illustrated scene preview. */
	tint: string;
};

export const desks: Product[] = [
	{
		id: "standing-desk",
		name: "Dual Motor Standing Desk",
		category: "desk",
		pricePerWeek: 15,
		image:
			"https://strapi.monis.rent/uploads/Dual_Motor_Standing_Desk_8_9f364ae87f.jpg",
		tint: "#c9b79c",
	},
	{
		id: "mechanical-desk",
		name: "Mechanical Adjustable Desk",
		category: "desk",
		pricePerWeek: 12,
		image:
			"https://strapi.monis.rent/uploads/Mechanical_Adjustable_Desk_front_new_a83b8077b0.jpg",
		tint: "#a98f6b",
	},
];

export const chairs: Product[] = [
	{
		id: "fantech-chair",
		name: "Fantech Ergonomic Chair",
		category: "chair",
		pricePerWeek: 10,
		image:
			"https://strapi.monis.rent/uploads/fantech_oca259s_chair_6_b632a0c529.jpg",
		tint: "#15252e",
	},
	{
		id: "classic-chair",
		name: "Classic Office Chair",
		category: "chair",
		pricePerWeek: 7,
		tint: "#7a4a2f",
	},
];

export const accessories: Product[] = [
	{
		id: "monitor-a24",
		name: '24" Office Monitor',
		category: "monitor",
		pricePerWeek: 5,
		image:
			"https://strapi.monis.rent/uploads/24_Full_HD_Office_Monitor_A24i_1_7f987306af.jpg",
		tint: "#1f2937",
	},
	{
		id: "monitor-a27",
		name: '27" 4K Monitor',
		category: "monitor",
		pricePerWeek: 8,
		image:
			"https://strapi.monis.rent/uploads/27_4_K_A27_U_Multitasking_Monitor_1_ce29d15357.jpg",
		tint: "#1f2937",
	},
	{
		id: "desk-lamp",
		name: "Xiaomi LED Desk Lamp",
		category: "lamp",
		pricePerWeek: 3,
		image:
			"https://strapi.monis.rent/uploads/Xiaomi_Mi_Led_Desk_Lamp_1_S_10_3777ddd163.jpg",
		tint: "#f9f2ea",
	},
	{
		id: "desk-plant",
		name: "Desk Plant",
		category: "plant",
		pricePerWeek: 2,
		tint: "#4d7c4a",
	},
];

export const allProducts = [...desks, ...chairs, ...accessories];

export function getProduct(id: string): Product | undefined {
	return allProducts.find((product) => product.id === id);
}
