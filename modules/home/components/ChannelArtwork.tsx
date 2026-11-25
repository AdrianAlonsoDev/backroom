export type Channel = "x" | "instagram" | "youtube";
export const channels: Channel[] = ["x", "instagram", "youtube"];
export const channelNames: Record<Channel, string> = {
	x: "X",
	instagram: "Instagram",
	youtube: "YouTube",
};

export function ChannelIcon({ channel, className = "" }: { channel: Channel; className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
			{channel === "x" && (
				<path
					fill="currentColor"
					d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.5 5.4 22H2.2l8.3-9.5L2.8 2h6.4l4.6 6.9L18.9 2ZM17.9 20h1.7L8.1 4H6.3l11.6 16Z"
				/>
			)}
			{channel === "instagram" && (
				<>
					<rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
					<circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
					<circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
				</>
			)}
			{channel === "youtube" && (
				<>
					<rect x="2" y="5" width="20" height="14" rx="4.5" fill="currentColor" />
					<path d="m10 9 6 3-6 3V9Z" fill="var(--channel-play,#101315)" />
				</>
			)}
		</svg>
	);
}
