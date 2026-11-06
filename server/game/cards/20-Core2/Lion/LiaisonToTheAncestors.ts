import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class LiaisonToTheAncestors extends DrawCard {
    static id = 'liaison-to-the-ancestors';

    override setupCardAbilities() {
        this.reaction('Protect the honor of a character')
            .when({
                onCardDishonored: ({ card }, context) =>
                    card.isCharacter() &&
                    card.controller === context.player &&
                    [...context.player.dynastyDiscardPile, ...context.player.conflictDiscardPile].some((discarded) =>
                        discarded.type === CardType.Character && card.costLessThan(discarded.getCost())
                    )
            })
            .honor((context) => ({
                target: context.event.card
            }));
    }
}
