import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class ForgedEdict extends DrawCard {
    static id = 'forged-edict';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: event => event.card.type === CardType.Event
            })
            .cost(ability.costs.dishonor({ cardCondition: card => card.hasTrait('courtier') }))
            .gameAction(AbilityDsl.actions.cancel())
            .cannotBeMirrored();
    }
}


export default ForgedEdict;
