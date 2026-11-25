"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

/** One button between light and dark. The icons follow the root class, so the server render
 * never depends on client storage. */
export function ThemeSelect() {
	const t = useTranslations("landing.nav");
	const { resolvedTheme, setTheme } = useTheme();
	return (
		<button
			type="button"
			className="cl-theme-select"
			aria-label={t("theme")}
			title={t("theme")}
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
		>
			<span className="cl-theme-icons" aria-hidden="true">
				<Sun className="cl-theme-sun" size={16} />
				<Moon className="cl-theme-moon" size={16} />
			</span>
		</button>
	);
}
