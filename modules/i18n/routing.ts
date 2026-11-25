import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

/** Spanish at "/", English at "/en". Add a locale here and a file in /messages. */
export const routing = defineRouting({
	locales: ["es", "en"],
	defaultLocale: "es",
	localePrefix: "as-needed",
});

export const {
	Link: LocaleLink,
	usePathname: useLocalePathname,
	useRouter: useLocaleRouter,
} = createNavigation(routing);
