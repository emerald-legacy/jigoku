import AbilityDsl from '../../abilitydsl.js';
import { Durations, EventNames } from '../../Constants.js';
import DrawCard from '../../drawcard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
export default class PrivilegedPosition extends DrawCard {
    static id = 'privileged-position';

    public setupCardAbilities() {
        this.reaction({
            title: 'Your opponent may only declare 1 conflict opportunity this turn',
            when: {
                onHonorDialsRevealed: (event: EventPayload<EventNames.OnHonorDialsRevealed>, context) =>
                    event.isHonorBid &&
                    context.player.opponent !== undefined &&
                    context.player.honorBid < context.player.opponent.honorBid
            },
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                duration: Durations.UntilEndOfRound,
                targetController: context.player.opponent,
                effect: AbilityDsl.effects.setMaxConflicts(1)
            })),
            effect: 'limit {1} to a single conflict this turn',
            effectArgs: (context) => [context.player.opponent ?? context.player]
        });
    }
}
