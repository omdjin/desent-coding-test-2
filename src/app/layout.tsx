import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
	),
	title: "Design Your Workspace — monis.rent",
	description:
		"Build your dream office setup — desk, chair, and accessories — and rent it in Bali with monis.rent.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" className={`${inter.variable} h-full antialiased`}>
			<body className="min-h-full flex flex-col bg-background text-foreground">
				{children}
			</body>
		</html>
	);
}
