import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';

class IAmReady extends DrawCard {
    static id = 'i-am-ready';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Ready a character',
            cost: ability.costs.removeFate({
                cardType: CardTypes.Character,
                cardCondition: (card: any) => card.isFaction('unicorn') && card.bowed
            }),
            cannotBeMirrored: true,
            effect: 'ready {1}',
            effectArgs: (context: any) => context.costs.removeFate,
            handler: (context: any) => ability.actions.ready().resolve(context.costs.removeFate, context)
        });
    }
}


export default IAmReady;
