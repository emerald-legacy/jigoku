import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { attach, discardFromPlay, ifAble } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class CallingInFavors extends DrawCard {
    static id = 'calling-in-favors';

    setupCardAbilities() {
        this.action('Take control of an attachment')
            .cost(AbilityDsl.costs.dishonor())
            .target({
                cardType: CardType.Attachment,
                controller: Players.Opponent
            })
            .gameAction(ifAble((context) => ({
                ifAbleAction: attach({
                    target: context.costs.dishonor,
                    attachment: context.target,
                    takeControl: true
                }),
                otherwiseAction: discardFromPlay({ target: context.target })
            })));
    }
}
