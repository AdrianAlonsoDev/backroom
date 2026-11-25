/**
 * Own one scene's visibility resources; CSS owns every keyframe.
 * Loops only run while the node is on screen, the tab is visible and motion is welcome.
 */
export function observeMotion(node: HTMLElement | null) {
	if (!node) return;
	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
	let visible = false;

	function sync() {
		if (!node) return;
		const active = visible && !document.hidden && !reduced.matches;
		node.dataset.motionRunning = String(active);
		if (active) node.dataset.motionReady = "true";
	}

	const observer = new IntersectionObserver(
		([entry]) => {
			visible = Boolean(entry?.isIntersecting);
			sync();
		},
		{ rootMargin: "80px 0px" },
	);
	observer.observe(node);
	document.addEventListener("visibilitychange", sync);
	reduced.addEventListener("change", sync);
	sync();

	return () => {
		observer.disconnect();
		document.removeEventListener("visibilitychange", sync);
		reduced.removeEventListener("change", sync);
		delete node.dataset.motionReady;
		delete node.dataset.motionRunning;
	};
}
