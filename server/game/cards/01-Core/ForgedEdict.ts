import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class ForgedEdict extends DrawCard {
    static id = 'forged-edict';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: event => event.card.type === CardType.Event
            },
            cannotBeMirrored: true,
            cost: ability.costs.dishonor({ cardCondition: card => card.hasTrait('courtier') }),
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default ForgedEdict;
