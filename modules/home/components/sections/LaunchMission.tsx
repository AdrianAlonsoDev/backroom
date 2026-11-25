"use client";

import { AgentAvatar } from "@home/components/AgentAvatar";
import { ChannelIcon } from "@home/components/ChannelArtwork";
import { AppWindow } from "@home/components/sections/AppWindow";
import {
	BarChart2,
	Bell,
	BookOpen,
	Bookmark,
	Check,
	Heart,
	MessageCircle,
	MoreHorizontal,
	Paperclip,
	Play,
	Plus,
	Repeat,
	Repeat2,
	Send,
	Target,
	Undo2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

type Week = "now" | "later";
type State = "published" | "waiting" | "scheduled" | "preparing";

/**
 * A distribution mission as it will look: one goal and one piece per channel. "Esta semana" shows the
 * work and the one approval it needs; "Una semana después" shows what each piece brought and what the
 * team keeps for the next ones.
 */
export function LaunchMission() {
	const t = useTranslations("landing.v4.launch");
	const w = useTranslations("landing.v2.workspace");
	const [week, setWeek] = useState<Week>("now");
	const [approved, setApproved] = useState(false);
	const [planned, setPlanned] = useState(false);
	const [kept, setKept] = useState(true);
	const later = week === "later";
	const igState: State = later ? "published" : approved ? "scheduled" : "waiting";
	return (
		<>
			<fieldset className="v4-weeks">
				<legend className="sr-only">{t("tabs.label")}</legend>
				{(["now", "later"] as const).map((item) => (
					<button
						key={item}
						type="button"
						aria-pressed={week === item}
						onClick={() => setWeek(item)}
					>
						{t(`tabs.${item}`)}
					</button>
				))}
			</fieldset>
			<AppWindow
				screen="missions"
				crumbs={[w("missions")]}
				className="v4-mission-window"
				actions={
					<>
						<span className="v4-stack">
							<AgentAvatar />
							<AgentAvatar person="vega" />
							<AgentAvatar person="nico" />
						</span>
						<Bell size={16} aria-hidden="true" />
					</>
				}
			>
				<div className="v4-mission-head">
					<div className="v4-mission-name">
						<h3>{t("mission")}</h3>
						<p className="v4-goal">
							<Target size={15} aria-hidden="true" />
							<span>{t("goalLabel")}</span>
							<strong>{t("goal")}</strong>
						</p>
						<p className="v4-goal-meter" data-week={week}>
							<span className="v4-goal-bar" aria-hidden="true">
								<i />
							</span>
							<span className="v4-goal-count" key={week}>
								{later ? t("progressLater") : t("progress")}
							</span>
						</p>
					</div>
					<span className="v4-chip">
						<Repeat size={13} aria-hidden="true" />
						{t("repeat")}
					</span>
				</div>
				<div className="v4-pieces" data-week={week}>
					<article className="v4-piece" data-channel="x">
						<PieceHead
							channel="x"
							name="X"
							when={t("x.when")}
							state="published"
							label={t("x.state")}
						/>
						<div className="v4-preview v4-x">
							<div className="v4-x-author">
								<span className="v4-norte">n.</span>
								<span>
									<strong>Norte Studio</strong>
									<small key={week}>
										{t("x.handle")} · {later ? t("x.agoLater") : t("x.ago")}
									</small>
								</span>
								<ChannelIcon channel="x" className="v4-x-logo" />
							</div>
							<p>{t("x.text")}</p>
							<p>{t("x.textTwo")}</p>
							<div className="v4-x-stats" aria-hidden="true" key={week}>
								<span>
									<MessageCircle size={14} />
									{later ? t("x.later.replies") : t("x.replies")}
								</span>
								<span>
									<Repeat2 size={15} />
									{later ? t("x.later.reposts") : t("x.reposts")}
								</span>
								<span>
									<Heart size={14} />
									{later ? t("x.later.likes") : t("x.likes")}
								</span>
								<span>
									<BarChart2 size={14} />
									{later ? t("x.later.views") : t("x.views")}
								</span>
							</div>
						</div>
						<Metrics
							key={week}
							one={[later ? t("x.later.valueOne") : t("x.valueOne"), t("x.metricOne")]}
							two={[later ? t("x.later.valueTwo") : t("x.valueTwo"), t("x.metricTwo")]}
						/>
						<Used text={t("x.used")} />
					</article>

					<article className="v4-piece" data-channel="instagram">
						<PieceHead
							channel="instagram"
							name="Instagram"
							when={t("instagram.when")}
							state={igState}
							label={
								later
									? t("instagram.publishedState")
									: approved
										? t("instagram.scheduledState")
										: t("instagram.state")
							}
						/>
						<div className="v4-preview v4-ig">
							<div className="v4-ig-head">
								<span className="v4-ig-ring">
									<span className="v4-norte">n.</span>
								</span>
								<strong>nortestudio</strong>
								<MoreHorizontal size={16} aria-hidden="true" />
							</div>
							<div className="v4-ig-media">
								<Image
									src="/images/landing/norte-soma-concept.webp"
									alt=""
									fill
									sizes="(max-width: 760px) 80vw, 320px"
								/>
								<span className="v4-ig-count">1/5</span>
							</div>
							<div className="v4-ig-actions" aria-hidden="true">
								<Heart size={17} />
								<MessageCircle size={17} />
								<Send size={17} />
								<span className="v4-ig-dots">
									<i />
									<i />
									<i />
									<i />
									<i />
								</span>
								<Bookmark size={17} />
							</div>
							<p className="v4-ig-caption">
								<strong>nortestudio</strong> {t("instagram.caption")}
							</p>
						</div>
						{later ? (
							<Metrics
								one={[t("instagram.later.valueOne"), t("instagram.later.metricOne")]}
								two={[t("instagram.later.valueTwo"), t("instagram.later.metricTwo")]}
							/>
						) : approved ? (
							<div className="v4-piece-foot">
								<output className="v4-scheduled">
									<Check size={15} strokeWidth={2.6} aria-hidden="true" />
									<span>{t("instagram.scheduled")}</span>
									<button type="button" onClick={() => setApproved(false)}>
										<Undo2 size={13} aria-hidden="true" />
										{t("instagram.undo")}
									</button>
								</output>
							</div>
						) : (
							<div className="v4-piece-foot">
								<div className="v4-actions">
									<button type="button" className="v4-primary" onClick={() => setApproved(true)}>
										{t("instagram.approve")}
									</button>
									<button type="button" className="v4-secondary">
										{t("instagram.changes")}
									</button>
								</div>
							</div>
						)}
						<Used text={t("instagram.used")} />
					</article>

					<article className="v4-piece" data-channel="youtube">
						<PieceHead
							channel="youtube"
							name="YouTube"
							when={t("youtube.when")}
							state={later ? "published" : "preparing"}
							label={later ? t("youtube.publishedState") : t("youtube.state")}
						/>
						<div className="v4-preview v4-yt">
							<div className="v4-yt-thumb">
								<Image
									src="/images/landing/founder-creator.webp"
									alt=""
									fill
									sizes="(max-width: 760px) 80vw, 320px"
								/>
								<span className="v4-yt-cover">{t("youtube.cover")}</span>
								{later && (
									<>
										<span className="v4-yt-play" aria-hidden="true">
											<Play size={15} fill="currentColor" />
										</span>
										<span className="v4-yt-time">{t("youtube.duration")}</span>
									</>
								)}
							</div>
							<div className="v4-yt-meta">
								<span className="v4-norte">n.</span>
								<span>
									<strong>{t("youtube.title")}</strong>
									<small key={week}>
										{later ? t("youtube.later.meta") : `Norte Studio · ${t("youtube.draft")}`}
									</small>
								</span>
							</div>
						</div>
						{later ? (
							<Metrics
								one={[t("youtube.later.valueOne"), t("youtube.later.metricOne")]}
								two={[t("youtube.later.valueTwo"), t("youtube.later.metricTwo")]}
							/>
						) : (
							<div className="v4-piece-foot v4-progress">
								<AgentAvatar person="nico" />
								<span>
									<strong>{t("youtube.step")}</strong>
									<small>{t("youtube.stepCount")}</small>
								</span>
							</div>
						)}
						<Used text={t("youtube.used")} />
					</article>
				</div>
				<div className="v4-insight" key={week}>
					<AgentAvatar person="vega" />
					<p>
						<strong>Vega · {later ? t("insight.laterLabel") : t("insight.label")}</strong>
						<span>{later ? t("insight.laterText") : t("insight.text")}</span>
					</p>
					{later ? (
						<span className="v4-insight-actions">
							{kept && (
								<span className="v4-saved">
									<BookOpen size={13} aria-hidden="true" />
									{t("insight.saved")}
								</span>
							)}
							<button
								type="button"
								className="v4-secondary"
								aria-pressed={!kept}
								onClick={() => setKept(!kept)}
							>
								{kept ? (
									<Undo2 size={13} aria-hidden="true" />
								) : (
									<Plus size={13} aria-hidden="true" />
								)}
								{kept ? t("insight.undo") : t("insight.save")}
							</button>
						</span>
					) : (
						<button
							type="button"
							aria-pressed={planned}
							onClick={() => setPlanned(!planned)}
							className="v4-secondary"
						>
							{planned ? (
								<Check size={14} strokeWidth={2.6} aria-hidden="true" />
							) : (
								<Plus size={14} aria-hidden="true" />
							)}
							{planned ? t("insight.added") : t("insight.action")}
						</button>
					)}
				</div>
			</AppWindow>
		</>
	);
}

function PieceHead({
	channel,
	name,
	when,
	state,
	label,
}: {
	channel: "x" | "instagram" | "youtube";
	name: string;
	when: string;
	state: State;
	label: string;
}) {
	return (
		<header className="v4-piece-head">
			<span className="v4-channel-dot" data-channel={channel} aria-hidden="true">
				<ChannelIcon channel={channel} />
			</span>
			<span className="v4-piece-name">
				<strong>{name}</strong>
				<small>{when}</small>
			</span>
			<span className="v4-state" data-state={state} key={state}>
				<i aria-hidden="true" />
				{label}
			</span>
		</header>
	);
}

function Metrics({ one, two }: { one: [string, string]; two: [string, string] }) {
	return (
		<div className="v4-piece-foot v4-metrics">
			<span>
				<strong>{one[0]}</strong>
				{one[1]}
			</span>
			<span>
				<strong>{two[0]}</strong>
				{two[1]}
			</span>
			<svg className="v4-spark" viewBox="0 0 72 24" aria-hidden="true" focusable="false">
				<path
					className="v4-spark-area"
					d="M0 22 L0 19 C10 18 14 15 22 15 S34 9 42 10 54 4 62 4 70 2 72 2 L72 22 Z"
				/>
				<path
					className="v4-spark-line"
					pathLength={1}
					d="M0 19 C10 18 14 15 22 15 S34 9 42 10 54 4 62 4 70 2 72 2"
				/>
			</svg>
		</div>
	);
}

function Used({ text }: { text: string }) {
	return (
		<p className="v4-used">
			<Paperclip size={13} aria-hidden="true" />
			{text}
		</p>
	);
}
