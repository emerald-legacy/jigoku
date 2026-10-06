import DrawCard from '../../DrawCard.js';
import { cancel } from '../../GameActions/GameActions.js';
import { Location } from '../../Constants.js';

class ShibaYojimbo extends DrawCard {
    static id = 'shiba-yojimbo';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel ability')
            .when({
                onInitiateAbilityEffects: (event, context) => event.context.ability.isTriggeredAbility() && event.cardTargets.some(card => (
                    card.hasTrait('shugenja') && card.controller === context.player && card.location === Location.PlayArea)
                )
            })
            .gameAction(cancel());
    }
}


export default ShibaYojimbo;
