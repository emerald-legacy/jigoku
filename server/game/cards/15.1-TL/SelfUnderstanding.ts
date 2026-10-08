import { cardCannot, gainAbility } from '../../effects.js';
import { resolveRingEffect } from '../../GameActions/GameActions.js';
import { AbilityType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class SelfUnderstanding extends DrawCard {
    static id = 'self-understanding';

    setupCardAbilities() {
        this.persistentEffect({
            effect: cardCannot({
                cannot: 'target',
                restricts: 'opponentsEvents',
                source: this
            })
        });

        this.whileAttached({
            effect: gainAbility(AbilityType.Reaction, {
                title: 'Resolve all claimed ring effects',
                when: {
                    afterConflict: (event, context) =>
                        event.conflict.winner === context.source.controller && context.source.isParticipating()
                },
                gameAction: resolveRingEffect((context) => ({
                    player: context.player,
                    target: context.player.getClaimedRings()
                })),
                chatText: 'resolve all their claimed ring effects'
            })
        });
    }
}
