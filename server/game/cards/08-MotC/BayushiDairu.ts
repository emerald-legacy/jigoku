import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class BayushiDairu extends DrawCard {
    static id = 'bayushi-dairu';

    setupCardAbilities() {
        this.action('Move a status token to this character')
            .condition(context => context.source.isParticipating())
            .tokenTarget('target', {
                cardType: CardType.Character,
                cardCondition: (card, context) => card !== context.source
            }, AbilityDsl.actions.moveStatusToken((context) => ({ recipient: context.source })));
    }
}


export default BayushiDairu;
