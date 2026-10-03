import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AgainstTheWaves extends DrawCard {
    static id = 'against-the-waves';

    setupCardAbilities() {
        this.action('Bow or ready a shugenja')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.hasTrait('shugenja'),
                controller: Players.Self
            }, AbilityDsl.actions.bow(), AbilityDsl.actions.ready());
    }
}


export default AgainstTheWaves;
