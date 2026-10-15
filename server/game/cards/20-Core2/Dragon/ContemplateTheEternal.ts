import { CardType, Players } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { placeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ContemplateTheEternal extends DrawCard {
    static id = 'contemplate-the-eternal';

    public setupCardAbilities() {
        this.action('Return rings to put fate on character')
            .cost(costs.returnRings())
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) =>
                    !card.bowed && !card.attachments.some((attachment) => !attachment.hasTrait('tattoo'))
            }, placeFate((context) => ({
                amount: context.costs.returnedRings ? context.costs.returnedRings.length : 1
            })));
    }
}
