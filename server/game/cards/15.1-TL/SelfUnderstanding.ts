import { cardCannot, gainAbility } from '../../effects.js';
import { resolveRingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { RestrictionType, RestrictionScope } from '../../Constants.js';

export default class SelfUnderstanding extends DrawCard {
    static id = 'self-understanding';

    setupCardAbilities() {
        this.persistentEffect({
            effect: cardCannot({
                cannot: RestrictionType.Target,
                appliesTo: RestrictionScope.OpponentsEvents,
                source: this
            })
        });

        this.whileAttached({
            effect: gainAbility.reaction('Resolve all claimed ring effects', {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            }, (ability) => ability
                .gameAction(resolveRingEffect((context) => ({
                    player: context.player,
                    target: context.player.getClaimedRings()
                })))
                .chatText('resolve all their claimed ring effects'))
        });
    }
}
