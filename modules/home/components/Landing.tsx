import { BrandMark } from "@home/components/BrandMark";
import { EarlyAccessForm } from "@home/components/EarlyAccessForm";
import { HeroChannels, HeroTeam } from "@home/components/HeroHeadlineArtwork";
import { WorkspacePreview } from "@home/components/product-first/WorkspacePreview";
import { StateChips } from "@home/components/sections/AppWindow";
import { ContextMemory } from "@home/components/sections/ContextMemory";
import { ForYouPhone } from "@home/components/sections/ForYouPhone";
import { LaunchMission } from "@home/components/sections/LaunchMission";
import { TeamBoard } from "@home/components/sections/TeamBoard";
import { FinalHalo } from "@home/components/v3/FinalHalo";
import { FloatingIcon } from "@home/components/v3/FloatingIcon";
import { HeroClouds, HeroSky } from "@home/components/v3/HeroSky";
import { HeroFloaters, RequestMarquee } from "@home/components/v3/HeroStage";
import { MotionScope } from "@home/components/v3/MotionScope";
import { SectionHeading } from "@home/components/v3/SectionHeading";
import { LocaleLink } from "@i18n/routing";
import { ArrowDown, ArrowRight, Check, Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function Landing() {
	const t = await getTranslations("landing");
	const v = await getTranslations("landing.v2");
	const v3 = await getTranslations("landing.v3");
	const v4 = await getTranslations("landing.v4");
	const states = {
		live: v4("states.live"),
		building: v4("states.building"),
		later: v4("states.later"),
	};
	return (
		<div className="site-landing landing-v2 landing-v3">
			<section className="v2-hero v3-hero" aria-labelledby="hero-title">
				<HeroSky />
				<MotionScope className="v2-hero-copy cl-container">
					<h1 id="hero-title">
						<span className="v2-hero-line">
							{v.rich("hero.titleA", {
								growth: (words) => (
									<span className="v2-hero-phrase">
										<HeroChannels />
										{words}
									</span>
								),
							})}
						</span>{" "}
						<span className="v2-hero-line v2-hero-line-accent">
							{v.rich("hero.titleB", {
								team: (words) => (
									<span className="v2-hero-phrase">
										<HeroTeam />
										{words}
									</span>
								),
								you: (words) => <span className="v2-hero-you">{words}</span>,
							})}
						</span>
					</h1>
					<div className="v3-hero-deck">
						<p className="v3-hero-lead">{v("hero.lead")}</p>
						<div className="v2-hero-actions">
							<a className="cl-button primary" href="#early-access">
								{t("cta")}
								<ArrowRight size={16} />
							</a>
							<a className="v2-text-link" href="#launch">
								{v("hero.secondary")}
								<ArrowDown size={15} />
							</a>
						</div>
						<ul className="v3-hero-trust">
							{(
								[
									["memory", "memory"],
									["control", "permission"],
									["account", "account"],
								] as const
							).map(([key, icon]) => (
								<li key={key}>
									<FloatingIcon kind={icon} id={`v3-trust-${key}`} />
									{v(`hero.trust.${key}`)}
								</li>
							))}
						</ul>
					</div>
				</MotionScope>
				<MotionScope className="v3-hero-stage">
					<HeroFloaters />
					<HeroClouds />
					<div className="v2-product-frame">
						<WorkspacePreview />
					</div>
					<RequestMarquee />
				</MotionScope>
			</section>

			<section className="v3-stage v4-launch" id="launch" aria-labelledby="launch-title">
				<div className="cl-container">
					<SectionHeading
						id="launch-title"
						number="01"
						tone="coral"
						align="center"
						eyebrow={v4("launch.eyebrow")}
						title={v4("launch.title")}
						soft={v4("launch.soft")}
						lead={v4("launch.lead")}
					/>
					<MotionScope className="v4-showcase">
						<LaunchMission />
						<div className="v4-showcase-states">
							<StateChips
								labels={states}
								items={[
									[v4("launch.chips.missions"), "building"],
									[v4("launch.chips.publish"), "later"],
								]}
							/>
						</div>
					</MotionScope>
				</div>
			</section>

			<section className="v3-section v4-team-section" id="team" aria-labelledby="team-title">
				<div className="cl-container">
					<SectionHeading
						id="team-title"
						number="02"
						tone="amber"
						align="split"
						eyebrow={v4("team.eyebrow")}
						title={v4("team.title")}
						soft={v4("team.soft")}
						lead={v4("team.lead")}
					/>
					<MotionScope className="v4-showcase v3-reveal-late">
						<TeamBoard />
						<div className="v4-showcase-states">
							<StateChips
								labels={states}
								items={[
									[v4("team.chips.chat"), "live"],
									[v4("team.chips.missions"), "building"],
								]}
							/>
						</div>
					</MotionScope>
				</div>
			</section>

			<section className="v4-split-section" id="context" aria-labelledby="context-title">
				<div className="cl-container v4-split">
					<div className="v4-split-copy">
						<SectionHeading
							id="context-title"
							number="03"
							tone="teal"
							eyebrow={v4("context.eyebrow")}
							title={v4("context.title")}
							soft={v4("context.soft")}
							lead={v4("context.lead")}
						/>
						<ul className="v4-facts v3-reveal">
							{(["sources", "fix", "own"] as const).map((key) => (
								<li key={key}>{v4(`context.facts.${key}`)}</li>
							))}
						</ul>
						<StateChips labels={states} items={[[v4("context.chip"), "live"]]} />
					</div>
					<MotionScope className="v4-split-visual v3-reveal-late" data-glow="dawn">
						<ContextMemory />
					</MotionScope>
				</div>
			</section>

			<section className="v4-split-section" id="control" aria-labelledby="foryou-title">
				<div className="cl-container v4-split" data-flip="true">
					<div className="v4-split-copy">
						<SectionHeading
							id="foryou-title"
							number="04"
							tone="coral"
							eyebrow={v4("foryou.eyebrow")}
							title={v4("foryou.title")}
							soft={v4("foryou.soft")}
							lead={v4("foryou.lead")}
						/>
						<ul className="v4-facts v3-reveal">
							{(["permission", "weekly", "wait"] as const).map((key) => (
								<li key={key}>{v4(`foryou.facts.${key}`)}</li>
							))}
						</ul>
						<StateChips
							labels={states}
							items={[
								[v4("foryou.chip"), "building"],
								[v4("foryou.chipPublish"), "later"],
							]}
						/>
					</div>
					<MotionScope className="v4-split-visual v3-reveal-late" data-glow="dusk">
						<ForYouPhone />
					</MotionScope>
				</div>
			</section>

			<section className="v3-section v3-faq" id="faq" aria-labelledby="faq-title">
				<div className="cl-container v3-faq-grid">
					<div className="v3-faq-aside">
						<SectionHeading
							id="faq-title"
							eyebrow={v3("faq.eyebrow")}
							title={t("faq.title")}
							lead={t("faq.description")}
						/>
					</div>
					<div className="v3-faq-list">
						{["one", "two", "three", "four", "five", "seven", "six"].map((key) => (
							<details key={key} name="faq">
								<summary>
									{t(`faq.${key}.q`)}
									<span className="v3-faq-icon" aria-hidden="true">
										<Plus size={18} />
									</span>
								</summary>
								<p>
									{key === "seven"
										? t.rich("faq.seven.a", {
												privacy: (chunks) => (
													<LocaleLink href="/legal/privacy-policy">{chunks}</LocaleLink>
												),
											})
										: t(`faq.${key}.a`)}
								</p>
							</details>
						))}
					</div>
				</div>
			</section>

			<section className="v3-final" id="early-access" aria-labelledby="final-title">
				<MotionScope className="v3-final-band">
					<FinalHalo />
					<div className="cl-container v3-final-grid">
						<div className="v3-final-copy">
							<span className="v3-final-eyebrow">
								<BrandMark />
								{v3("final.eyebrow")}
							</span>
							<h2 id="final-title">
								<span>{v3("final.title")}</span>
								<span className="v3-final-soft">{v3("final.soft")}</span>
							</h2>
							<p>{v("final.body")}</p>
							<ul className="v3-final-assurance">
								{(["noCard", "noCommitment", "light"] as const).map((key) => (
									<li key={key}>
										<Check size={15} strokeWidth={2.6} aria-hidden="true" />
										{v3(`final.${key}`)}
									</li>
								))}
							</ul>
						</div>
						<div className="signup-card v3-signup">
							<EarlyAccessForm />
						</div>
					</div>
				</MotionScope>
			</section>
		</div>
	);
}
