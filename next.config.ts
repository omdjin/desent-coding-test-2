import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "strapi.monis.rent",
				pathname: "/uploads/**",
			},
		],
	},
};

export default nextConfig;
