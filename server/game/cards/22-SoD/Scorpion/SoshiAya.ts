import { CardType, Location, Trait } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import DrawCard from '../../../DrawCard.js';

export default class SoshiAya extends DrawCard {
    static id = 'soshi-aya';
    override setupCardAbilities() {
        this.wouldInterrupt('Cancel an ability')
            .when({
                onInitiateAbilityEffects: (event, context) => event.card.type === CardType.Character &&
                    event.card.hasTrait(Trait.Courtier) && event.card.controller === context.player.opponent &&
                    event.context.ability.isCardAbility() && !!event.context.ability.printedAbility
            })
            .location(Location.Hand)
            .cost(costs.putSelfIntoPlay())
            .cancel()
            .then()
            .placeFate();
    }
}
