"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

const palettes = ["gold", "blue"] as const;

/** Two swatches, gold and night blue. The active one follows the root's data-palette in CSS, so
 * the server render never depends on client storage. */
export function ThemeSelect() {
	const t = useTranslations("landing.nav");
	const { setTheme } = useTheme();
	return (
		<fieldset className="cl-palette-select">
			<legend className="sr-only">{t("theme")}</legend>
			{palettes.map((palette) => (
				<button
					key={palette}
					type="button"
					className="cl-palette-swatch"
					data-value={palette}
					aria-label={t(`palette.${palette}`)}
					title={t(`palette.${palette}`)}
					onClick={() => setTheme(palette)}
				/>
			))}
		</fieldset>
	);
}
