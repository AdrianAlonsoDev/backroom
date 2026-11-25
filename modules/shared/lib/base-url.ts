/** The site's public URL, for metadata and the social image. Set NEXT_PUBLIC_SITE_URL in production. */
export function getBaseUrl() {
	if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
	if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
		return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
	return `http://localhost:${process.env.PORT ?? 3000}`;
}
