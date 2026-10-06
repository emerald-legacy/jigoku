import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { modifyGlory } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';

class AsahinaDiviner extends DrawCard {
    static id = 'asahina-diviner';

    setupCardAbilities() {
        this.conflictAction('Give a participating character +3 glory', { evenFromHome: true })
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            }, cardLastingEffect({
                effect: modifyGlory(3)
            }))
            .effect('give {0} +3 glory until the end of the conflict')
            .max(AbilityDsl.limit.perConflict(1));
    }
}

export default AsahinaDiviner;
