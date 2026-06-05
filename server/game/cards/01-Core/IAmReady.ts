import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class IAmReady extends DrawCard {
    static id = 'i-am-ready';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Ready a character',
            cost: ability.costs.removeFate({
                cardType: CardType.Character,
                cardCondition: card => card.isFaction('unicorn') && card.bowed
            }),
            cannotBeMirrored: true,
            effect: 'ready {1}',
            effectArgs: (context: AbilityContext) => context.costs.removeFate as DrawCard,
            handler: (context: AbilityContext) => ability.actions.ready().resolve(context.costs.removeFate as DrawCard, context)
        });
    }
}


export default IAmReady;
