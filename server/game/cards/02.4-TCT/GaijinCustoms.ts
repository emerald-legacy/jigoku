import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { controlsClanCard } from '../controlsClanCard.js';
import { ready } from '../../GameActions/GameActions.js';

class GaijinCustoms extends DrawCard {
    static id = 'gaijin-customs';

    override setupCardAbilities() {
        this.action('Ready a non-unicorn character')
            .ifCondition((context) => controlsClanCard(context.player, 'unicorn'))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => !card.isFaction('unicorn')
            }, ready());
    }
}


export default GaijinCustoms;
