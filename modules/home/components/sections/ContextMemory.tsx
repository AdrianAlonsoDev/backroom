"use client";

import { AgentAvatar } from "@home/components/AgentAvatar";
import { AppWindow } from "@home/components/sections/AppWindow";
import { WorkTile } from "@home/components/v3/WorkTile";
import { ArrowRight, Check, FileText, History, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

/** What the team knows, where it came from, and one correction that reaches everyone. */
export function ContextMemory() {
	const t = useTranslations("landing.v4.context");
	const w = useTranslations("landing.v2.workspace");
	const [corrected, setCorrected] = useState(false);
	const [announce, setAnnounce] = useState("");
	const state = corrected ? "after" : "before";
	return (
		<AppWindow
			screen="knowledge"
			rail={false}
			crumbs={[w("knowledge")]}
			className="v4-context-window"
		>
			<div className="v4-memory" data-corrected={corrected || undefined}>
				<article className="v4-note">
					<header className="v4-note-head">
						<WorkTile kind="book" size="sm" />
						<span>
							<h3>{t("noteTitle")}</h3>
							<small key={state}>
								<History size={12} aria-hidden="true" />
								{corrected ? t("revisionAfter") : t("revisionBefore")}
							</small>
						</span>
					</header>
					<dl className="v4-note-body">
						<div>
							<dt>{t("sections.offer")}</dt>
							<dd>{t("offer")}</dd>
						</div>
						<div data-changed={corrected || undefined}>
							<dt>{t("sections.audience")}</dt>
							<dd key={state}>
								{corrected ? <mark>{t("audienceAfter")}</mark> : t("audienceBefore")}
							</dd>
						</div>
						<div data-changed={corrected || undefined}>
							<dt>{t("sections.price")}</dt>
							<dd key={state}>{corrected ? <mark>{t("priceAfter")}</mark> : t("priceBefore")}</dd>
						</div>
						<div>
							<dt>{t("sections.tone")}</dt>
							<dd>{t("tone")}</dd>
						</div>
					</dl>
					<div className="v4-correction">
						<span className="v4-you">{t("you")}</span>
						<p>{t("correction")}</p>
						<button
							type="button"
							className={corrected ? "v4-secondary" : "v4-primary"}
							aria-pressed={corrected}
							onClick={() => {
								setCorrected(!corrected);
								setAnnounce(corrected ? "" : t("announce"));
							}}
						>
							{corrected ? (
								<RotateCcw size={14} aria-hidden="true" />
							) : (
								<ArrowRight size={14} aria-hidden="true" />
							)}
							{corrected ? t("reset") : t("apply")}
						</button>
					</div>
				</article>
				<aside className="v4-memory-side">
					<section>
						<h4>{t("tabs.sources")}</h4>
						<ul className="v4-sources">
							{(
								[
									["portfolio", 3],
									["prices", 2],
									["questions", 1],
								] as const
							).map(([key, version]) => (
								<li key={key}>
									<FileText size={15} aria-hidden="true" />
									<span>{t(`sources.${key}`)}</span>
									<small>{t("versionLabel", { n: version })}</small>
								</li>
							))}
						</ul>
					</section>
					<section>
						<h4>{t("teamTitle")}</h4>
						<ul className="v4-next">
							{(["vega", "nico"] as const).map((person) => (
								<li key={person}>
									<AgentAvatar person={person} />
									<span>
										<strong>{person === "vega" ? "Vega" : "Nico"}</strong>
										<span key={state}>{t(`${person}.${state}`)}</span>
									</span>
									{corrected && (
										<Check
											size={14}
											strokeWidth={2.6}
											className="v4-next-check"
											aria-hidden="true"
										/>
									)}
								</li>
							))}
						</ul>
					</section>
				</aside>
			</div>
			<output className="sr-only">{announce}</output>
		</AppWindow>
	);
}
