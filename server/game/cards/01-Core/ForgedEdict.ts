import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class ForgedEdict extends DrawCard {
    static id = 'forged-edict';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: event => event.card.type === CardTypes.Event
            },
            cannotBeMirrored: true,
            cost: ability.costs.dishonor({ cardCondition: card => card.hasTrait('courtier') }),
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default ForgedEdict;
