import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShepherdOfVisages extends DrawCard {
    static id = 'shepherd-of-visages';

    setupCardAbilities() {
        this.action({
            title: 'Give a participating character -2 glory',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.modifyGlory(-2)
                }))
            },
            effect: 'give {0} -2 glory until the end of the conflict'
        });
    }
}

export default ShepherdOfVisages;
