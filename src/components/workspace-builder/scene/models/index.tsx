import type { ModelSpec } from "@/data/products";
import { Chair } from "./chair";
import { Desk } from "./desk";
import {
	DeskLamp,
	Hub,
	Keyboard,
	LaptopStand,
	LightBar,
	MonitorStand,
	Mouse,
	MousePad,
	Webcam,
} from "./desk-gear";
import { Monitor } from "./monitor";
import {
	AirPurifier,
	CoffeeStation,
	Plant,
	PowerStrip,
	TowerFan,
	WalkingPad,
	Whiteboard,
} from "./room-items";
import { Headphones, HomePod, Laptop, MacMini, Mic } from "./tech";

export type ModelContext = { deskHeight: number; hasLaptop: boolean };

export function ProductModel({
	spec,
	context,
}: {
	spec: ModelSpec;
	context: ModelContext;
}) {
	switch (spec.kind) {
		case "desk":
			return <Desk spec={spec} height={context.deskHeight} />;
		case "chair":
			return <Chair spec={spec} />;
		case "monitor":
			return <Monitor spec={spec} />;
		case "keyboard":
			return <Keyboard spec={spec} />;
		case "mouse":
			return <Mouse spec={spec} />;
		case "mousePad":
			return <MousePad />;
		case "laptopStand":
			return <LaptopStand hasLaptop={context.hasLaptop} />;
		case "laptop":
			return <Laptop spec={spec} />;
		case "lightBar":
			return <LightBar />;
		case "webcam":
			return <Webcam />;
		case "monitorStand":
			return <MonitorStand />;
		case "deskLamp":
			return <DeskLamp spec={spec} />;
		case "hub":
			return <Hub />;
		case "macMini":
			return <MacMini />;
		case "headphones":
			return <Headphones />;
		case "mic":
			return <Mic />;
		case "homePod":
			return <HomePod />;
		case "powerStrip":
			return <PowerStrip spec={spec} />;
		case "airPurifier":
			return <AirPurifier />;
		case "towerFan":
			return <TowerFan />;
		case "walkingPad":
			return <WalkingPad />;
		case "coffeeMachine":
			return <CoffeeStation />;
		case "whiteboard":
			return <Whiteboard />;
		case "plant":
			return <Plant spec={spec} />;
	}
}
