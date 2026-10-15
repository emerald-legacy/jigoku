import DrawCard from '../../DrawCard.js';
import { CardType, Players, Trait } from '../../Constants.js';
import { bow, ready } from '../../GameActions/GameActions.js';

class AgainstTheWaves extends DrawCard {
    static id = 'against-the-waves';

    override setupCardAbilities() {
        this.action('Bow or ready a shugenja')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait(Trait.Shugenja),
                controller: Players.Self
            }, bow(), ready());
    }
}


export default AgainstTheWaves;
