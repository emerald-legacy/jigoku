import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class IAmReady extends DrawCard {
    static id = 'i-am-ready';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Ready a character')
            .cost(ability.costs.removeFate({
                cardType: CardType.Character,
                cardCondition: card => card.isFaction('unicorn') && card.bowed
            }))
            .handler((context) => ability.actions.ready().resolve(context.costs.removeFate as DrawCard, context))
            .effect('ready {1}', (context) => context.costs.removeFate as DrawCard)
            .cannotBeMirrored();
    }
}


export default IAmReady;
