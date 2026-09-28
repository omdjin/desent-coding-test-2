const TABS = ["Chairs", "Desks", "Accessories"] as const;

export function WorkspaceBuilderShell() {
	return (
		<div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-32">
			<div className="grid gap-6 lg:grid-cols-[280px_1fr]">
				<div className="rounded-2xl border border-black/10 bg-white p-4">
					<div className="flex gap-2 rounded-full bg-cream p-1">
						{TABS.map((tab, i) => (
							<span
								key={tab}
								className={`flex-1 rounded-full px-3 py-1.5 text-center text-sm font-medium ${
									i === 0 ? "bg-prime text-prime-foreground" : "text-prime"
								}`}
							>
								{tab}
							</span>
						))}
					</div>
					<div className="mt-4 grid grid-cols-2 gap-3">
						{["a", "b", "c", "d"].map((placeholder) => (
							<div
								key={placeholder}
								className="aspect-square rounded-xl border border-dashed border-black/15 bg-cream/40"
							/>
						))}
					</div>
				</div>

				<div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-black/10 bg-cream/40">
					<p className="text-sm text-prime/60">
						Your workspace preview will appear here
					</p>
				</div>
			</div>

			<div className="flex items-center justify-between rounded-full border border-black/10 bg-white px-6 py-4 shadow-sm">
				<div>
					<p className="text-sm font-semibold text-black">Ready to rent?</p>
					<p className="text-xs text-prime/60">
						Select a desk, chair, and accessories to get started
					</p>
				</div>
				<span className="rounded-full bg-black/10 px-5 py-2.5 text-sm font-medium text-black/40">
					Rent your setup
				</span>
			</div>
		</div>
	);
}
