import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { removeFate } from '../../GameActions/GameActions.js';

export default class Brushfires extends ProvinceCard {
    static id = 'brushfires';

    setupCardAbilities() {
        this.reaction('Remove 2 fate from an attacking character')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, removeFate({ amount: 2 }));
    }
}
