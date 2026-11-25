import { MotionScope } from "@home/components/v3/MotionScope";

/**
 * The hero's sky: one light source per theme. Day is a clear morning over a bank of cumulus;
 * night is dark and almost empty: the same clouds as silhouettes and a few dim stars.
 * Everything here is decorative and hidden from assistive technology.
 */

type Star = { x: number; y: number; r: number; o: number; twinkle: boolean };

/** Deterministic star field: many faint stars, a few bright ones, thinning towards the horizon. */
function makeStars(count: number, seed: number): Star[] {
	let state = seed;
	const random = () => {
		state = (state * 1664525 + 1013904223) % 4294967296;
		return state / 4294967296;
	};
	const stars: Star[] = [];
	for (let i = 0; i < count; i++) {
		const x = random() * 1600;
		const y = random() ** 1.6 * 640;
		const magnitude = random() ** 3.2;
		stars.push({
			x: Math.round(x * 10) / 10,
			y: Math.round(y * 10) / 10,
			r: Math.round((0.45 + magnitude * 1.25) * 100) / 100,
			o: Math.round((0.28 + magnitude * 0.62) * (1 - (y / 640) * 0.55) * 100) / 100,
			twinkle: magnitude > 0.38 && i % 3 === 0,
		});
	}
	return stars;
}

const stars = makeStars(150, 20261007);

export function HeroSky() {
	return (
		<MotionScope className="v3-sky" aria-hidden="true">
			<svg className="v3-stars" viewBox="0 0 1600 640" preserveAspectRatio="xMidYMin slice">
				{stars.map((star, i) => (
					<circle
						key={i}
						cx={star.x}
						cy={star.y}
						r={star.r}
						opacity={star.o}
						className={star.twinkle ? "v3-star-twinkle" : undefined}
						style={star.twinkle ? { animationDelay: `${(i % 7) * -1.3}s` } : undefined}
					/>
				))}
			</svg>
		</MotionScope>
	);
}

/** The cumulus bank the product rests in. The art is pre-rendered; the theme picks the light. */
export function HeroClouds() {
	return (
		<div className="v3-clouds" aria-hidden="true">
			<span className="v3-clouds-layer" />
		</div>
	);
}
