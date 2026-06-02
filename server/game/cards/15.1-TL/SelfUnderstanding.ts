import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { AbilityType, EventName } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { TriggeredAbilityProps } from '../../Interfaces.js';

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
                    afterConflict: (event: EventPayload<EventName.AfterConflict>, context: any) =>
                        event.conflict.winner === context.source.controller && context.source.isParticipating()
                },
                condition: (context: AbilityContext) => context.player.getClaimedRings().length > 0,
                gameAction: AbilityDsl.actions.resolveRingEffect((context) => ({
                    player: context.player,
                    target: context.player.getClaimedRings()
                })),
                effect: 'resolve all their claimed ring effects'
            } as TriggeredAbilityProps)
        });
    }
}
