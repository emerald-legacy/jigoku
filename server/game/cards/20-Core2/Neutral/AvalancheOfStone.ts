import { CardTypes } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import type DrawCard from '../../../drawcard.js';

export default class AvalancheOfStone extends ProvinceCard {
    static id = 'avalanche-of-stone';

    setupCardAbilities() {
        this.reaction({
            title: 'Bow all characters 2 cost or less',
            when: { onCardRevealed: (event, context) => event.card === context.source },
            gameAction: AbilityDsl.actions.bow(() => ({
                target: this.game.findAnyCardsInPlay(
                    (card: DrawCard) => card.getType() === CardTypes.Character && card.costLessThan(3)
                )
            }))
        });
    }
}
