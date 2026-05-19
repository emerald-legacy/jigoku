import DrawCard from '../../../drawcard.js';
import { CardTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class AsahinaDiviner extends DrawCard {
    static id = 'asahina-diviner';

    setupCardAbilities() {
        this.action({
            title: 'Give a participating character +3 glory',

            max: AbilityDsl.limit.perConflict(1),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source,
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.modifyGlory(3)
                }))
            },
            effect: 'give {0} +3 glory until the end of the conflict'
        });
    }
}

export default AsahinaDiviner;
