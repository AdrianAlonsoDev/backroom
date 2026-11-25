"use client";

import { BrandMark } from "@home/components/BrandMark";
import { LocaleLink, useLocalePathname, useLocaleRouter } from "@i18n/routing";
import { ThemeSelect } from "@shared/components/ThemeSelect";
import { ArrowRight, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

/** Marks the header once the page leaves its top, so the home sky can run beneath it. */
function observeScroll(node: HTMLElement | null) {
	if (!node) return;
	let frame = 0;
	const sync = () => {
		frame = 0;
		node.dataset.scrolled = String(window.scrollY > 8);
	};
	const onScroll = () => {
		if (!frame) frame = requestAnimationFrame(sync);
	};
	window.addEventListener("scroll", onScroll, { passive: true });
	sync();
	return () => {
		window.removeEventListener("scroll", onScroll);
		cancelAnimationFrame(frame);
		delete node.dataset.scrolled;
	};
}

export function NavBar() {
	const t = useTranslations("landing");
	const [open, setOpen] = useState(false);
	const locale = useLocale();
	const pathname = useLocalePathname();
	const router = useLocaleRouter();
	// On the home page the hero owns the single access button and its sky runs under the header.
	const home = pathname === "/";
	const links = [
		["launch", "/#launch"],
		["team", "/#team"],
		["context", "/#context"],
		["faq", "/#faq"],
	] as const;
	return (
		<header
			className="site-nav"
			data-test="navigation"
			data-overlay={home ? "true" : undefined}
			data-open={open ? "true" : undefined}
			ref={observeScroll}
		>
			<a className="cl-skip" href="#main-content">
				{t("nav.skip")}
			</a>
			<div className="cl-container site-nav-inner">
				<LocaleLink href="/" className="cl-wordmark" aria-label="Backroom">
					<BrandMark />
					<span>
						backroom<span className="cl-wordmark-dot">.</span>
					</span>
				</LocaleLink>
				<nav className="cl-nav-links" aria-label={t("nav.label")}>
					{links.map(([key, href]) => (
						<LocaleLink key={key} href={href}>
							{t(`nav.${key}`)}
						</LocaleLink>
					))}
				</nav>
				<div className="cl-nav-actions">
					<ThemeSelect />
					<select
						className="cl-language"
						aria-label={t("nav.language")}
						value={locale}
						onChange={(event) => router.replace(pathname, { locale: event.target.value })}
					>
						<option value="es">ES</option>
						<option value="en">EN</option>
					</select>
					{!home && (
						<LocaleLink href="/#early-access" className="cl-button primary small">
							{t("cta")}
							<ArrowRight size={14} />
						</LocaleLink>
					)}
					<button
						type="button"
						className="cl-mobile-toggle"
						aria-label={open ? t("nav.close") : t("nav.open")}
						aria-expanded={open}
						aria-controls="cl-mobile-menu"
						onClick={() => setOpen(!open)}
					>
						{open ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>
			</div>
			{open && (
				<nav id="cl-mobile-menu" className="cl-mobile-menu" aria-label={t("nav.label")}>
					{links.map(([key, href]) => (
						<LocaleLink key={key} href={href} onClick={() => setOpen(false)}>
							{t(`nav.${key}`)}
						</LocaleLink>
					))}
					<div className="cl-mobile-languages">
						{(
							[
								["es", "Español"],
								["en", "English"],
							] as const
						).map(([language, name]) => (
							<button
								type="button"
								key={language}
								onClick={() => {
									router.replace(pathname, { locale: language });
									setOpen(false);
								}}
								aria-label={name}
								aria-current={language === locale ? "true" : undefined}
								className="cl-mobile-language"
							>
								{language}
							</button>
						))}
					</div>
				</nav>
			)}
		</header>
	);
}
