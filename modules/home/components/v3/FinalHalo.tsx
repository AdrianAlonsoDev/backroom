import { ChannelIcon } from "@home/components/ChannelArtwork";
import { FloatingIcon } from "@home/components/v3/FloatingIcon";
import { Mascot } from "@home/components/v3/Mascot";

/** Objects hug the band's edges and leave the centre for the question and the form. */
export function FinalHalo() {
	return (
		<div className="v3-halo" aria-hidden="true">
			<span className="v3-halo-item" data-slot="1">
				<Mascot kind="spark" />
			</span>
			<span className="v3-halo-item" data-slot="2">
				<FloatingIcon kind="doc" id="v3-halo-doc" />
			</span>
			<span className="v3-halo-item v3-halo-channel" data-slot="3" data-channel="instagram">
				<ChannelIcon channel="instagram" />
			</span>
			<span className="v3-halo-item" data-slot="4">
				<Mascot kind="orbit" />
			</span>
			<span className="v3-halo-item" data-slot="5">
				<FloatingIcon kind="calendar" id="v3-halo-calendar" />
			</span>
			<span className="v3-halo-item v3-halo-channel" data-slot="6" data-channel="x">
				<ChannelIcon channel="x" />
			</span>
			<span className="v3-halo-item" data-slot="7">
				<Mascot kind="maker" />
			</span>
			<span className="v3-halo-item v3-halo-channel" data-slot="8" data-channel="youtube">
				<ChannelIcon channel="youtube" />
			</span>
		</div>
	);
}
