import DrawCard from '../../DrawCard.js';
import { moveStatusToken } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class BayushiDairu extends DrawCard {
    static id = 'bayushi-dairu';

    setupCardAbilities() {
        this.action('Move a status token to this character')
            .condition(context => context.source.isParticipating())
            .tokenTarget({
                cardType: CardType.Character,
                cardCondition: (card, context) => card !== context.source
            }, moveStatusToken((context) => ({ recipient: context.source })));
    }
}


export default BayushiDairu;
