import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class IAmReady extends DrawCard {
    static id = 'i-am-ready';

    setupCardAbilities() {
        this.action('Ready a character')
            .cost(AbilityDsl.costs.removeFate({
                cardType: CardType.Character,
                cardCondition: card => card.isFaction('unicorn') && card.bowed
            }))
            .handler((context) => AbilityDsl.actions.ready().resolve(context.costs.removeFate, context))
            .effect('ready {1}', (context) => context.costs.removeFate)
            .cannotBeMirrored();
    }
}


export default IAmReady;
