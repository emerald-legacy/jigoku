import type { AbilityContext } from '../../../AbilityContext.js';
import type CardAbility from '../../../CardAbility.js';
import { CardTypes, Locations } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class SoshiAya extends DrawCard {
    static id = 'soshi-aya';
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an ability',
            when: {
                onInitiateAbilityEffects: (event, context) => event.card.type === CardTypes.Character &&
                    event.card.hasTrait('courtier') && event.card.controller === context.player.opponent &&
                    ((context.event.context as AbilityContext).ability as CardAbility).printedAbility
            },
            cost: AbilityDsl.costs.putSelfIntoPlay(),
            then: {
                gameAction: AbilityDsl.actions.placeFate()
            },
            location: Locations.Hand,
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}
