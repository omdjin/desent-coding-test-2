import { DURATIONS } from "@/lib/selection";

export function DurationPicker({
	weeks,
	onChange,
}: {
	weeks: number;
	onChange: (weeks: number) => void;
}) {
	return (
		<label className="flex items-center gap-2 text-sm">
			<span className="text-prime/60">Rent for</span>
			<select
				value={weeks}
				onChange={(event) => onChange(Number(event.target.value))}
				className="cursor-pointer rounded-full border border-black/10 bg-cream px-3 py-1.5 font-medium text-prime focus:ring-2 focus:ring-prime/30 focus:outline-none"
			>
				{DURATIONS.map((duration) => (
					<option key={duration.weeks} value={duration.weeks}>
						{duration.label}
					</option>
				))}
			</select>
		</label>
	);
}
