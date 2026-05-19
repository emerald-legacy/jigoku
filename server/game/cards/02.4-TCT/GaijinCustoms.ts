import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class GaijinCustoms extends DrawCard {
    static id = 'gaijin-customs';

    setupCardAbilities(ability) {
        this.action({
            title: 'Ready a non-unicorn character',
            condition: context => context.player.anyCardsInPlay(card => card.isFaction('unicorn')) || context.player.stronghold && context.player.stronghold.isFaction('unicorn'),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => !card.isFaction('unicorn'),
                gameAction: ability.actions.ready()
            }
        });
    }
}


export default GaijinCustoms;
