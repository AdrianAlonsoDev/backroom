import { BrandMark } from "@home/components/BrandMark";
import {
	BookOpen,
	CalendarDays,
	ChevronRight,
	FileText,
	Home,
	Inbox,
	Link2,
	type LucideIcon,
	MessageSquare,
	Target,
} from "lucide-react";
import type { ReactNode } from "react";

export type Screen =
	| "home"
	| "missions"
	| "forYou"
	| "knowledge"
	| "conversations"
	| "documents"
	| "agenda"
	| "connections";

const screens: Array<[Screen, LucideIcon]> = [
	["home", Home],
	["missions", Target],
	["forYou", Inbox],
	["knowledge", BookOpen],
	["conversations", MessageSquare],
	["documents", FileText],
	["agenda", CalendarDays],
	["connections", Link2],
];

/**
 * The product window every section shows: the hero's app with its navigation collapsed to icons,
 * the current screen marked, and a breadcrumb. Decorative chrome; the screen inside carries meaning.
 */
export function AppWindow({
	screen,
	crumbs,
	actions,
	children,
	className = "",
	rail = true,
}: {
	screen: Screen;
	crumbs: string[];
	actions?: ReactNode;
	children: ReactNode;
	className?: string;
	rail?: boolean;
}) {
	return (
		<div className={`v4-window ${className}`} data-rail={rail || undefined}>
			{rail && (
				<div className="v4-rail" aria-hidden="true">
					<span className="v4-rail-brand">
						<BrandMark />
					</span>
					{screens.map(([key, Icon]) => (
						<span key={key} className="v4-rail-item" data-active={key === screen || undefined}>
							<Icon size={17} />
							{key === "forYou" && <i />}
						</span>
					))}
					<span className="v4-rail-user">E</span>
				</div>
			)}
			<div className="v4-body">
				<div className="v4-bar">
					<span className="v4-crumbs">
						{crumbs.map((crumb, i) => (
							<span key={crumb} data-current={i === crumbs.length - 1 || undefined}>
								{i > 0 && <ChevronRight size={13} aria-hidden="true" />}
								{crumb}
							</span>
						))}
					</span>
					{actions && <span className="v4-bar-actions">{actions}</span>}
				</div>
				<div className="v4-panel">{children}</div>
			</div>
		</div>
	);
}

/** What the window shows, and whether it already works: one chip per capability. */
export function StateChips({
	items,
	labels,
}: {
	items: Array<[name: string, state: "live" | "building" | "later"]>;
	labels: Record<"live" | "building" | "later", string>;
}) {
	return (
		<ul className="v4-states">
			{items.map(([name, state]) => (
				<li key={name} data-state={state}>
					<i aria-hidden="true" />
					<span>{name}</span>
					<span className="v4-states-value">{labels[state]}</span>
				</li>
			))}
		</ul>
	);
}
