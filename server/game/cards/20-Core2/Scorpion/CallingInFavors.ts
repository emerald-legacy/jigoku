import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import DrawCard from '../../../DrawCard.js';

export default class CallingInFavors extends DrawCard {
    static id = 'calling-in-favors';

    setupCardAbilities() {
        this.action({
            title: 'Take control of an attachment',
            cost: AbilityDsl.costs.dishonor(),
            target: {
                cardType: CardType.Attachment,
                controller: Players.Opponent
            },
            gameAction: AbilityDsl.actions.ifAble((context: AbilityContext<DrawCard, DrawCard>) => ({
                ifAbleAction: AbilityDsl.actions.attach({
                    target: context.costs.dishonor as DrawCard,
                    attachment: context.target,
                    takeControl: true
                }),
                otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.target })
            }))
        });
    }
}
