import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { immunity } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class ScholarOfOldRempet extends DrawCard {
    static id = 'scholar-of-old-rempet';

    setupCardAbilities() {
        this.action('Make character immune to events')
            .cost(costs.payHonor(1))
            .condition(() => this.game.isDuringConflict())
            .target({
                cardType: CardType.Character,
                cardCondition: card => !card.isUnique()
            }, cardLastingEffect({
                effect: immunity({ restricts: 'events' })
            }))
            .effect('make {0} immune to events');
    }
}


export default ScholarOfOldRempet;
