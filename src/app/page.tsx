import { SiteHeader } from "@/components/site-header";
import { WorkspaceBuilder } from "@/components/workspace-builder/workspace-builder";

export default function Home() {
	return (
		<>
			<SiteHeader />
			<main className="flex-1 bg-white pb-16 pt-12">
				<div className="mx-auto max-w-6xl px-6 text-center">
					<h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
						Design your workspace!
					</h1>
					<p className="mx-auto mt-3 max-w-md text-prime/70">
						Pick a desk, a chair, and the accessories you need — watch it come
						to life, then rent it for as long as you need.
					</p>
				</div>
				<div className="mt-10">
					<WorkspaceBuilder />
				</div>
			</main>
		</>
	);
}
