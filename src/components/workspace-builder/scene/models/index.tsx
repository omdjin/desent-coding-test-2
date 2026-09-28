import type { ModelSpec } from "@/data/products";
import { Chair } from "./chair";
import { Desk } from "./desk";
import { DeskLamp } from "./desk-gear";
import { Monitor } from "./monitor";
import { Plant } from "./room-items";

export function ProductModel({
	spec,
	deskHeight,
}: {
	spec: ModelSpec;
	deskHeight: number;
}) {
	switch (spec.kind) {
		case "desk":
			return <Desk spec={spec} height={deskHeight} />;
		case "chair":
			return <Chair spec={spec} />;
		case "monitor":
			return <Monitor spec={spec} />;
		case "deskLamp":
			return <DeskLamp spec={spec} />;
		case "plant":
			return <Plant spec={spec} />;
	}
}
