import { useId } from "react";

/*
 * Backroom's mark: a door left open, with the warm light of the room behind it.
 * Drawn on a 32 grid. The tile follows the theme through `.brand-mark-tile` and `.brand-mark-edge`.
 */
const TILE = "M8 0h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V8a8 8 0 0 1 8-8Z";
const FRAME = "M9 6.5h11v19H9Z";
const DOOR = "M14.2 8.6 23 6v20l-8.8-2.6Z";
// The frame and the door together, and the frame without the door, for the one-colour mark.
const OPENING = "M9 6.5h11v.386L23 6v20l-3-.886v.386H9Z";
const SHADOW = "M9 6.5h11v.386L14.2 8.6v14.8l5.8 1.714v.386H9Z";

export function BrandMark({
	className = "",
	variant = "color",
}: {
	className?: string;
	/** "mono" draws the mark in currentColor only, with the light cut out. */
	variant?: "color" | "mono";
}) {
	const id = useId();
	if (variant === "mono") return <BrandMarkMono className={className} />;
	return <BrandMarkArt className={className} gradientId={`${id}-light`} />;
}

function BrandMarkMono({ className }: { className: string }) {
	return (
		<svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
			<path d={`${TILE}${OPENING}`} fillRule="evenodd" />
			<path d={SHADOW} opacity="0.35" />
		</svg>
	);
}

/** The colour mark without hooks, for places with no React tree such as the share image. */
export function BrandMarkArt({
	className = "",
	gradientId,
	onDark = false,
}: {
	className?: string;
	gradientId: string;
	/** Lifts the tile for dark backgrounds where CSS cannot reach, such as the share image. */
	onDark?: boolean;
}) {
	return (
		<svg className={`brand-mark ${className}`} viewBox="0 0 32 32" aria-hidden="true">
			<defs>
				<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#ffd98a" />
					<stop offset="1" stopColor="#ff9a2a" />
				</linearGradient>
			</defs>
			<path className="brand-mark-tile" d={TILE} fill={onDark ? "#262931" : "#15171c"} />
			<rect
				className="brand-mark-edge"
				x="0.5"
				y="0.5"
				width="31"
				height="31"
				rx="7.5"
				fill="none"
				stroke="#ffffff"
				strokeOpacity={onDark ? 0.12 : 0}
			/>
			<path d={FRAME} fill="#3a2a17" />
			<path d={DOOR} fill={`url(#${gradientId})`} />
		</svg>
	);
}
