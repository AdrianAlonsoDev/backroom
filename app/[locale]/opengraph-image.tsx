import { BrandMarkArt } from "@home/components/BrandMark";
import { Mascot } from "@home/components/v3/Mascot";
import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";

export const alt = "Backroom";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "landing.v2.hero" });
	const plain = (chunks: string) => chunks;
	return new ImageResponse(
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				padding: "64px 76px",
				color: "#f6f2ea",
				background: "radial-gradient(70% 90% at 50% 120%, #d98a1f 0%, #5a340a 45%, #0c0b09 80%)",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 12,
					fontSize: 36,
					fontWeight: 600,
					letterSpacing: -2,
				}}
			>
				<span style={{ display: "flex", width: 38, height: 38 }}>
					<BrandMarkArt gradientId="og-light" onDark />
				</span>
				<span style={{ display: "flex" }}>
					backroom<span style={{ color: "#f59a2a" }}>.</span>
				</span>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					marginTop: 70,
					fontSize: 76,
					lineHeight: 1.08,
					letterSpacing: -4,
				}}
			>
				<div style={{ display: "flex" }}>{t.markup("titleA", { growth: plain })}</div>
				<div style={{ display: "flex", color: "#f5c87a" }}>
					{t.markup("titleB", { team: plain, you: plain })}
				</div>
			</div>
			<div style={{ display: "flex", alignItems: "center", marginTop: "auto" }}>
				{(["spark", "maker", "orbit"] as const).map((kind) => (
					<span key={kind} style={{ display: "flex", width: 70, height: 70, marginRight: 6 }}>
						<Mascot kind={kind} />
					</span>
				))}
				<span style={{ display: "flex", marginLeft: 18, fontSize: 24, color: "#d8cbb2" }}>
					X · Instagram · YouTube
				</span>
			</div>
		</div>,
		size,
	);
}
