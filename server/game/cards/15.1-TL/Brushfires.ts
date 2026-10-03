import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class Brushfires extends ProvinceCard {
    static id = 'brushfires';

    setupCardAbilities() {
        this.reaction('Remove 2 fate from an attacking character')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, AbilityDsl.actions.removeFate({ amount: 2 }));
    }
}
