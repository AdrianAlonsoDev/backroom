import type { Tone } from "@home/components/v3/WorkTile";
import type { ReactNode } from "react";

/** Eyebrow chip, two-tone title and lead: the single heading system below the hero. */
export function SectionHeading({
	id,
	number,
	eyebrow,
	title,
	soft,
	lead,
	tone,
	align = "left",
	className = "",
}: {
	id: string;
	number?: string;
	eyebrow: string;
	title: ReactNode;
	soft?: ReactNode;
	lead?: ReactNode;
	tone?: Tone;
	align?: "left" | "center" | "split";
	className?: string;
}) {
	return (
		<header className={`v3-heading v3-reveal ${className}`} data-align={align}>
			<span className="v3-eyebrow" data-tone={tone}>
				{number && <i>{number}</i>}
				{eyebrow}
			</span>
			<h2 id={id}>
				<span>{title}</span>
				{soft && <span className="v3-soft">{soft}</span>}
			</h2>
			{lead && <p className="v3-lead">{lead}</p>}
		</header>
	);
}
