export type FloatingKind =
	| "folder"
	| "mail"
	| "notes"
	| "sheet"
	| "doc"
	| "calendar"
	| "memory"
	| "permission"
	| "account";

/** A superellipse (n = 5): the soft square of an app icon, drawn once for every body. */
function superellipse(center: number, radius: number, steps = 96) {
	const points: string[] = [];
	for (let i = 0; i < steps; i++) {
		const angle = (i / steps) * Math.PI * 2;
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		const x = center + radius * Math.sign(cos) * Math.abs(cos) ** 0.4;
		const y = center + radius * Math.sign(sin) * Math.abs(sin) ** 0.4;
		points.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
	}
	return `M${points.join("L")}Z`;
}

const body = superellipse(60, 54);

/** Top and bottom of each body's vertical gradient. */
const tones: Record<Exclude<FloatingKind, "folder">, [string, string]> = {
	mail: ["#72b2ff", "#1c5fe2"],
	notes: ["#fffdf8", "#f1ebdc"],
	sheet: ["#4bd88b", "#108047"],
	doc: ["#ff9a85", "#e3402c"],
	calendar: ["#ffffff", "#f1efeb"],
	// The hero's three guarantees share one warm black set, apart from the coloured work objects.
	memory: ["#3d3428", "#14110c"],
	permission: ["#3d3428", "#14110c"],
	account: ["#3d3428", "#14110c"],
};

/** Original, detailed objects for the kinds of work around the product. Decorative only. */
export function FloatingIcon({ kind, id }: { kind: FloatingKind; id: string }) {
	if (kind === "folder") return <Folder id={id} />;
	const [top, bottom] = tones[kind];
	const light = kind === "notes" || kind === "calendar";
	return (
		<svg className="v3-floating-icon" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
			<defs>
				<linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={top} />
					<stop offset="1" stopColor={bottom} />
				</linearGradient>
				<linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#fff" stopOpacity={light ? 0.7 : 0.32} />
					<stop offset="0.5" stopColor="#fff" stopOpacity="0" />
				</linearGradient>
				<linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#fff" stopOpacity="0.75" />
					<stop offset="0.45" stopColor="#fff" stopOpacity="0" />
					<stop offset="1" stopColor="#241f17" stopOpacity={light ? 0.14 : 0.22} />
				</linearGradient>
				<clipPath id={`${id}-clip`}>
					<path d={body} />
				</clipPath>
				<filter id={`${id}-drop`} x="-25%" y="-25%" width="150%" height="160%">
					<feDropShadow
						dx="0"
						dy="2.5"
						stdDeviation="2.4"
						floodColor="#2a241b"
						floodOpacity="0.2"
					/>
				</filter>
			</defs>
			<path d={body} fill={`url(#${id}-body)`} />
			<g clipPath={`url(#${id}-clip)`}>
				<Glyph kind={kind} id={id} />
				<path d={body} fill={`url(#${id}-sheen)`} />
				<path d={body} fill="none" stroke={`url(#${id}-rim)`} strokeWidth="3" />
			</g>
		</svg>
	);
}

