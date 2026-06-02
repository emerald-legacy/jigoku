import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class Brushfires extends ProvinceCard {
    static id = 'brushfires';

    setupCardAbilities() {
        this.reaction({
            title: 'Remove 2 fate from an attacking character',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking(),
                gameAction: AbilityDsl.actions.removeFate({ amount: 2 })
            }
        });
    }
}
