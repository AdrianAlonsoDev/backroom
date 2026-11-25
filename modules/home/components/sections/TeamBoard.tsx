"use client";

import { AgentAvatar, type Teammate } from "@home/components/AgentAvatar";
import { ExampleDocument, type ExampleKind } from "@home/components/ExampleDocument";
import { AppWindow } from "@home/components/sections/AppWindow";
import { Dialog, DialogContent, DialogTrigger } from "@shared/ui/dialog";
import { ArrowUp, ArrowUpRight, Bell, Check, Link2, Paperclip, Plus, Target } from "lucide-react";
import { useTranslations } from "next-intl";

type Column = "todo" | "running" | "review" | "done";
type Card = {
	key: "content" | "email" | "page" | "list" | "offer" | "promise" | "research" | "tone" | "brief";
	who: Teammate;
	doc?: ExampleKind;
};

/** A task board folded into the four columns a founder needs. */
const board: Array<[Column, Card[]]> = [
	[
		"todo",
		[
			{ key: "content", who: "clara" },
			{ key: "email", who: "nico" },
		],
	],
	[
		"running",
		[
			{ key: "page", who: "nico" },
			{ key: "list", who: "vega" },
		],
	],
	[
		"review",
		[
			{ key: "offer", who: "nico", doc: "offer" },
			{ key: "promise", who: "vega" },
		],
	],
	[
		"done",
		[
			{ key: "research", who: "vega", doc: "research" },
			{ key: "tone", who: "clara" },
			{ key: "brief", who: "clara" },
		],
	],
];

/** Ask in one sentence; Clara turns it into a mission the team works on in the open. */
export function TeamBoard() {
	const t = useTranslations("landing.v4.team");
	const w = useTranslations("landing.v2.workspace");
	const v3 = useTranslations("landing.v3");
	return (
		<AppWindow
			screen="missions"
			crumbs={[w("missions")]}
			className="v4-team-window"
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
			<div className="v4-team">
				<aside className="v4-thread" aria-label="Clara">
					<header className="v4-thread-head">
						<AgentAvatar />
						<span>
							<strong>Clara</strong>
							<small>{t("role")}</small>
						</span>
					</header>
					<div className="v4-thread-body">
						<p className="v4-bubble">{t("prompt")}</p>
						<div className="v4-turn">
							<p className="v4-activity">
								<Check size={13} strokeWidth={2.6} aria-hidden="true" />
								{t("read")}
							</p>
							<div className="v4-question">
								<span>{t("question")}</span>
								<strong>
									<Check size={13} strokeWidth={2.6} aria-hidden="true" />
									{t("answer")}
								</strong>
							</div>
							<p className="v4-reply">{t("reply")}</p>
							<span className="v4-created">
								<Target size={14} aria-hidden="true" />
								<span>
									<small>{t("created")}</small>
									{t("mission")}
								</span>
							</span>
						</div>
					</div>
					<div className="v4-composer" aria-hidden="true">
						<Plus size={15} />
						<span>{t("composer")}</span>
						<ArrowUp size={15} />
					</div>
				</aside>
				<div className="v4-board-area">
					<div className="v4-board-head">
						<h3>{t("mission")}</h3>
						<p className="v4-goal">
							<Target size={15} aria-hidden="true" />
							<strong>{t("goal")}</strong>
						</p>
					</div>
					<div className="v4-board">
						{board.map(([column, cards]) => (
							<section key={column} className="v4-column" data-column={column}>
								<h4>
									<i aria-hidden="true" />
									{t(`columns.${column}`)}
									<span>{cards.length}</span>
								</h4>
								{cards.map((card) => (
									<BoardCard
										key={card.key}
										card={card}
										column={column}
										title={t(`cards.${card.key}.title`)}
										meta={t(`cards.${card.key}.meta`)}
										open={t("open")}
										close={v3("close")}
									/>
								))}
							</section>
						))}
					</div>
				</div>
			</div>
		</AppWindow>
	);
}

function BoardCard({
	card,
	column,
	title,
	meta,
	open,
	close,
}: {
	card: Card;
	column: Column;
	title: string;
	meta: string;
	open: string;
	close: string;
}) {
	const body = (
		<>
			<strong>{title}</strong>
			<span className="v4-card-foot">
				<AgentAvatar person={card.who} />
				<small>
					{card.key === "content" && <Link2 size={12} aria-hidden="true" />}
					{card.doc && <Paperclip size={12} aria-hidden="true" />}
					{meta}
				</small>
				{column === "running" && (
					<span className="v4-typing" aria-hidden="true">
						<i />
						<i />
						<i />
					</span>
				)}
				{card.doc && <ArrowUpRight size={14} className="v4-card-open" aria-hidden="true" />}
			</span>
		</>
	);
	if (!card.doc) return <article className="v4-card">{body}</article>;
	return (
		<Dialog>
			<DialogTrigger className="v4-card" aria-label={`${open}: ${title}`}>
				{body}
			</DialogTrigger>
			<DialogContent className="landing-dialog example-dialog" closeLabel={close}>
				<ExampleDocument kind={card.doc} />
			</DialogContent>
		</Dialog>
	);
}
