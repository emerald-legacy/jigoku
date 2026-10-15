import { CardType, Element } from '../../../Constants.js';
import { ready } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class RejuvenatingVapors extends DrawCard {
    static id = 'rejuvenating-vapors';

    setupCardAbilities() {
        this.action('Ready a character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    context.player.hasAffinity(Element.Water, context) || card.hasTrait('shugenja')
            }, ready());
    }
}
