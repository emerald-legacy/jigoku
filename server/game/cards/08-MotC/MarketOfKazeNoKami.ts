import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class MarketOfKazeNoKami extends ProvinceCard {
    static id = 'market-of-kaze-no-kami';

    setupCardAbilities() {
        this.reaction('Bow a character')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => !card.isHonored
            }, AbilityDsl.actions.bow());
    }
}
