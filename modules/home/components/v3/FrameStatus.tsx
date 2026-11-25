import { Mascot } from "@home/components/v3/Mascot";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

const states = ["research", "compare", "ready"] as const;

/** One teammate's progress on the example workspace. It plays once and rests on the review step. */
export function FrameStatus() {
	const t = useTranslations("landing.v3.hero.status");
	return (
		<div className="v3-frame-status" aria-hidden="true">
			<span className="v3-aura">
				<i />
				<i />
				<i />
			</span>
			<span className="v3-status-pill">
				<Mascot kind="spark" />
				<strong>Vega</strong>
				<span className="v3-status-states">
					{states.map((state) => (
						<span className="v3-status-state" data-state={state} key={state}>
							{state === "ready" ? <Check size={13} strokeWidth={3} aria-hidden="true" /> : null}
							{t(state)}
							{state === "ready" ? null : (
								<span className="v3-typing">
									<i />
									<i />
									<i />
								</span>
							)}
						</span>
					))}
				</span>
			</span>
			<span className="v3-edge" />
		</div>
	);
}
