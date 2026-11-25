import { ChannelIcon } from "@home/components/ChannelArtwork";
import { AppIcon } from "@home/components/v3/AppIcon";
import { Mascot } from "@home/components/v3/Mascot";

const marks = ["x", "instagram", "youtube", "mail", "calendar"] as const;
type Mark = (typeof marks)[number];

function HeroMark({ mark, copy }: { mark: Mark; copy: number }) {
	if (mark === "x" || mark === "instagram" || mark === "youtube") {
		return (
			<span className={`v2-hero-channel v2-hero-channel-${mark}`}>
				<ChannelIcon channel={mark} />
			</span>
		);
	}
	return (
		<span className="v2-hero-tool">
			<AppIcon kind={mark} id={`v2-hero-${mark}-${copy}`} />
		</span>
	);
}

/** Where the business is seen and the tools it runs on, passing by one at a time. */
export function HeroChannels() {
	return (
		<span className="v2-hero-art v2-hero-channels" aria-hidden="true">
			<span className="v2-hero-reel">
				<span className="v2-hero-reel-track">
					{[0, 1, 2].flatMap((copy) =>
						marks.map((mark) => <HeroMark mark={mark} copy={copy} key={`${mark}-${copy}`} />),
					)}
				</span>
			</span>
		</span>
	);
}

export function HeroTeam() {
	return (
		<span className="v2-hero-art v2-hero-team" aria-hidden="true">
			<span className="v2-hero-teammate v2-hero-teammate-spark">
				<Mascot kind="spark" />
			</span>
			<span className="v2-hero-teammate v2-hero-teammate-maker">
				<Mascot kind="maker" />
			</span>
			<span className="v2-hero-teammate v2-hero-teammate-orbit">
				<Mascot kind="orbit" />
			</span>
		</span>
	);
}
