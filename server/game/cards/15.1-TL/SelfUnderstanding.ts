import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, EventName } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
export default class SelfUnderstanding extends DrawCard {
    static id = 'self-understanding';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'target',
                restricts: 'opponentsEvents',
                source: this
            })
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Resolve all claimed ring effects',
                when: {
                    afterConflict: (event: EventPayload<EventName.AfterConflict>, context) =>
                        event.conflict.winner === context.source.controller && context.source.isParticipating()
                },
                gameAction: AbilityDsl.actions.resolveRingEffect((context) => ({
                    player: context.player,
                    target: context.player.getClaimedRings()
                })),
                effect: 'resolve all their claimed ring effects'
            })
        });
    }
}
