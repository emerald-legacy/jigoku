import type { AbilityContext } from '../AbilityContext.js';
import type Player from '../Player.js';
import type { PromptControl } from '../PlayerPromptState.js';
import { Event } from '../Events/Event.js';

interface ControlSource {
    getShortSummary(): unknown;
}

interface ControlTarget {
    getShortSummaryForControls(player: Player): unknown;
}

export function targetingControl(source: ControlSource, targets: readonly ControlTarget[], player: Player): PromptControl {
    return {
        type: 'targeting',
        source: source.getShortSummary(),
        targets: targets.map((target) => target.getShortSummaryForControls(player))
    };
}

/** The targets, or the card of the context's event when there are none. */
export function targetsOrEventCard<Target extends ControlTarget>(context: AbilityContext, targets: readonly Target[]): readonly ControlTarget[] {
    const eventCard = Event.promptCardOf('event' in context ? context.event : undefined);
    return targets.length === 0 && eventCard ? [eventCard] : targets;
}
