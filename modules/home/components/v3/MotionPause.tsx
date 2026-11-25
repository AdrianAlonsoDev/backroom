"use client";

import { Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

/** One page-level control for every looping animation (WCAG 2.2.2). */
export function MotionPause() {
	const t = useTranslations("landing.v3");
	const [paused, setPaused] = useState(false);
	return (
		<button
			type="button"
			className="v3-motion-pause"
			onClick={(event) => {
				const next = !paused;
				setPaused(next);
				event.currentTarget
					.closest(".landing-v3")
					?.setAttribute("data-motion-paused", String(next));
			}}
		>
			{paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
			<span>{t(paused ? "resumeAll" : "pauseAll")}</span>
		</button>
	);
}
