import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class GaijinCustoms extends DrawCard {
    static id = 'gaijin-customs';

    setupCardAbilities() {
        this.action('Ready a non-unicorn character')
            .condition(context => context.player.anyCardsInPlay((card) => card.isFaction('unicorn')) || !!context.player.stronghold && context.player.stronghold.isFaction('unicorn'))
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => !card.isFaction('unicorn')
            }, AbilityDsl.actions.ready());
    }
}


export default GaijinCustoms;
