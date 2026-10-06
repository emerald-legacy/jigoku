import { CardType } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { bow } from '../../../GameActions/GameActions.js';

export default class AvalancheOfStone extends ProvinceCard {
    static id = 'avalanche-of-stone';

    setupCardAbilities() {
        this.reaction('Bow all characters 2 cost or less')
            .when({ onCardRevealed: (event, context) => event.card === context.source })
            .gameAction(bow(() => ({
                target: this.game.findAnyCardsInPlay(
                    (card) => card.getType() === CardType.Character && card.costLessThan(3)
                )
            })));
    }
}
