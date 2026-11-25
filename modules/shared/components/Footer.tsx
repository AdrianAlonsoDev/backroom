import { BrandMark } from "@home/components/BrandMark";
import { LocaleLink } from "@i18n/routing";
import { getTranslations } from "next-intl/server";

export async function Footer() {
	const t = await getTranslations("landing.footer");
	return (
		<footer className="site-footer">
			<div className="cl-container">
				<div className="footer-top">
					<p className="footer-note">{t("note")}</p>
					<nav className="footer-links" aria-label={t("label")}>
						<LocaleLink href="/#product">{t("product")}</LocaleLink>
						<LocaleLink href="/#early-access">{t("contact")}</LocaleLink>
					</nav>
				</div>
				<div className="footer-big" aria-hidden="true">
					<BrandMark />
					<span>backroom.</span>
				</div>
				<div className="footer-bottom">
					<span>© {new Date().getFullYear()} Backroom</span>
					<span>{t("signature")}</span>
				</div>
			</div>
		</footer>
	);
}
