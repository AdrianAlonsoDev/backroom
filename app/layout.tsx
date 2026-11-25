import type { PropsWithChildren } from "react";

import "./globals.css";

/** The real document lives in app/[locale]/layout.tsx, which knows the language. */
export default function RootLayout({ children }: PropsWithChildren) {
	return children;
}
