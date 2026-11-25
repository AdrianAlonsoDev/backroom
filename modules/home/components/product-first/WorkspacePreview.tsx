"use client";

import { AgentAvatar } from "@home/components/AgentAvatar";
import { BrandMark } from "@home/components/BrandMark";
import { ExampleDocument } from "@home/components/ExampleDocument";
import { FrameStatus } from "@home/components/v3/FrameStatus";
import { WorkTile } from "@home/components/v3/WorkTile";
import { Dialog, DialogContent, DialogTrigger } from "@shared/ui/dialog";
import {
	ArrowRight,
	Bell,
	BookOpen,
	CalendarDays,
	Check,
	ChevronDown,
	CircleHelp,
	FileText,
	Home,
	Inbox,
	Link2,
	MessageSquare,
	PanelLeft,
	Plus,
	Search,
	Settings,
	Target,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Fragment, useState } from "react";

const views = ["home", "missions", "knowledge"] as const;
const missionKinds = ["doc", "web", "chat", "research"] as const;
const sourceKinds = ["folder", "spark", "check"] as const;
type View = (typeof views)[number];
const viewIcons = { home: Home, missions: Target, knowledge: BookOpen };

/** A fictional product preview. It calls no backend and runs no agents. */
export function WorkspacePreview() {
	const t = useTranslations("landing.v2.workspace");
	const v3 = useTranslations("landing.v3");
	const locale = useLocale();
	const teamNames = new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format([
		"Clara",
		"Vega",
		"Nico",
	]);
	const [view, setView] = useState<View>("home");
	return (
		<div className="v2-workspace-demo" id="product">
			<p className="sr-only">{t("tag")}</p>
			<FrameStatus />
			<div className="v2-app" data-view={view}>
				<div className="v2-app-bar">
					<span className="v2-app-brand">
						<BrandMark />
						backroom.
						<PanelLeft size={16} />
					</span>
					<span className="v2-app-search">
						<Search size={14} />
						{t("search")}
						<kbd>⌘ K</kbd>
					</span>
					<Bell size={17} className="v2-app-bell" />
				</div>
				<aside className="v2-app-sidebar" aria-label={t("navigation")}>
					<div className="v2-org">
						<span className="v2-org-mark">N</span>
						<span>
							<strong>Norte Studio</strong>
							<small>{t("business")}</small>
						</span>
						<ChevronDown size={14} />
					</div>
					<div className="v2-app-nav">
						{views.map((item) => {
							const Icon = viewIcons[item];
							return (
								<Fragment key={item}>
									<button type="button" aria-pressed={view === item} onClick={() => setView(item)}>
										<Icon size={17} />
										{t(item)}
									</button>
									{item === "missions" && (
										<span>
											<Inbox size={17} />
											{t("forYou")}
											<small className="v2-nav-count">2</small>
										</span>
									)}
								</Fragment>
							);
						})}
						<span>
							<MessageSquare size={17} />
							{t("conversations")}
						</span>
						<span>
							<FileText size={17} />
							{t("documents")}
						</span>
						<span>
							<CalendarDays size={17} />
							{t("agenda")}
						</span>
						<span>
							<Link2 size={17} />
							{t("connections")}
						</span>
					</div>
					<span className="v2-team-label">
						{t("team")}
						<Plus size={13} />
					</span>
					<div className="v2-sidebar-team">
						{(["clara", "vega", "nico"] as const).map((person) => (
							<span key={person}>
								<AgentAvatar person={person} />
								<span>{person[0].toUpperCase() + person.slice(1)}</span>
								<i />
							</span>
						))}
					</div>
					<div className="v2-app-user">
						<span>E</span>
						<div>
							<strong>Elena</strong>
							<small>{t("personal")}</small>
						</div>
						<Settings size={15} />
					</div>
				</aside>
				<div className="v2-app-main" key={view}>
					{view === "home" ? (
						<>
							<div className="v2-app-greeting">
								<span>{t("today")}</span>
								{/* The greeting follows the hero sky: morning by day, evening by night. */}
								<div className="v2-h3">
									<span className="v2-greeting-day">{t("greeting")}</span>
									<span className="v2-greeting-night">{t("greetingNight")}</span>
								</div>
								<p>{t("greetingBody")}</p>
							</div>
							<div className="v2-focus-card">
								<div className="v2-h4">{t("mission")}</div>
								<p>{t("missionBody")}</p>
								<div className="v2-focus-bottom">
									<span className="v2-team-stack">
										<AgentAvatar />
										<AgentAvatar person="vega" />
										<AgentAvatar person="nico" />
										<span>{teamNames}</span>
									</span>
									<button type="button" onClick={() => setView("missions")}>
										{t("viewMission")}
										<ArrowRight size={13} />
									</button>
								</div>
							</div>
							<div className="v2-app-section-label">
								<div className="v2-h4">
									{t("forYou")} <span>2</span>
								</div>
								<CircleHelp size={14} />
							</div>
							<div className="v2-decision-grid">
								<article data-person="vega">
									<span>
										<AgentAvatar person="vega" />
										{t("vegaAsks")}
									</span>
									<div className="v2-h4">{t("promise")}</div>
									<p>{t("promiseBody")}</p>
									<Dialog>
										<DialogTrigger>
											{t("seeOffer")}
											<ArrowRight size={14} />
										</DialogTrigger>
										<DialogContent
											className="landing-dialog example-dialog"
											closeLabel={v3("close")}
										>
											<ExampleDocument kind="offer" />
										</DialogContent>
									</Dialog>
								</article>
								<article data-person="nico">
									<span>
										<AgentAvatar person="nico" />
										{t("nicoAsks")}
									</span>
									<div className="v2-h4">{t("pageReady")}</div>
									<p>{t("pageBody")}</p>
									<Dialog>
										<DialogTrigger>
											{t("seePage")}
											<ArrowRight size={14} />
										</DialogTrigger>
										<DialogContent
											className="landing-dialog example-dialog"
											closeLabel={v3("close")}
										>
											<ExampleDocument kind="website" />
										</DialogContent>
									</Dialog>
								</article>
							</div>
							<div className="v2-app-section-label">
								<div className="v2-h4">
									{t("activeMissions")} <span>2</span>
								</div>
								<span>{t("all")}</span>
							</div>
							<div className="v2-mission-group">
								{(
									[
										["missionTwo", "Nico"],
										["missionThree", "Vega"],
									] as const
								).map(([mission, person]) => (
									<div className="v2-small-mission" key={mission}>
										<WorkTile kind={mission === "missionTwo" ? "web" : "chat"} size="sm" />
										<span>
											{t(mission)}
											<small>
												{person} · {t("inProgress")}
											</small>
										</span>
										<ArrowRight size={14} />
									</div>
								))}
							</div>
						</>
					) : view === "missions" ? (
						<>
							<div className="v2-app-greeting">
								<div className="v2-h3">{t("missions")}</div>
								<p>{t("missionsBody")}</p>
							</div>
							<div className="v2-app-filter">
								<span>
									{t("all")} <b>4</b>
								</span>
								<span>{t("inProgress")}</span>
								<span>{t("forYou")}</span>
							</div>
							<div className="v2-mission-list">
								{["One", "Two", "Three", "Four"].map((item, i) => (
									<div key={item}>
										<WorkTile kind={missionKinds[i]} className="v2-mission-tile" />
										<div>
											<div className="v2-h4">{t(`mission${item}`)}</div>
											<span className="v2-mission-state">
												{t(i === 0 ? "decision" : i === 3 ? "prepared" : "inProgress")}
											</span>
											<small>
												{i === 1 ? "Nico" : i === 2 ? "Vega" : "Clara"} <span>·</span>{" "}
												{t("deliverables", { count: i === 3 ? 0 : 2 })}
											</small>
										</div>
										<span className="v2-mission-code">M-01{i + 2}</span>
									</div>
								))}
							</div>
						</>
					) : (
						<>
							<div className="v2-app-greeting">
								<div className="v2-h3">{t("knowledge")}</div>
								<p>{t("knowledgeBody")}</p>
							</div>
							<div className="v2-knowledge-brief">
								<BookOpen size={22} />
								<span>{t("briefLabel")}</span>
								<div className="v2-h4">{t("briefTitle")}</div>
								<p>{t("briefBody")}</p>
								<span className="v2-knowledge-reviewed">
									<Check size={12} />
									{t("reviewed")}
								</span>
							</div>
							<div className="v2-app-section-label">
								<div className="v2-h4">{t("sources")}</div>
								<span>3</span>
							</div>
							<div className="v2-source-list">
								{["sourceOne", "sourceTwo", "sourceThree"].map((item, i) => (
									<div className="v2-source-row" key={item}>
										<WorkTile kind={sourceKinds[i]} size="sm" />
										<span>
											{t(item)}
											<small>{t(i === 2 ? "yourDecision" : "yourSource")}</small>
										</span>
										<Check size={14} />
									</div>
								))}
							</div>
						</>
					)}
				</div>
				<aside className="v2-app-rail">
					<div className="v2-rail-piece">
						<div className="v2-rail-switch">
							<span>{t("coordination")}</span>
							<span>{t("missions")}</span>
						</div>
						<div className="v2-rail-card">
							<div className="v2-rail-profile">
								<AgentAvatar />
								<div className="v2-h4">Clara</div>
								<p>{t("coordination")}</p>
								<small>
									<i />
									{t("sharedDirection")}
								</small>
							</div>
							<div className="v2-rail-stats">
								<span>
									<strong>4</strong>
									{t("missions")}
								</span>
								<span>
									<strong>2</strong>
									{t("outputs")}
								</span>
							</div>
						</div>
						<div className="v2-rail-block">
							<div className="v2-h5">
								{t("onTheTable")}
								<ArrowRight size={13} />
							</div>
							<span>
								<AgentAvatar person="vega" />
								<span>
									{t("railOne")}
									<small data-state="review">{t("forReview")}</small>
								</span>
							</span>
							<span>
								<AgentAvatar person="nico" />
								<span>
									{t("railTwo")}
									<small data-state="progress">{t("inProgress")}</small>
								</span>
							</span>
						</div>
						<div className="v2-rail-block">
							<div className="v2-h5">
								{t("atHand")}
								<ArrowRight size={13} />
							</div>
							<div className="v2-rail-tools">
								<span>
									<WorkTile kind="doc" size="sm" />
									{t("offer")}
								</span>
								<span>
									<WorkTile kind="book" size="sm" />
									{t("knowledge")}
								</span>
							</div>
						</div>
						<div className="v2-rail-note">
							<MessageSquare size={17} />
							<p>{t("railNote")}</p>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}
