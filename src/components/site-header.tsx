export function SiteHeader() {
	return (
		<header className="border-b border-black/10 bg-white">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
				<span className="text-xl font-semibold tracking-tight text-black">
					monis<span className="text-prime">.rent</span>
				</span>
				<a
					href="https://www.monis.rent"
					target="_blank"
					rel="noopener noreferrer"
					className="rounded-full bg-prime px-4 py-2 text-sm font-medium text-prime-foreground transition-opacity hover:opacity-90"
				>
					Visit monis.rent
				</a>
			</div>
		</header>
	);
}
