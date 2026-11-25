"use client";

import { DialogDescription, DialogTitle } from "@shared/ui/dialog";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export type ExampleKind = "offer" | "website" | "content" | "research";

/** Shared content for the illustrative documents, never a simulated AI response. */
export function ExampleDocument({ kind }: { kind: ExampleKind }) {
	const t = useTranslations("landing.artifacts");
	return (
		<>
			<span className="dialog-kicker">{t("label")}</span>
			<DialogTitle>{t(`${kind}.title`)}</DialogTitle>
			<DialogDescription>{t(`${kind}.body`)}</DialogDescription>
			<small>{t("note")}</small>
			{kind !== "research" && (
				<div className="example-document-image">
					<Image
						src="/images/landing/norte-soma-concept.webp"
						alt={t("imageAlt")}
						width={1440}
						height={960}
						sizes="(max-width: 620px) 90vw, 650px"
					/>
					<span>NORTE STUDIO / SOMA</span>
				</div>
			)}
			<div className="example-document-sections">
				{(["One", "Two", "Three"] as const).map((part, i) => (
					<section key={part}>
						<span className="example-document-number">0{i + 1}</span>
						<div>
							<h3>{t(`${kind}.label${part}`)}</h3>
							<p>{t(`${kind}.text${part}`)}</p>
						</div>
					</section>
				))}
			</div>
			<p className="example-document-takeaway">
				<ArrowUpRight size={18} />
				{t(`${kind}.takeaway`)}
			</p>
		</>
	);
}
