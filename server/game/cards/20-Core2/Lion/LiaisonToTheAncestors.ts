import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class LiaisonToTheAncestors extends DrawCard {
    static id = 'liaison-to-the-ancestors';

    setupCardAbilities() {
        this.reaction('Protect the honor of a character')
            .when({
                onCardDishonored: ({ card }, context) =>
                    card.isCharacter() &&
                    card.controller === context.player &&
                    context.player.dynastyDiscardPile.some(
                        (discarded) => (card.printedCost ?? 0) < (discarded.printedCost ?? 0)
                    )
            })
            .gameAction(AbilityDsl.actions.honor((context) => ({
                target: context.event.card
            })));
    }
}
