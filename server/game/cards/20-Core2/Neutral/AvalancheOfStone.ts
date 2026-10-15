import { CardType } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';

export default class AvalancheOfStone extends ProvinceCard {
    static id = 'avalanche-of-stone';

    override setupCardAbilities() {
        this.reaction('Bow all characters 2 cost or less')
            .when({ onCardRevealed: (event, context) => event.card === context.source })
            .bow(() => ({
                target: this.game.findAnyCardsInPlay(
                    (card) => card.type === CardType.Character && card.costLessThan(3)
                )
            }));
    }
}
