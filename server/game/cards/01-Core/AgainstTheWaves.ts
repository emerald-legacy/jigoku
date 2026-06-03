import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AgainstTheWaves extends DrawCard {
    static id = 'against-the-waves';

    setupCardAbilities() {
        this.action({
            title: 'Bow or ready a shugenja',
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.hasTrait('shugenja'),
                controller: Players.Self,
                gameAction: [AbilityDsl.actions.bow(), AbilityDsl.actions.ready()]
            }
        });
    }
}


export default AgainstTheWaves;
