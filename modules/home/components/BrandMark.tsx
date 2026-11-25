/** Backroom's mark: a door left ajar, with the light of the room behind it. */
export function BrandMark({ className = "" }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
			<path
				d="M8 28V6.5A2.5 2.5 0 0 1 10.5 4h11A2.5 2.5 0 0 1 24 6.5V28"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M5 28h22" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
			{/* The door, with the knob cut out so it works on any background. */}
			<path
				d="M8 4.6 18 7.4v20.6l-10-2.6Z M16.55 17.4a1.25 1.25 0 1 0-2.5 0a1.25 1.25 0 1 0 2.5 0Z"
				fill="currentColor"
				fillRule="evenodd"
			/>
		</svg>
	);
}
