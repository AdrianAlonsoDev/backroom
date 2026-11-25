import { routing } from "@i18n/routing";
import { Footer } from "@shared/components/Footer";
import { NavBar } from "@shared/components/NavBar";
import { getBaseUrl } from "@shared/lib/base-url";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { DM_Sans, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";

const sansFont = Inter({ subsets: ["latin"], variable: "--font-inter" });
const headingFont = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export function generateMetadata() {
	return { metadataBase: new URL(getBaseUrl()) };
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params,
}: PropsWithChildren<{ params: Promise<{ locale: string }> }>) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) notFound();
	setRequestLocale(locale);
	return (
		<html
			lang={locale}
			suppressHydrationWarning
			className={`${sansFont.variable} ${headingFont.variable}`}
		>
			<body>
				<NextIntlClientProvider>
					<ThemeProvider
						attribute="class"
						disableTransitionOnChange
						enableSystem
						defaultTheme="system"
					>
						<NavBar />
						<main id="main-content">{children}</main>
						<Footer />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
