import { LocaleLink } from "@i18n/routing";

export default function NotFound() {
	return (
		<div className="cl-container site-not-found">
			<h1>404</h1>
			<LocaleLink href="/">Backroom</LocaleLink>
		</div>
	);
}
