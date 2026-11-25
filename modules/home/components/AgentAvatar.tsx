import { Mascot, teammateMascot, type Teammate } from "@home/components/v3/Mascot";

export type { Teammate };

/** Example team identities, shared with the headline. They do not imply live agent status. */
export function AgentAvatar({
	person = "clara",
	className = "",
}: {
	person?: Teammate;
	className?: string;
}) {
	return (
		<span className={`agent-avatar avatar-${person} ${className}`} aria-hidden="true">
			<Mascot kind={teammateMascot[person]} />
		</span>
	);
}
