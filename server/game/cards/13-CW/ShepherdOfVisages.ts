import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { modifyGlory } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class ShepherdOfVisages extends DrawCard {
    static id = 'shepherd-of-visages';

    setupCardAbilities() {
        this.action('Give a participating character -2 glory')
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, cardLastingEffect(() => ({
                effect: modifyGlory(-2)
            })))
            .effect('give {0} -2 glory until the end of the conflict');
    }
}

export default ShepherdOfVisages;
