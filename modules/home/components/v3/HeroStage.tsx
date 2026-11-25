import { type FloatingKind, FloatingIcon } from "@home/components/v3/FloatingIcon";
import { Mascot } from "@home/components/v3/Mascot";
import { MotionPause } from "@home/components/v3/MotionPause";
import { getTranslations } from "next-intl/server";

/** Three depths per side: far behind the clouds, mid beside the product, near and out of focus. */
const floaters = [
	["mail", "left", "far"],
	["folder", "left", "mid"],
	["notes", "left", "near"],
	["sheet", "right", "far"],
	["doc", "right", "mid"],
	["calendar", "right", "near"],
] as const satisfies ReadonlyArray<
	readonly [FloatingKind, "left" | "right", "far" | "mid" | "near"]
>;

/** Kinds of work drifting around the product, never live connections. */
export function HeroFloaters() {
	return (
		<div className="v3-floaters" aria-hidden="true">
			{floaters.map(([kind, side, depth]) => (
				<span className="v3-float" data-side={side} data-depth={depth} data-kind={kind} key={kind}>
					<FloatingIcon kind={kind} id={`v3-float-${kind}`} />
				</span>
			))}
		</div>
	);
}

const requests = [
	["hooks", "vega"],
	["script", "nico"],
	["review", "clara"],
	["research", "vega"],
	["recap", "clara"],
	["email", "nico"],
	["pricing", "vega"],
	["questions", "clara"],
	["carousel", "nico"],
	["week", "clara"],
	["angles", "vega"],
	["compare", "nico"],
] as const;
const toneOf = { clara: "orbit", vega: "spark", nico: "maker" } as const;

/** Example requests in the visitor's own words, moving in two opposite rows. */
export async function RequestMarquee() {
	const t = await getTranslations("landing.v3.requests");
	const rows = [requests.slice(0, 6), requests.slice(6)];
	return (
		<div className="v3-requests">
			<p className="v3-requests-label">
				<span>{t("label")}</span>
				<span className="v3-tag">{t("tag")}</span>
				<MotionPause />
			</p>
			<ul className="sr-only">
				{requests.map(([key]) => (
					<li key={key}>{t(`items.${key}`)}</li>
				))}
			</ul>
			{rows.map((row, index) => (
				<div className="v3-marquee" data-direction={index ? "reverse" : "forward"} key={index}>
					<div className="v3-marquee-track" aria-hidden="true">
						{[...row, ...row].map(([key, person], i) => (
							<span className="v3-request" key={`${key}-${i}`}>
								<Mascot kind={toneOf[person]} />
								{t(`items.${key}`)}
							</span>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
