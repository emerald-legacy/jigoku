import { CardType, Players } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import DrawCard from '../../../DrawCard.js';

export default class CallingInFavors extends DrawCard {
    static id = 'calling-in-favors';

    setupCardAbilities() {
        this.action('Take control of an attachment')
            .cost(costs.dishonor())
            .target({
                cardType: CardType.Attachment,
                controller: Players.Opponent
            })
            .ifAble()
            .attach((context) => ({
                target: context.costs.dishonor,
                attachment: context.target,
                takeControl: true
            }))
            .otherwise()
            .discardFromPlay((context) => ({ target: context.target }));
    }
}
