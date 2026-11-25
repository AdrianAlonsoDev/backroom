"use client";

import { AgentAvatar } from "@home/components/AgentAvatar";
import { ChannelIcon } from "@home/components/ChannelArtwork";
import { BatteryFull, CalendarDays, Check, Inbox, Lock, Signal, Undo2, Wifi } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

/** Para ti on the phone: what needs you, and what the team moved forward without you. */
export function ForYouPhone() {
	const t = useTranslations("landing.v4.foryou");
	const [allowed, setAllowed] = useState(false);
	return (
		<div className="v4-phone">
			<div className="v4-phone-screen">
				<div className="v4-phone-status" aria-hidden="true">
					<span>9:41</span>
					<span className="v4-phone-island" />
					<span>
						<Signal size={12} />
						<Wifi size={12} />
						<BatteryFull size={16} />
					</span>
				</div>
				<header className="v4-phone-head">
					<Inbox size={18} aria-hidden="true" />
					<strong>{t("title2")}</strong>
					<span className="v4-phone-count">{allowed ? 1 : 2}</span>
				</header>
				<div className="v4-inbox">
					<article className="v4-ask" data-kind="permission">
						<header>
							<AgentAvatar person="nico" />
							<span>
								<strong>Nico</strong>
								<small>
									{t("kinds.permission")} · {t("permission.when")}
								</small>
							</span>
							<Lock size={14} className="v4-ask-icon" aria-hidden="true" />
						</header>
						<strong className="v4-ask-title">
							<span className="v4-channel-dot" data-channel="instagram" aria-hidden="true">
								<ChannelIcon channel="instagram" />
							</span>
							{t("permission.title")}
						</strong>
						<small className="v4-ask-meta">
							{t("permission.detail")} · {t("permission.scope")}
						</small>
						{allowed ? (
							<output className="v4-ask-done">
								<Check size={14} strokeWidth={2.6} aria-hidden="true" />
								<span>{t("permission.done")}</span>
								<button type="button" onClick={() => setAllowed(false)}>
									<Undo2 size={12} aria-hidden="true" />
									{t("permission.undo")}
								</button>
							</output>
						) : (
							<div className="v4-ask-actions">
								<button type="button" className="v4-primary" onClick={() => setAllowed(true)}>
									{t("permission.allow")}
								</button>
								<button type="button" className="v4-secondary">
									{t("permission.deny")}
								</button>
							</div>
						)}
					</article>
					<article className="v4-ask" data-kind="agenda">
						<header>
							<AgentAvatar />
							<span>
								<strong>Clara</strong>
								<small>
									{t("kinds.agenda")} · {t("agenda.when")}
								</small>
							</span>
							<CalendarDays size={14} className="v4-ask-icon" aria-hidden="true" />
						</header>
						<strong className="v4-ask-title">{t("agenda.title")}</strong>
						<small className="v4-ask-meta">{t("agenda.body")}</small>
					</article>
					<section className="v4-meanwhile">
						<h4>{t("meanwhile.title")}</h4>
						<ul>
							<li>
								<AgentAvatar person="vega" />
								<span>{t("meanwhile.vega")}</span>
								<Check size={13} strokeWidth={2.6} aria-hidden="true" />
							</li>
							<li>
								<AgentAvatar person="nico" />
								<span>{t("meanwhile.nico")}</span>
								<i className="v4-typing" aria-hidden="true">
									<i />
									<i />
									<i />
								</i>
							</li>
						</ul>
					</section>
				</div>
			</div>
		</div>
	);
}
