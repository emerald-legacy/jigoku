import { placeFate } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class GoodOmen extends DrawCard {
    static id = 'good-omen';

    override setupCardAbilities() {
        this.action('Add a fate to a character')
            .condition((context) => !!context.player.opponent && context.player.showBid < context.player.opponent.showBid)
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => (card.getCost() ?? 0) > 2
            }, placeFate());
    }
}


export default GoodOmen;
