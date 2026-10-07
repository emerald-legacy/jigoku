import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { setBaseProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class RideThemDown extends DrawCard {
    static id = 'ride-them-down';

    setupCardAbilities() {
        this.action('Reduce province strength')
            .cost(costs.discardImperialFavor())
            .condition(() => this.game.isDuringConflict())
            .selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: card => card.isConflictProvince(),
                message: '{0} reduces the strength of {1} to 1',
                messageArgs: cards => [context.player, cards],
                gameAction: cardLastingEffect({
                    targetLocation: Location.Provinces,
                    effect: setBaseProvinceStrength(1)
                })
            }))
            .effect('reduce the strength of an attacked province to 1');
    }
}


export default RideThemDown;
