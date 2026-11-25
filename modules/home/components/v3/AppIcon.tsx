export type AppKind = "mail" | "calendar";

const squircle = "M14 2h20c8 0 12 4 12 12v20c0 8-4 12-12 12H14C6 46 2 42 2 34V14C2 6 6 2 14 2Z";

/** Background of each app-style icon: top and bottom of a vertical gradient. */
const backgrounds: Record<AppKind, [string, string]> = {
	mail: ["#5d9dff", "#1b58d0"],
	calendar: ["#ffffff", "#eef0f4"],
};

/** Original app-style icons for kinds of work. They name things, never a real product or a connection. */
export function AppIcon({ kind, id }: { kind: AppKind; id: string }) {
	const background = backgrounds[kind];
	return (
		<svg
			className="v3-app-icon"
			viewBox="0 0 48 48"
			fill="none"
			aria-hidden="true"
			focusable="false"
		>
			<defs>
				<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={background[0]} />
					<stop offset="1" stopColor={background[1]} />
				</linearGradient>
			</defs>
			<path d={squircle} fill={`url(#${id})`} />
			{kind === "calendar" ? <path d={squircle} stroke="#15171c" strokeOpacity="0.08" /> : null}
			<Glyph kind={kind} />
		</svg>
	);
}

function Glyph({ kind }: { kind: AppKind }) {
	switch (kind) {
		case "mail":
			return (
				<>
					<rect x="10" y="14" width="28" height="20" rx="3.5" fill="#fff" />
					<path
						d="m11.5 16.5 12.5 9.5 12.5-9.5"
						stroke="#1b58d0"
						strokeWidth="2.4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</>
			);
		case "calendar":
			return (
				<>
					<path d="M2 14C2 6 6 2 14 2h20c8 0 12 4 12 12v1H2Z" fill="#ff6b57" />
					<circle cx="17" cy="9" r="1.8" fill="#fff" />
					<circle cx="31" cy="9" r="1.8" fill="#fff" />
					{[0, 1, 2].map((column) =>
						[0, 1].map((row) => (
							<rect
								key={`${column}-${row}`}
								x={12 + column * 9}
								y={21 + row * 9}
								width="6"
								height="6"
								rx="1.6"
								fill={column === 1 && row === 0 ? "#26c9a8" : "#c9ced8"}
							/>
						)),
					)}
				</>
			);
	}
}
