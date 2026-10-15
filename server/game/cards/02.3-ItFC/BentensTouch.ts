import DrawCard from '../../DrawCard.js';
import { Players, CardType, Trait } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { honor } from '../../GameActions/GameActions.js';

class BentensTouch extends DrawCard {
    static id = 'benten-s-touch';

    override setupCardAbilities() {
        this.action('Bow and Honor a character')
            .cost(costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.isFaction('phoenix') && card.hasTrait(Trait.Shugenja)
            }))
            .target({
                cardType: CardType.Character,
                activePromptTitle: 'Choose a character to honor',
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, honor());
    }
}


export default BentensTouch;
