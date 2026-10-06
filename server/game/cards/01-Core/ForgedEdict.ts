import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { cancel } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class ForgedEdict extends DrawCard {
    static id = 'forged-edict';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: event => event.card.type === CardType.Event
            })
            .cost(AbilityDsl.costs.dishonor({ cardCondition: card => card.hasTrait('courtier') }))
            .gameAction(cancel())
            .cannotBeMirrored();
    }
}


export default ForgedEdict;
