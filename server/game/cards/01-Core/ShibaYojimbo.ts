import DrawCard from '../../DrawCard.js';
import { Location, Trait } from '../../Constants.js';

class ShibaYojimbo extends DrawCard {
    static id = 'shiba-yojimbo';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel ability')
            .when({
                onInitiateAbilityEffects: (event, context) => event.context.ability.isTriggeredAbility() && event.cardTargets.some((card) => (
                    card.hasTrait(Trait.Shugenja) && card.controller === context.player && card.location === Location.PlayArea)
                )
            })
            .cancel();
    }
}


export default ShibaYojimbo;