function Glyph({ kind, id }: { kind: Exclude<FloatingKind, "folder">; id: string }) {
	const drop = `url(#${id}-drop)`;
	switch (kind) {
		case "mail":
			return (
				<g filter={drop}>
					<rect x="23" y="35" width="74" height="52" rx="9" fill="#fff" />
					<path
						d="M27 41 60 66l33-25"
						fill="none"
						stroke="#a9c3ef"
						strokeWidth="3.4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="m28 82 21-19m43 19L71 63"
						stroke="#d3e0f6"
						strokeWidth="3"
						strokeLinecap="round"
					/>
				</g>
			);
		case "notes":
			return (
				<>
					<rect x="0" y="0" width="120" height="33" fill="#ffbb3d" />
					<rect x="0" y="27" width="120" height="6" fill="#f0a020" />
					{[24, 36, 48, 60, 72, 84, 96].map((x) => (
						<circle key={x} cx={x} cy="40" r="1.6" fill="#ddd4c2" />
					))}
					<rect x="22" y="57" width="52" height="13" rx="4" fill="#ffdf86" />
					{[
						[52, 96],
						[64, 88],
						[76, 96],
						[88, 70],
					].map(([y, end]) => (
						<path
							key={y}
							d={`M26 ${y}H${end}`}
							stroke={y === 64 ? "#8f877a" : "#cfc7b6"}
							strokeWidth="3.4"
							strokeLinecap="round"
						/>
					))}
				</>
			);
		case "sheet":
			return (
				<g filter={drop}>
					<rect x="25" y="25" width="70" height="70" rx="9" fill="#fff" />
					<path d="M25 34a9 9 0 0 1 9-9h52a9 9 0 0 1 9 9v8H25Z" fill="#c4f0d6" />
					<path d="M25 59h70M25 77h70M49 25v70M72 25v70" stroke="#bfe0cc" strokeWidth="2" />
					<rect x="49" y="59" width="23" height="18" fill="#e7f8ee" />
					<rect
						x="49"
						y="59"
						width="23"
						height="18"
						rx="1.5"
						fill="none"
						stroke="#17a35a"
						strokeWidth="3"
					/>
				</g>
			);
		case "doc":
			return (
				<g filter={drop}>
					<path
						d="M36 21h33l20 20v51a8 8 0 0 1-8 8H36a8 8 0 0 1-8-8V29a8 8 0 0 1 8-8Z"
						fill="#fff"
					/>
					<path d="M69 21v13a7 7 0 0 0 7 7h13Z" fill="#ffd2c8" />
					<path d="M38 50h22" stroke="#f0533f" strokeWidth="4.6" strokeLinecap="round" />
					{[62, 72, 82].map((y, i) => (
						<path
							key={y}
							d={`M38 ${y}H${i === 2 ? 64 : 79}`}
							stroke="#f6b8ac"
							strokeWidth="3.4"
							strokeLinecap="round"
						/>
					))}
				</g>
			);
		case "memory":
			return (
				<g filter={drop}>
					<path d="M60 40c-8-6-20-7-32-5v49c12-2 24-1 32 5Z" fill="#fff" />
					<path d="M60 40c8-6 20-7 32-5v49c-12-2-24-1-32 5Z" fill="#f8f6f3" />
					<path
						d="M36 52h15M36 61h15M36 70h11M69 52h15M69 61h15"
						stroke="#f5e1bf"
						strokeWidth="3.4"
						strokeLinecap="round"
					/>
					<path d="M77 34h9v19l-4.5-4-4.5 4Z" fill="#ffca6f" />
				</g>
			);
		case "permission":
			return (
				<g filter={drop}>
					<path d="M60 25 89 36v22c0 18-12 30-29 37-17-7-29-19-29-37V36Z" fill="#fff" />
					<path
						d="m47 60 9 9 18-19"
						fill="none"
						stroke="#815a15"
						strokeWidth="6.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</g>
			);
		case "account":
			return (
				<g filter={drop} transform="rotate(-38 60 60)">
					<circle cx="38" cy="60" r="17" fill="#fff" />
					<circle cx="38" cy="60" r="6.5" fill="#684811" />
					<rect x="50" y="54.5" width="44" height="11" rx="5.5" fill="#fff" />
					<rect x="78" y="62" width="8" height="13" rx="2.5" fill="#fff" />
					<rect x="66" y="62" width="7" height="9" rx="2.5" fill="#fff" />
				</g>
			);
		case "calendar":
			return (
				<>
					<defs>
						<linearGradient id={`${id}-head`} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="#ff7a64" />
							<stop offset="1" stopColor="#e9452f" />
						</linearGradient>
					</defs>
					<rect x="0" y="0" width="120" height="38" fill={`url(#${id}-head)`} />
					<circle cx="42" cy="22" r="3.4" fill="#fff" fillOpacity="0.9" />
					<circle cx="78" cy="22" r="3.4" fill="#fff" fillOpacity="0.9" />
					<text
						x="60"
						y="92"
						textAnchor="middle"
						fontSize="46"
						fontWeight="600"
						letterSpacing="-2"
						fill="#2c2821"
					>
						22
					</text>
				</>
			);
	}
}

/** The folder is its own object: back panel with a tab, papers, and a lit front. */
function Folder({ id }: { id: string }) {
	return (
		<svg className="v3-floating-icon" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
			<defs>
				<linearGradient id={`${id}-back`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#f6a623" />
					<stop offset="1" stopColor="#d27304" />
				</linearGradient>
				<linearGradient id={`${id}-front`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#ffd776" />
					<stop offset="1" stopColor="#ffa828" />
				</linearGradient>
				<filter id={`${id}-drop`} x="-25%" y="-25%" width="150%" height="160%">
					<feDropShadow
						dx="0"
						dy="-1.5"
						stdDeviation="2.2"
						floodColor="#8a4a00"
						floodOpacity="0.28"
					/>
				</filter>
			</defs>
			<path
				d="M8 31a9 9 0 0 1 9-9h26.5a8 8 0 0 1 5.7 2.4l6 6.1a8 8 0 0 0 5.7 2.4H103a9 9 0 0 1 9 9v55a9 9 0 0 1-9 9H17a9 9 0 0 1-9-9Z"
				fill={`url(#${id}-back)`}
			/>
			<rect
				x="19"
				y="36"
				width="78"
				height="52"
				rx="4"
				fill="#f2ede2"
				transform="rotate(4 58 62)"
			/>
			<rect x="21" y="34" width="78" height="52" rx="4" fill="#fff" transform="rotate(-3 60 60)" />
			<path
				d="M31 47h40M31 55h52"
				stroke="#e2dccd"
				strokeWidth="3"
				strokeLinecap="round"
				transform="rotate(-3 60 60)"
			/>
			<g filter={`url(#${id}-drop)`}>
				<path
					d="M8 55a9 9 0 0 1 9-9h86a9 9 0 0 1 9 9v41a10 10 0 0 1-10 10H18a10 10 0 0 1-10-10Z"
					fill={`url(#${id}-front)`}
				/>
			</g>
			<path
				d="M15 49.5h90"
				stroke="#fff"
				strokeOpacity="0.7"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	);
}
