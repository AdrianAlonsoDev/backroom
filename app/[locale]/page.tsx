import { Landing } from "@home/components/Landing";
import { routing } from "@i18n/routing";
import { getBaseUrl } from "@shared/lib/base-url";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "landing" });
	const url = new URL(locale === routing.defaultLocale ? "/" : `/${locale}`, getBaseUrl());
	return {
		alternates: {
			canonical: url,
			languages: Object.fromEntries(
				routing.locales.map((language) => [
					language,
					language === routing.defaultLocale ? "/" : `/${language}`,
				]),
			),
		},
		openGraph: {
			title: t("meta.title"),
			description: t("meta.description"),
			siteName: "Backroom",
			type: "website",
			url,
		},
		twitter: {
			card: "summary_large_image",
			title: t("meta.title"),
			description: t("meta.description"),
		},
		title: { absolute: t("meta.title") },
		description: t("meta.description"),
	};
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);
	return <Landing />;
}
