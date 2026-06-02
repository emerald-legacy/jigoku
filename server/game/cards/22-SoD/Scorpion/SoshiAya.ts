import type { AbilityContext } from '../../../AbilityContext.js';
import type CardAbility from '../../../CardAbility.js';
import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class SoshiAya extends DrawCard {
    static id = 'soshi-aya';
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an ability',
            when: {
                onInitiateAbilityEffects: (event, context) => event.card.type === CardType.Character &&
                    event.card.hasTrait('courtier') && event.card.controller === context.player.opponent &&
                    ((context.event.context as AbilityContext).ability as CardAbility).printedAbility
            },
            cost: AbilityDsl.costs.putSelfIntoPlay(),
            then: {
                gameAction: AbilityDsl.actions.placeFate()
            },
            location: Location.Hand,
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}
