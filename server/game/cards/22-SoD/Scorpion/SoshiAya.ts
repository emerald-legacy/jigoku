import CardAbility from '../../../CardAbility.js';
import { CardType, Location } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import DrawCard from '../../../DrawCard.js';

export default class SoshiAya extends DrawCard {
    static id = 'soshi-aya';
    setupCardAbilities() {
        this.wouldInterrupt('Cancel an ability')
            .when({
                onInitiateAbilityEffects: (event, context) => event.card.type === CardType.Character &&
                    event.card.hasTrait('courtier') && event.card.controller === context.player.opponent &&
                    event.context.ability instanceof CardAbility && event.context.ability.printedAbility
            })
            .cost(costs.putSelfIntoPlay())
            .cancel()
            .location(Location.Hand)
            .then()
            .placeFate();
    }
}
